# Default Data

ShellTrack seeds Debbie and Jake once when a browser first opens database version 2. Existing unrelated records remain in place. The seed marker remains when the user deletes all pet data, so deleted defaults do not return.

## Pet details

- Debbie is a male leopard tortoise estimated to be 1.5 years old at her first measurement on 2023-02-18.
- Jake is a male leopard tortoise estimated to be 1 year old at his first measurement on 2023-03-06.

The displayed estimated age uses the latest measurement date:

```text
age at latest record = age at first measurement
                     + (latest date - first date) / 365.2425 days
```

Future measurements therefore update the estimate without changing the stored baseline age.

## Source normalization

- Whole-number weights are grams. Decimal weights are kilograms converted to grams by multiplying by 1,000.
- Debbie's out-of-sequence dates were normalized to 2024-02-18, 2024-06-02, 2024-10-07, 2025-03-17, 2025-04-06, and 2025-06-01.
- Jake's out-of-sequence dates were normalized to 2024-02-18, 2025-01-07, 2025-02-02, 2025-04-06, 2025-04-27, 2025-06-01, 2025-07-20, and 2025-08-18.
- Unusual but valid weight changes remain exactly as supplied.

The seed contains 139 Debbie measurements and 137 Jake measurements.
