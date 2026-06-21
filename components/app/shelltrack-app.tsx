"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowLeft,
  Database,
  Download,
  Leaf,
  Pencil,
  Plus,
  Scale,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { ShellMark } from "@/components/app/shell-mark";
import { Button } from "@/components/ui/button";
import {
  createMeasurement,
  createPet,
  clearAllLocalData,
  db,
  deleteMeasurement,
  deletePet,
  ensureDefaultData,
  updateMeasurement,
  updatePet,
} from "@/lib/db";
import type {
  LengthUnit,
  Measurement,
  Pet,
  PetDraft,
  PetSex,
  PetSpecies,
  WeightUnit,
} from "@/lib/domain";
import {
  gramToWeight,
  estimateAgeAtDate,
  isSignificantWeightDrop,
  lengthToMm,
  mmToLength,
  petSpecies,
  weightChangePercent,
  weightToGram,
} from "@/lib/domain";
import {
  downloadFile,
  makeBackup,
  measurementsToCsv,
  parseBackup,
  replaceWithBackup,
} from "@/lib/export";
import {
  formatAgeYears,
  formatCalendarDate,
  formatChartDate,
  formatLength,
  formatNumber,
  formatWeight,
} from "@/lib/i18n/format";
import { getMessages } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

const messages = getMessages();
type View = "pets" | "data";

