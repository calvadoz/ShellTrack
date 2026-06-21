import type { Messages } from "@/lib/i18n/messages/schema";

export const en: Messages = {
  common: {
    appName: "ShellTrack",
    tagline: "Steadfast care",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    optional: "Optional",
    notRecorded: "Not recorded",
  },
  metadata: {
    titleTemplate: "%s · ShellTrack",
    description: "A private growth journal for the pets in your care.",
  },
  loading: { label: "Loading ShellTrack", status: "Loading…" },
  home: {
    eyebrow: "Local-first growth tracking",
    heading: "Every small change tells a longer story.",
    introduction:
      "Keep each pet’s measurements together in a private journal saved on this device.",
    principlesLabel: "Product principles",
    principles: [
      {
        id: "local",
        title: "Local by design",
        description: "Your pet records stay in this browser on this device.",
      },
      {
        id: "flexible",
        title: "Useful, not rigid",
        description:
          "Weight is essential. Shell dimensions are always optional.",
      },
      {
        id: "growth",
        title: "A clear history",
        description:
          "See measurements over time without unsupported health claims.",
      },
    ],
    footer: "Iteration 2 · Local-first MVP",
  },
  nav: { pets: "Pets", data: "Data", localStatus: "Saved on this device" },
  dashboard: {
    eyebrow: "Your pets",
    heading: "Growth journals",
    introduction: "Record weight and optional shell dimensions over time.",
    addPet: "Add a pet",
    emptyHeading: "Add your first pet",
    emptyBody: "Create a profile, then begin a private measurement history.",
    latest: "Latest weight",
    measurementCount: "Measurements",
    openPet: "View journal",
  },
  pet: {
    newHeading: "Add a pet",
    editHeading: "Edit pet",
    name: "Name",
    species: "Species",
    sex: "Sex",
    birthDate: "Birth date",
    estimatedAge: "Age at first measurement",
    estimatedAgeLatest: "Estimated age at latest record",
    notes: "Notes",
    years: "years",
    deleteHeading: "Delete this pet?",
    deleteBody:
      "This also deletes every measurement in this journal. This cannot be undone.",
    deleteConfirm: "Delete pet and measurements",
    back: "Back to pets",
    addMeasurement: "Add measurement",
    noMeasurements: "No measurements yet",
    noMeasurementsBody: "Add a date and weight to begin the growth history.",
    latestWeight: "Latest weight",
    history: "Measurement history",
    chart: "Weight over time",
    chartDescription:
      "A visual summary of recorded weight. The full values are listed below.",
  },
  measurement: {
    newHeading: "Add measurement",
    editHeading: "Edit measurement",
    date: "Date",
    weight: "Weight",
    weightUnit: "Weight unit",
    dimensions: "Shell dimensions",
    shellLength: "Shell length",
    shellWidth: "Shell width",
    shellHeight: "Shell height",
    lengthUnit: "Length unit",
    notes: "Notes",
    deleteHeading: "Delete this measurement?",
    deleteBody: "This removes the measurement from the growth history.",
    deleteConfirm: "Delete measurement",
  },
  validation: {
    required: "Enter a value.",
    positive: "Enter a number greater than zero.",
    saveFailed:
      "ShellTrack could not save this. Check the fields and try again.",
  },
  data: {
    eyebrow: "Portable records",
    heading: "Your data",
    introduction:
      "Download a backup or move a ShellTrack backup into this browser.",
    exportHeading: "Export",
    exportBody:
      "JSON keeps a complete backup. CSV contains measurement rows for spreadsheets.",
    exportJson: "Download JSON backup",
    exportCsv: "Download measurements CSV",
    importHeading: "Import",
    importBody:
      "ShellTrack checks the complete backup before changing anything.",
    chooseFile: "Choose JSON backup",
    replaceWarning:
      "Importing replaces every pet and measurement currently in this browser.",
    importConfirm: "Replace with this backup",
    importSuccess: "Backup imported.",
    importError: "This is not a valid ShellTrack backup. Nothing was changed.",
    noMeasurements: "Add a measurement before exporting CSV.",
    deleteHeading: "Delete all local data?",
    deleteBody:
      "This deletes every pet and measurement saved by ShellTrack in this browser on this device. Downloaded backup files are not affected. This cannot be undone.",
    deleteAction: "Delete all local data",
    deleteSuccess: "All local ShellTrack data was deleted.",
  },
  species: {
    "hermanns-tortoise": "Hermann’s tortoise",
    "russian-tortoise": "Russian tortoise",
    "greek-tortoise": "Greek tortoise",
    "sulcata-tortoise": "Sulcata tortoise",
    "leopard-tortoise": "Leopard tortoise",
    "red-footed-tortoise": "Red-footed tortoise",
    other: "Other",
  },
  sex: { male: "Male", female: "Female", unknown: "Unknown" },
};
