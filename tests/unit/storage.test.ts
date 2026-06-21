import { afterEach, describe, expect, it } from "vitest";

import {
  clearAllLocalData,
  createMeasurement,
  createPet,
  db,
  deletePet,
  ensureDefaultData,
} from "@/lib/db";
import { defaultMeasurements, defaultPets } from "@/lib/db/default-data";
import { measurementSchema, petSchema } from "@/lib/validation/schemas";

afterEach(async () => {
  await db.measurements.clear();
  await db.pets.clear();
  await db.appState.clear();
});

describe("device storage", () => {
  it("seeds Debbie and Jake exactly once in a new local database", async () => {
    await ensureDefaultData();
    await ensureDefaultData();

    expect(await db.pets.count()).toBe(2);
    expect(await db.measurements.count()).toBe(276);
    expect(await db.pets.get(defaultPets[0].id)).toMatchObject({
      name: "Debbie",
      species: "leopard-tortoise",
      sex: "male",
      estimatedAgeYears: 1.5,
    });
    expect(await db.pets.get(defaultPets[1].id)).toMatchObject({
      name: "Jake",
      species: "leopard-tortoise",
      sex: "male",
      estimatedAgeYears: 1,
    });
  });

  it("adds the defaults without removing an existing pet", async () => {
    await createPet({ name: "Moss", species: "other", sex: "unknown" });

    await ensureDefaultData();

    expect(await db.pets.count()).toBe(3);
    expect(await db.pets.where("name").equals("Moss").count()).toBe(1);
    expect(await db.measurements.count()).toBe(276);
  });

  it("keeps the default data deleted after local records are cleared", async () => {
    await ensureDefaultData();
    await clearAllLocalData();
    await ensureDefaultData();

    expect(await db.pets.count()).toBe(0);
    expect(await db.measurements.count()).toBe(0);
  });

  it("keeps every default record valid and every weight in grams", () => {
    expect(defaultPets.every((pet) => petSchema.safeParse(pet).success)).toBe(
      true,
    );
    expect(
      defaultMeasurements.every(
        (measurement) =>
          measurementSchema.safeParse(measurement).success &&
          Number.isInteger(measurement.weightGram),
      ),
    ).toBe(true);
    expect(
      defaultMeasurements.find(
        (measurement) =>
          measurement.petId === defaultPets[0].id &&
          measurement.measuredAt === "2025-04-06",
      )?.weightGram,
    ).toBe(3050);
    for (const pet of defaultPets) {
      const dates = defaultMeasurements
        .filter((measurement) => measurement.petId === pet.id)
        .map((measurement) => measurement.measuredAt);
      expect(dates).toEqual([...dates].sort());
      expect(new Set(dates).size).toBe(dates.length);
    }
  });

  it("saves a pet and weight-only measurement", async () => {
    const pet = await createPet({
      name: "Moss",
      species: "hermanns-tortoise",
      sex: "unknown",
    });
    const measurement = await createMeasurement({
      petId: pet.id,
      measuredAt: "2026-06-21",
      weightGram: 420,
    });

    expect(await db.pets.get(pet.id)).toEqual(pet);
    expect(
      (await db.measurements.get(measurement.id))?.shellWidthMm,
    ).toBeUndefined();
  });

  it("deletes a pet and linked measurements in one action", async () => {
    const pet = await createPet({
      name: "Fern",
      species: "other",
      sex: "female",
    });
    await createMeasurement({
      petId: pet.id,
      measuredAt: "2026-06-20",
      weightGram: 80,
    });

    await deletePet(pet.id);

    expect(await db.pets.count()).toBe(0);
    expect(await db.measurements.count()).toBe(0);
  });

  it("deletes every local pet and measurement", async () => {
    const firstPet = await createPet({
      name: "Fern",
      species: "other",
      sex: "female",
    });
    await createPet({
      name: "Moss",
      species: "hermanns-tortoise",
      sex: "unknown",
    });
    await createMeasurement({
      petId: firstPet.id,
      measuredAt: "2026-06-21",
      weightGram: 80,
    });

    await clearAllLocalData();

    expect(await db.pets.count()).toBe(0);
    expect(await db.measurements.count()).toBe(0);
  });
});