function today(): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function optionalNumber(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return Number(value);
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-semibold text-primary">
      <span>
        {label}
        {hint ? (
          <span className="ml-2 font-normal text-muted-foreground">{hint}</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "min-h-11 min-w-0 max-w-full w-full rounded-md border bg-white px-3 py-2 text-base font-normal text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid overflow-hidden bg-primary/55 p-0 backdrop-blur-sm sm:place-items-center sm:p-4">
      <section
        aria-label={title}
        aria-modal="true"
        className="flex h-dvh w-full min-w-0 flex-col overflow-hidden bg-background shadow-2xl sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-2xl sm:rounded-lg"
        role="dialog"
      >
        <header className="relative shrink-0 border-b bg-background px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:py-6">
          <h2 className="pr-12 font-display text-2xl font-bold text-primary sm:text-3xl">
            {title}
          </h2>
          {onClose ? (
            <Button
              aria-label={messages.common.cancel}
              className="absolute right-3 top-[max(0.5rem,env(safe-area-inset-top))] sm:right-6 sm:top-4"
              onClick={onClose}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-5" />
            </Button>
          ) : null}
        </header>
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
          {children}
        </div>
      </section>
    </div>
  );
}

function PetForm({ pet, onClose }: { pet?: Pet; onClose: () => void }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const draft: PetDraft = {
      name: String(data.get("name") ?? ""),
      species: String(data.get("species")) as PetSpecies,
      sex: String(data.get("sex")) as PetSex,
      birthDate: String(data.get("birthDate") || "") || undefined,
      estimatedAgeYears: optionalNumber(data.get("estimatedAgeYears")),
      notes: String(data.get("notes") || "") || undefined,
    };
    try {
      if (pet) await updatePet(pet.id, draft);
      else await createPet(draft);
      onClose();
    } catch {
      setError(messages.validation.saveFailed);
      setSaving(false);
    }
  }

  return (
    <Modal
      onClose={onClose}
      title={pet ? messages.pet.editHeading : messages.pet.newHeading}
    >
      <form className="mt-6 grid gap-5" onSubmit={submit}>
        <Field label={messages.pet.name}>
          <input
            className={inputClass}
            defaultValue={pet?.name}
            name="name"
            required
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={messages.pet.species}>
            <select
              className={inputClass}
              defaultValue={pet?.species}
              name="species"
            >
              {petSpecies.map((species) => (
                <option key={species} value={species}>
                  {messages.species[species]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={messages.pet.sex}>
            <select
              className={inputClass}
              defaultValue={pet?.sex ?? "unknown"}
              name="sex"
            >
              {(["unknown", "female", "male"] as const).map((sex) => (
                <option key={sex} value={sex}>
                  {messages.sex[sex]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={messages.pet.birthDate} hint={messages.common.optional}>
            <input
              className={cn(inputClass, "date-input")}
              defaultValue={pet?.birthDate}
              name="birthDate"
              type="date"
            />
          </Field>
          <Field
            label={messages.pet.estimatedAge}
            hint={messages.common.optional}
          >
            <div className="flex items-center gap-3">
              <input
                className={inputClass}
                defaultValue={pet?.estimatedAgeYears}
                min="0"
                name="estimatedAgeYears"
                step="0.1"
                type="number"
              />
              <span className="text-sm font-normal text-muted-foreground">
                {messages.pet.years}
              </span>
            </div>
          </Field>
        </div>
        <Field label={messages.pet.notes} hint={messages.common.optional}>
          <textarea
            className={inputClass}
            defaultValue={pet?.notes}
            name="notes"
            rows={3}
          />
        </Field>
        {error ? (
          <p className="text-sm font-medium text-red-800" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
          <Button onClick={onClose} type="button" variant="outline">
            {messages.common.cancel}
          </Button>
          <Button disabled={saving} type="submit">
            {messages.common.save}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function MeasurementForm({
  petId,
  measurement,
  onClose,
}: {
  petId: string;
  measurement?: Measurement;
  onClose: () => void;
}) {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("g");
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>("mm");
  const [weightInput, setWeightInput] = useState(() =>
    measurement ? String(gramToWeight(measurement.weightGram, "g")) : "",
  );
  const [dateInput, setDateInput] = useState(
    measurement?.measuredAt ?? today(),
  );
  const [dimensionInputs, setDimensionInputs] = useState(() => ({
    shellLength:
      measurement?.shellLengthMm === undefined
        ? ""
        : String(mmToLength(measurement.shellLengthMm, "mm")),
    shellWidth:
      measurement?.shellWidthMm === undefined
        ? ""
        : String(mmToLength(measurement.shellWidthMm, "mm")),
    shellHeight:
      measurement?.shellHeightMm === undefined
        ? ""
        : String(mmToLength(measurement.shellHeightMm, "mm")),
  }));
  const [notesInput, setNotesInput] = useState(measurement?.notes ?? "");
  const [dimensionsOpen, setDimensionsOpen] = useState(
    Boolean(
      measurement?.shellLengthMm ??
        measurement?.shellWidthMm ??
        measurement?.shellHeightMm,
    ),
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function changeWeightUnit(nextUnit: WeightUnit) {
    const value = Number(weightInput);
    if (weightInput !== "" && Number.isFinite(value)) {
      setWeightInput(
        String(gramToWeight(weightToGram(value, weightUnit), nextUnit)),
      );
    }
    setWeightUnit(nextUnit);
  }

  function changeLengthUnit(nextUnit: LengthUnit) {
    const convert = (value: string) => {
      const number = Number(value);
      return value === "" || !Number.isFinite(number)
        ? value
        : String(mmToLength(lengthToMm(number, lengthUnit), nextUnit));
    };
    setDimensionInputs((current) => ({
      shellLength: convert(current.shellLength),
      shellWidth: convert(current.shellWidth),
      shellHeight: convert(current.shellHeight),
    }));
    setLengthUnit(nextUnit);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const weight = Number(weightInput);
    const dimension = (name: keyof typeof dimensionInputs) => {
      const value = optionalNumber(dimensionInputs[name]);
      return value === undefined ? undefined : lengthToMm(value, lengthUnit);
    };
    const draft = {
      petId,
      measuredAt: dateInput,
      weightGram: weightToGram(weight, weightUnit),
      shellLengthMm: dimension("shellLength"),
      shellWidthMm: dimension("shellWidth"),
      shellHeightMm: dimension("shellHeight"),
      notes: notesInput.trim() || undefined,
    };
    try {
      if (measurement) await updateMeasurement(measurement.id, draft);
      else await createMeasurement(draft);
      onClose();
    } catch {
      setError(messages.validation.saveFailed);
      setSaving(false);
    }
  }

  return (
    <Modal
      onClose={onClose}
      title={
        measurement
          ? messages.measurement.editHeading
          : messages.measurement.newHeading
      }
    >
      <form className="mt-6 grid min-w-0 gap-5" onSubmit={submit}>
        <Field label={messages.measurement.date}>
          <input
            className={cn(inputClass, "date-input")}
            name="measuredAt"
            onChange={(event) => setDateInput(event.target.value)}
            required
            type="date"
            value={dateInput}
          />
        </Field>

        <Field label={messages.measurement.weight}>
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_5.5rem] gap-3">
            <input
              className={inputClass}
              inputMode="decimal"
              min="0.001"
              name="weight"
              onChange={(event) => setWeightInput(event.target.value)}
              required
              step="any"
              type="number"
              value={weightInput}
            />
            <select
              aria-label={messages.measurement.weightUnit}
              className={inputClass}
              onChange={(event) =>
                changeWeightUnit(event.target.value as WeightUnit)
              }
              value={weightUnit}
            >
              <option value="g">g</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </Field>

        <details
          className="min-w-0 overflow-hidden rounded-md border bg-muted/40"
          onToggle={(event) => setDimensionsOpen(event.currentTarget.open)}
          open={dimensionsOpen}
        >
          <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-3 font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
            <span>{messages.measurement.dimensions}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {messages.common.optional}
            </span>
          </summary>
          <div className="grid min-w-0 gap-4 border-t p-4">
            <Field label={messages.measurement.lengthUnit}>
              <select
                className={inputClass}
                onChange={(event) =>
                  changeLengthUnit(event.target.value as LengthUnit)
                }
                value={lengthUnit}
              >
                <option value="mm">mm</option>
                <option value="cm">cm</option>
              </select>
            </Field>
            <div className="grid min-w-0 gap-4 sm:grid-cols-3">
              {(
                [
                  ["shellLength", messages.measurement.shellLength],
                  ["shellWidth", messages.measurement.shellWidth],
                  ["shellHeight", messages.measurement.shellHeight],
                ] as const
              ).map(([name, label]) => (
                <Field key={name} label={label}>
                  <input
                    className={inputClass}
                    inputMode="decimal"
                    min="0.001"
                    onChange={(event) =>
                      setDimensionInputs((current) => ({
                        ...current,
                        [name]: event.target.value,
                      }))
                    }
                    step="any"
                    type="number"
                    value={dimensionInputs[name]}
                  />
                </Field>
              ))}
            </div>
          </div>
        </details>

        <Field
          label={messages.measurement.notes}
          hint={messages.common.optional}
        >
          <textarea
            className={cn(inputClass, "min-h-32 resize-y")}
            onChange={(event) => setNotesInput(event.target.value)}
            rows={4}
            value={notesInput}
          />
        </Field>

        {error ? (
          <p className="text-sm font-medium text-red-800" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
          <Button onClick={onClose} type="button" variant="outline">
            {messages.common.cancel}
          </Button>
          <Button disabled={saving} type="submit">
            {messages.common.save}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Confirm({
  title,
  body,
  action,
  onConfirm,
  onClose,
}: {
  title: string;
  body: string;
  action: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} title={title}>
      <p className="mt-4 leading-7 text-muted-foreground">{body}</p>
      <div className="mt-7 flex flex-wrap justify-end gap-3">
        <Button onClick={onClose} variant="outline">
          {messages.common.cancel}
        </Button>
        <Button
          className="bg-red-800 hover:bg-red-900"
          onClick={async () => {
            await onConfirm();
            onClose();
          }}
        >
          {action}
        </Button>
      </div>
    </Modal>
  );
}

function niceWeightTicks(values: number[], targetTickCount = 4): number[] {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const rawStep = Math.max((maximum - minimum) / targetTickCount, 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const fraction = rawStep / magnitude;
  const niceFraction =
    fraction <= 1
      ? 1
      : fraction <= 2
        ? 2
        : fraction <= 2.5
          ? 2.5
          : fraction <= 5
            ? 5
            : 10;
  const step = niceFraction * magnitude;
  const padding = (maximum - minimum || maximum || 1) * 0.08;
  const niceMinimum = Math.max(
    0,
    Math.floor((minimum - padding) / step) * step,
  );
  const niceMaximum = Math.ceil((maximum + padding) / step) * step;
  const ticks: number[] = [];
  for (
    let value = niceMinimum;
    value <= niceMaximum + step / 2;
    value += step
  ) {
    ticks.push(value);
  }
  return ticks;
}

export function WeightChart({ measurements }: { measurements: Measurement[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const ordered = [...measurements].sort((a, b) =>
    a.measuredAt.localeCompare(b.measuredAt),
  );

  useEffect(() => {
    const area = scrollArea.current;
    if (area) area.scrollLeft = area.scrollWidth - area.clientWidth;
  }, [measurements.length]);

  if (ordered.length < 2) return null;

  const chartWidth = Math.max(680, ordered.length * 11);
  const chartHeight = 320;
  const margin = { top: 24, right: 28, bottom: 62, left: 76 };
  const plotWidth = chartWidth - margin.left - margin.right;
  const plotHeight = chartHeight - margin.top - margin.bottom;
  const weights = ordered.map((item) => item.weightGram);
  const yTicks = niceWeightTicks(weights);
  const yMinimum = yTicks[0];
  const yMaximum = yTicks[yTicks.length - 1];
  const yRange = yMaximum - yMinimum || 1;
  const dateValues = ordered.map((item) =>
    Date.parse(`${item.measuredAt}T00:00:00.000Z`),
  );
  const dateMinimum = dateValues[0];
  const dateRange = dateValues[dateValues.length - 1] - dateMinimum || 1;
  const weightUnit = yMaximum >= 1000 ? "kg" : "g";
  const points = ordered.map((measurement, index) => {
    const x =
      margin.left + ((dateValues[index] - dateMinimum) / dateRange) * plotWidth;
    const y =
      margin.top +
      (1 - (measurement.weightGram - yMinimum) / yRange) * plotHeight;
    const previous = ordered[index - 1];
    return {
      measurement,
      x,
      y,
      changePercent: previous
        ? weightChangePercent(previous.weightGram, measurement.weightGram)
        : 0,
      significantDrop: previous
        ? isSignificantWeightDrop(previous.weightGram, measurement.weightGram)
        : false,
    };
  });
  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const baseline = margin.top + plotHeight;
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`;
  const labelCount = 5;
  const dateLabelIndexes = Array.from(
    new Set(
      Array.from({ length: labelCount }, (_, index) =>
        Math.round((index * (ordered.length - 1)) / (labelCount - 1)),
      ),
    ),
  );
  const activePoint = activeIndex === null ? undefined : points[activeIndex];
  const tooltipWidth = 142;
  const tooltipHeight = activePoint?.significantDrop ? 62 : 48;
  const tooltipX = activePoint
    ? Math.min(
        chartWidth - margin.right - tooltipWidth,
        Math.max(margin.left, activePoint.x - tooltipWidth / 2),
      )
    : 0;
  const tooltipY = activePoint
    ? activePoint.y - tooltipHeight - 12 >= margin.top
      ? activePoint.y - tooltipHeight - 12
      : activePoint.y + 12
    : 0;

  return (
    <section className="overflow-hidden rounded-lg border bg-card shadow-ambient">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 className="font-display text-xl font-bold text-primary">
              {messages.pet.chart}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {messages.pet.chartDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-primary" />
              {messages.pet.chartLegendRecorded}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-700" />
              {messages.pet.chartLegendDrop}
            </span>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground sm:hidden">
          {messages.pet.chartScrollHint}
        </p>
      </div>

      <div className="relative border-t bg-gradient-to-b from-muted/25 to-card">
        <div
          aria-label={messages.pet.chartScrollHint}
          className="overflow-x-auto overscroll-x-contain"
          ref={scrollArea}
          tabIndex={0}
        >
          <svg
            aria-label={messages.pet.chart}
            className="block h-80"
            role="img"
            style={{ width: `${chartWidth}px` }}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            <defs>
              <linearGradient id="weightArea" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--secondary))"
                  stopOpacity="0.22"
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--secondary))"
                  stopOpacity="0.02"
                />
              </linearGradient>
            </defs>

            {yTicks.map((tick) => {
              const y =
                margin.top + (1 - (tick - yMinimum) / yRange) * plotHeight;
              return (
                <line
                  className="stroke-border/70"
                  key={tick}
                  strokeDasharray="3 5"
                  x1={margin.left}
                  x2={chartWidth - margin.right}
                  y1={y}
                  y2={y}
                />
              );
            })}

            {dateLabelIndexes.map((index) => {
              const point = points[index];
              return (
                <g key={point.measurement.id}>
                  <line
                    className="stroke-border/50"
                    x1={point.x}
                    x2={point.x}
                    y1={baseline}
                    y2={baseline + 5}
                  />
                  <text
                    className="fill-muted-foreground text-[11px]"
                    textAnchor="middle"
                    x={point.x}
                    y={baseline + 23}
                  >
                    {formatChartDate(point.measurement.measuredAt)}
                  </text>
                </g>
              );
            })}

            <text
              className="fill-muted-foreground text-[11px] font-semibold"
              textAnchor="middle"
              x={margin.left + plotWidth / 2}
              y={chartHeight - 8}
            >
              {messages.pet.chartDateAxis}
            </text>
            <path className="chart-area" d={areaPath} fill="url(#weightArea)" />
            <path
              className="chart-line fill-none stroke-primary"
              d={linePath}
              pathLength="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />

            {points.map((point, index) => {
              if (!point.significantDrop || index === 0) return null;
              const previous = points[index - 1];
              return (
                <line
                  className="chart-line stroke-red-700"
                  key={`drop-${point.measurement.id}`}
                  pathLength="1"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  x1={previous.x}
                  x2={point.x}
                  y1={previous.y}
                  y2={point.y}
                />
              );
            })}

            {points.map((point, index) => (
              <circle
                aria-label={[
                  formatCalendarDate(point.measurement.measuredAt),
                  formatWeight(point.measurement.weightGram, "g"),
                  point.significantDrop ? messages.pet.chartLegendDrop : null,
                ]
                  .filter(Boolean)
                  .join(", ")}
                className={cn(
                  "chart-point cursor-pointer stroke-card stroke-2 outline-none focus:stroke-[4]",
                  point.significantDrop ? "fill-red-700" : "fill-primary",
                )}
                cx={point.x}
                cy={point.y}
                key={point.measurement.id}
                onBlur={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(index)}
                onPointerDown={() => setActiveIndex(index)}
                onPointerEnter={() => setActiveIndex(index)}
                onPointerLeave={() => setActiveIndex(null)}
                r={point.significantDrop ? 4.5 : 3.5}
                role="button"
                tabIndex={0}
              >
                <title>{`${formatCalendarDate(point.measurement.measuredAt)}: ${formatWeight(point.measurement.weightGram, "g")}`}</title>
              </circle>
            ))}

            {activePoint ? (
              <g
                className="pointer-events-none"
                transform={`translate(${tooltipX} ${tooltipY})`}
              >
                <rect
                  fill="hsl(var(--primary))"
                  height={tooltipHeight}
                  rx="8"
                  width={tooltipWidth}
                />
                <text
                  fill="hsl(var(--primary-foreground))"
                  fontSize="11"
                  x="12"
                  y="19"
                >
                  {formatCalendarDate(activePoint.measurement.measuredAt)}
                </text>
                <text
                  fill="hsl(var(--primary-foreground))"
                  fontSize="13"
                  fontWeight="700"
                  x="12"
                  y="38"
                >
                  {formatWeight(activePoint.measurement.weightGram, "g")}
                </text>
                {activePoint.significantDrop ? (
                  <text
                    fill="#fecaca"
                    fontSize="11"
                    fontWeight="600"
                    x="12"
                    y="54"
                  >
                    {formatNumber(activePoint.changePercent, {
                      maximumFractionDigits: 1,
                    })}
                    %
                  </text>
                ) : null}
              </g>
            ) : null}
          </svg>
        </div>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 h-80 w-[76px] bg-card/95 shadow-[8px_0_16px_rgba(27,48,34,0.04)]"
          viewBox={`0 0 ${margin.left} ${chartHeight}`}
        >
          {yTicks.map((tick) => {
            const y =
              margin.top + (1 - (tick - yMinimum) / yRange) * plotHeight;
            return (
              <text
                className="fill-muted-foreground text-[11px]"
                key={tick}
                textAnchor="end"
                x={margin.left - 12}
                y={y + 4}
              >
                {formatWeight(tick, weightUnit)}
              </text>
            );
          })}
          <text
            className="fill-muted-foreground text-[11px] font-semibold"
            textAnchor="middle"
            transform={`rotate(-90 16 ${margin.top + plotHeight / 2})`}
            x={16}
            y={margin.top + plotHeight / 2}
          >
            {weightUnit === "kg"
              ? messages.pet.chartWeightAxisKilogram
              : messages.pet.chartWeightAxisGram}
          </text>
        </svg>
      </div>
    </section>
  );
}

function PetDetail({ petId, onBack }: { petId: string; onBack: () => void }) {
  const pet = useLiveQuery(() => db.pets.get(petId), [petId]);
  const measurements =
    useLiveQuery(
      () => db.measurements.where("petId").equals(petId).sortBy("measuredAt"),
      [petId],
    ) ?? [];
  const [petEditor, setPetEditor] = useState(false);
  const [measurementEditor, setMeasurementEditor] = useState<
    Measurement | "new" | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<Pet | Measurement | null>(
    null,
  );
  if (!pet) return null;
  const ordered = [...measurements].reverse();
  const latest = ordered[0];
  const first = measurements[0];
  const estimatedAge =
    latest && first && pet.estimatedAgeYears !== undefined
      ? estimateAgeAtDate(
          pet.estimatedAgeYears,
          first.measuredAt,
          latest.measuredAt,
        )
      : undefined;
  return (
    <main className="min-w-0 flex-1 px-5 pb-28 pt-8 sm:px-8 lg:pb-10 lg:pt-10">
      <div className="mx-auto max-w-5xl">
        <Button className="-ml-3 mb-6" onClick={onBack} variant="ghost">
          <ArrowLeft className="mr-2 size-4" />
          {messages.pet.back}
        </Button>
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
              {messages.species[pet.species]}
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold text-primary">
              {pet.name}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {messages.sex[pet.sex]}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setMeasurementEditor("new")}>
              <Plus className="mr-2 size-4" />
              {messages.pet.addMeasurement}
            </Button>
            <Button
              aria-label={messages.common.edit}
              onClick={() => setPetEditor(true)}
              variant="outline"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              aria-label={messages.common.delete}
              onClick={() => setDeleteTarget(pet)}
              variant="outline"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </header>
        {latest ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-lg bg-primary p-6 text-primary-foreground sm:col-span-2">
              <p className="text-sm opacity-75">{messages.pet.latestWeight}</p>
              <p className="mt-2 font-display text-4xl font-bold">
                {formatWeight(latest.weightGram, "g")}
              </p>
              <p className="mt-2 text-sm opacity-75">
                {formatCalendarDate(latest.measuredAt)}
              </p>
            </article>
            <article className="rounded-lg border bg-card p-6">
              <p className="text-sm text-muted-foreground">
                {messages.dashboard.measurementCount}
              </p>
              <p className="mt-2 font-display text-4xl font-bold text-primary">
                {formatNumber(measurements.length)}
              </p>
            </article>
            <article className="rounded-lg border bg-card p-6">
              <p className="text-sm text-muted-foreground">
                {messages.pet.estimatedAgeLatest}
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-primary">
                {estimatedAge === undefined
                  ? messages.common.notRecorded
                  : formatAgeYears(estimatedAge)}
              </p>
            </article>
          </div>
        ) : (
          <section className="mt-8 rounded-lg border border-dashed bg-card p-8 text-center">
            <Scale className="mx-auto size-8 text-secondary" />
            <h2 className="mt-4 font-display text-xl font-bold">
              {messages.pet.noMeasurements}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {messages.pet.noMeasurementsBody}
            </p>
          </section>
        )}
        <div className="mt-6">
          <WeightChart measurements={measurements} />
        </div>
        {ordered.length ? (
          <section className="mt-6 overflow-hidden rounded-lg border bg-card shadow-ambient">
            <div className="border-b px-5 py-4">
              <h2 className="font-display text-xl font-bold text-primary">
                {messages.pet.history}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-muted/70 text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">{messages.measurement.date}</th>
                    <th className="px-5 py-3">{messages.measurement.weight}</th>
                    <th className="px-5 py-3">
                      {messages.measurement.shellLength}
                    </th>
                    <th className="px-5 py-3">
                      {messages.measurement.shellWidth}
                    </th>
                    <th className="px-5 py-3">
                      {messages.measurement.shellHeight}
                    </th>
                    <th className="px-5 py-3">
                      <span className="sr-only">{messages.common.edit}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ordered.map((item) => (
                    <tr className="border-t" key={item.id}>
                      <td className="px-5 py-4 font-medium">
                        {formatCalendarDate(item.measuredAt)}
                      </td>
                      <td className="px-5 py-4">
                        {formatWeight(item.weightGram, "g")}
                      </td>
                      {(
                        [
                          item.shellLengthMm,
                          item.shellWidthMm,
                          item.shellHeightMm,
                        ] as const
                      ).map((value, index) => (
                        <td
                          className="px-5 py-4 text-muted-foreground"
                          key={index}
                        >
                          {value === undefined
                            ? messages.common.notRecorded
                            : formatLength(value, "mm")}
                        </td>
                      ))}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <Button
                            aria-label={messages.common.edit}
                            onClick={() => setMeasurementEditor(item)}
                            size="sm"
                            variant="ghost"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            aria-label={messages.common.delete}
                            onClick={() => setDeleteTarget(item)}
                            size="sm"
                            variant="ghost"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
      {petEditor ? (
        <PetForm onClose={() => setPetEditor(false)} pet={pet} />
      ) : null}
      {measurementEditor ? (
        <MeasurementForm
          measurement={
            measurementEditor === "new" ? undefined : measurementEditor
          }
          onClose={() => setMeasurementEditor(null)}
          petId={petId}
        />
      ) : null}
      {deleteTarget ? (
        <Confirm
          action={
            "petId" in deleteTarget
              ? messages.measurement.deleteConfirm
              : messages.pet.deleteConfirm
          }
          body={
            "petId" in deleteTarget
              ? messages.measurement.deleteBody
              : messages.pet.deleteBody
          }
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            if ("petId" in deleteTarget)
              await deleteMeasurement(deleteTarget.id);
            else {
              await deletePet(deleteTarget.id);
              onBack();
            }
          }}
          title={
            "petId" in deleteTarget
              ? messages.measurement.deleteHeading
              : messages.pet.deleteHeading
          }
        />
      ) : null}
    </main>
  );
}

function PetList({ onOpen }: { onOpen: (id: string) => void }) {
  const pets =
    useLiveQuery(() => db.pets.orderBy("updatedAt").reverse().toArray()) ?? [];
  const measurements = useLiveQuery(() => db.measurements.toArray()) ?? [];
  const [editing, setEditing] = useState(false);
  return (
    <main className="min-w-0 flex-1 px-5 pb-28 pt-8 sm:px-8 lg:pb-10 lg:pt-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
              {messages.dashboard.eyebrow}
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold text-primary">
              {messages.dashboard.heading}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {messages.dashboard.introduction}
            </p>
          </div>
          <Button onClick={() => setEditing(true)}>
            <Plus className="mr-2 size-4" />
            {messages.dashboard.addPet}
          </Button>
        </header>
        {pets.length ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {pets.map((pet) => {
              const records = measurements
                .filter((item) => item.petId === pet.id)
                .sort((a, b) => b.measuredAt.localeCompare(a.measuredAt));
              return (
                <article
                  className="group rounded-lg border bg-card p-6 shadow-[0_2px_8px_rgba(27,48,34,0.04)] transition hover:-translate-y-0.5 hover:shadow-ambient motion-reduce:transform-none"
                  key={pet.id}
                >
                  <div className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-md bg-accent text-accent-foreground">
                      <Leaf className="size-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {messages.species[pet.species]}
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-bold text-primary">
                    {pet.name}
                  </h2>
                  <div className="mt-5 grid grid-cols-2 gap-4 border-y py-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {messages.dashboard.latest}
                      </p>
                      <p className="mt-1 font-display font-semibold">
                        {records[0]
                          ? formatWeight(records[0].weightGram, "g")
                          : messages.common.notRecorded}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {messages.dashboard.measurementCount}
                      </p>
                      <p className="mt-1 font-display font-semibold">
                        {formatNumber(records.length)}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="mt-5 w-full"
                    onClick={() => onOpen(pet.id)}
                    variant="outline"
                  >
                    {messages.dashboard.openPet}
                  </Button>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="mt-8 rounded-lg border border-dashed bg-card px-6 py-16 text-center">
            <ShellMark className="mx-auto size-14" />
            <h2 className="mt-5 font-display text-2xl font-bold text-primary">
              {messages.dashboard.emptyHeading}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              {messages.dashboard.emptyBody}
            </p>
            <Button className="mt-6" onClick={() => setEditing(true)}>
              <Plus className="mr-2 size-4" />
              {messages.dashboard.addPet}
            </Button>
          </section>
        )}
      </div>
      {editing ? <PetForm onClose={() => setEditing(false)} /> : null}
    </main>
  );
}

function DataView({ onImported }: { onImported: () => void }) {
  const petCount = useLiveQuery(() => db.pets.count()) ?? 0;
  const measurements = useLiveQuery(() => db.measurements.toArray()) ?? [];
  const [backup, setBackup] = useState<unknown>();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [status, setStatus] = useState("");
  async function exportJson() {
    const value = await makeBackup();
    downloadFile(
      JSON.stringify(value, null, 2),
      "shelltrack-backup.json",
      "application/json",
    );
  }
  function exportCsv() {
    if (!measurements.length) {
      setStatus(messages.data.noMeasurements);
      return;
    }
    downloadFile(
      measurementsToCsv(measurements),
      "shelltrack-measurements.csv",
      "text/csv;charset=utf-8",
    );
  }
  async function choose(file?: File) {
    if (!file) return;
    try {
      const value: unknown = JSON.parse(await file.text());
      parseBackup(value);
      setBackup(value);
      setStatus("");
    } catch {
      setBackup(undefined);
      setStatus(messages.data.importError);
    }
  }
  return (
    <main className="min-w-0 flex-1 px-5 pb-28 pt-8 sm:px-8 lg:pb-10 lg:pt-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
          {messages.data.eyebrow}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-primary">
          {messages.data.heading}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {messages.data.introduction}
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <section className="rounded-lg border bg-card p-6 shadow-ambient">
            <Download className="size-7 text-secondary" />
            <h2 className="mt-5 font-display text-xl font-bold text-primary">
              {messages.data.exportHeading}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {messages.data.exportBody}
            </p>
            <div className="mt-6 grid gap-3">
              <Button onClick={exportJson}>{messages.data.exportJson}</Button>
              <Button onClick={exportCsv} variant="outline">
                {messages.data.exportCsv}
              </Button>
            </div>
          </section>
          <section className="rounded-lg border bg-card p-6 shadow-ambient">
            <Upload className="size-7 text-secondary" />
            <h2 className="mt-5 font-display text-xl font-bold text-primary">
              {messages.data.importHeading}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {messages.data.importBody}
            </p>
            <label className="mt-6 flex min-h-11 cursor-pointer items-center justify-center rounded-md border bg-background px-4 text-sm font-semibold text-primary">
              <input
                accept="application/json,.json"
                className="sr-only"
                onChange={(event) => choose(event.target.files?.[0])}
                type="file"
              />
              {messages.data.chooseFile}
            </label>
            {backup ? (
              <div className="mt-4 rounded-md bg-amber-50 p-4 text-sm text-amber-950">
                <p>{messages.data.replaceWarning}</p>
                <Button
                  className="mt-4"
                  onClick={async () => {
                    try {
                      await replaceWithBackup(backup);
                      setBackup(undefined);
                      setStatus(messages.data.importSuccess);
                      onImported();
                    } catch {
                      setStatus(messages.data.importError);
                    }
                  }}
                >
                  {messages.data.importConfirm}
                </Button>
              </div>
            ) : null}
          </section>
        </div>
        <section className="mt-8 rounded-lg border border-red-200 bg-red-50/70 p-6">
          <Trash2 className="size-7 text-red-800" />
          <h2 className="mt-5 font-display text-xl font-bold text-red-950">
            {messages.data.deleteHeading}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-red-950/75">
            {messages.data.deleteBody}
          </p>
          <Button
            className="mt-6 bg-red-800 hover:bg-red-900"
            disabled={petCount === 0 && measurements.length === 0}
            onClick={() => setConfirmDelete(true)}
          >
            {messages.data.deleteAction}
          </Button>
        </section>
        {status ? (
          <p
            className="mt-5 rounded-md bg-muted p-4 text-sm font-medium"
            role="status"
          >
            {status}
          </p>
        ) : null}
      </div>
      {confirmDelete ? (
        <Confirm
          action={messages.data.deleteAction}
          body={messages.data.deleteBody}
          onClose={() => setConfirmDelete(false)}
          onConfirm={async () => {
            await clearAllLocalData();
            setBackup(undefined);
            setStatus(messages.data.deleteSuccess);
          }}
          title={messages.data.deleteHeading}
        />
      ) : null}
    </main>
  );
}

export function ShellTrackApp() {
  const [view, setView] = useState<View>("pets");
  const [petId, setPetId] = useState<string>();
  useEffect(() => {
    void ensureDefaultData();
  }, []);
  return (
    <div className="min-h-dvh lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-primary px-5 py-7 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <ShellMark className="size-10 text-primary-foreground" />
          <div>
            <p className="font-display text-lg font-bold">
              {messages.common.appName}
            </p>
            <p className="text-xs opacity-70">{messages.common.tagline}</p>
          </div>
        </div>
        <nav className="mt-12 grid gap-2">
          {(["pets", "data"] as View[]).map((item) => (
            <button
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-md px-4 text-left text-sm font-semibold transition",
                view === item && !petId ? "bg-white/12" : "hover:bg-white/8",
              )}
              key={item}
              onClick={() => {
                setPetId(undefined);
                setView(item);
              }}
            >
              {item === "pets" ? (
                <Leaf className="size-5" />
              ) : (
                <Database className="size-5" />
              )}
              {messages.nav[item]}
            </button>
          ))}
        </nav>
        <p className="mt-auto flex items-center gap-2 text-xs opacity-70">
          <ShieldCheck className="size-4" />
          {messages.nav.localStatus}
        </p>
      </aside>
      {petId ? (
        <PetDetail onBack={() => setPetId(undefined)} petId={petId} />
      ) : view === "pets" ? (
        <PetList onOpen={setPetId} />
      ) : (
        <DataView
          onImported={() => {
            setView("pets");
            setPetId(undefined);
          }}
        />
      )}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t bg-card/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
        {(["pets", "data"] as View[]).map((item) => (
          <button
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-xs font-semibold",
              view === item && !petId
                ? "text-primary"
                : "text-muted-foreground",
            )}
            key={item}
            onClick={() => {
              setPetId(undefined);
              setView(item);
            }}
          >
            {item === "pets" ? (
              <Leaf className="size-5" />
            ) : (
              <Database className="size-5" />
            )}
            {messages.nav[item]}
          </button>
        ))}
      </nav>
    </div>
  );
}
