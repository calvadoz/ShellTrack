# Data Model

These are the main data rules for the local-first working version.

## Pet

```ts
type Pet = {
  id: string;
  name: string;
  species: PetSpecies;
  sex: "male" | "female" | "unknown";
  birthDate?: string;
  estimatedAgeYears?: number; // age at the first measurement
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
```

Species starts with known tortoise types and includes `other`, making it easier to support more pets later.

## Measurement

```ts
type Measurement = {
  id: string;
  petId: string;
  measuredAt: string;
  weightGram: number;
  shellLengthMm?: number;
  shellWidthMm?: number;
  shellHeightMm?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
```

## Important rules

- `weightGram` is required, must be a real number, and must be greater than zero.
- Each shell dimension is optional independently. A measurement with only date and weight is valid.
- The app saves weight in grams and shell dimensions in millimeters. It can show friendlier units on screen.
- User-chosen calendar dates use `YYYY-MM-DD`. Audit fields use full ISO timestamps.
- IDs are generated locally with UUIDs.
- When present, `estimatedAgeYears` is the pet's estimated age at its first measurement. The latest estimate adds elapsed calendar time using a 365.2425-day average year.
- Deleting a pet must safely handle all measurements linked to that pet in the same action.
- Check imported files before saving anything, and include a format version in exported files.

## Saving data on the device

Iteration 2 uses IndexedDB through Dexie. JSON imports are fully validated before an atomic replacement transaction. The app has no cloud tables, accounts, or sync.

Database version 2 receives the versioned default data described in `docs/default-data.md` once without removing existing records. Deleting all local pet data does not reset this marker or restore the defaults.
