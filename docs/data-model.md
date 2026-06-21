# Data Model

These are the main data rules for the first working version. Iteration 1 records the plan but does not yet save data or add editing features.

## Pet

```ts
type Pet = {
  id: string;
  name: string;
  species: PetSpecies;
  sex: "male" | "female" | "unknown";
  birthDate?: string;
  estimatedAgeYears?: number;
  photoUrl?: string;
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
- Dates use valid ISO strings. A measurement date must not change unexpectedly because of a time zone.
- Iteration 1 IDs are generated locally.
- Deleting a pet must safely handle all measurements linked to that pet in the same action.
- Check imported files before saving anything, and include a format version in exported files.

## Saving data on the device

The next iteration will use IndexedDB through Dexie. Iteration 1 does not need cloud tables, accounts, or sync details.
