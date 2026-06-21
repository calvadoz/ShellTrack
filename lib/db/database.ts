import Dexie, { type EntityTable } from "dexie";

import type {
  Measurement,
  MeasurementDraft,
  Pet,
  PetDraft,
} from "@/lib/domain";
import { defaultMeasurements, defaultPets } from "@/lib/db/default-data";
import {
  measurementDraftSchema,
  petDraftSchema,
} from "@/lib/validation/schemas";

class ShellTrackDatabase extends Dexie {
  pets!: EntityTable<Pet, "id">;
  measurements!: EntityTable<Measurement, "id">;
  appState!: EntityTable<{ key: string; value: string }, "key">;

  constructor(name = "shelltrack") {
    super(name);
    this.version(1).stores({
      pets: "id, name, species, updatedAt",
      measurements: "id, petId, measuredAt, [petId+measuredAt]",
    });
    this.version(2).stores({
      pets: "id, name, species, updatedAt",
      measurements: "id, petId, measuredAt, [petId+measuredAt]",
      appState: "key",
    });
  }
}

export const db = new ShellTrackDatabase();
export { ShellTrackDatabase };

const defaultDataStateKey = "default-data-v1";

export async function ensureDefaultData(): Promise<void> {
  await db.transaction(
    "rw",
    db.pets,
    db.measurements,
    db.appState,
    async () => {
      if (await db.appState.get(defaultDataStateKey)) return;
      await db.pets.bulkAdd(defaultPets);
      await db.measurements.bulkAdd(defaultMeasurements);
      await db.appState.put({ key: defaultDataStateKey, value: "complete" });
    },
  );
}

function nowIso(): string {
  return new Date().toISOString();
}

export async function createPet(draft: PetDraft): Promise<Pet> {
  const validated = petDraftSchema.parse(draft);
  const timestamp = nowIso();
  const pet: Pet = {
    ...validated,
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await db.pets.add(pet);
  return pet;
}

export async function updatePet(id: string, draft: PetDraft): Promise<void> {
  const validated = petDraftSchema.parse(draft);
  const changed = await db.pets.update(id, {
    ...validated,
    updatedAt: nowIso(),
  });
  if (!changed) throw new Error("Pet not found");
}

export async function deletePet(id: string): Promise<void> {
  await db.transaction("rw", db.pets, db.measurements, async () => {
    await db.measurements.where("petId").equals(id).delete();
    await db.pets.delete(id);
  });
}

export async function createMeasurement(
  draft: MeasurementDraft,
): Promise<Measurement> {
  const validated = measurementDraftSchema.parse(draft);
  if (!(await db.pets.get(validated.petId))) throw new Error("Pet not found");
  const timestamp = nowIso();
  const measurement: Measurement = {
    ...validated,
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await db.measurements.add(measurement);
  return measurement;
}

export async function updateMeasurement(
  id: string,
  draft: MeasurementDraft,
): Promise<void> {
  const validated = measurementDraftSchema.parse(draft);
  if (!(await db.pets.get(validated.petId))) throw new Error("Pet not found");
  const changed = await db.measurements.update(id, {
    ...validated,
    updatedAt: nowIso(),
  });
  if (!changed) throw new Error("Measurement not found");
}

export async function deleteMeasurement(id: string): Promise<void> {
  await db.measurements.delete(id);
}

export async function clearAllLocalData(): Promise<void> {
  await db.transaction("rw", db.pets, db.measurements, async () => {
    await db.measurements.clear();
    await db.pets.clear();
  });
}
