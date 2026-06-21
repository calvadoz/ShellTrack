import type { Messages } from "@/lib/i18n/messages/schema";

export const en: Messages = {
  common: {
    appName: "ShellTrack",
    tagline: "Steadfast care",
  },
  metadata: {
    titleTemplate: "%s · ShellTrack",
    description: "A private growth journal for the pets in your care.",
  },
  loading: {
    label: "Loading ShellTrack",
    status: "Loading…",
  },
  home: {
    eyebrow: "Foundation ready",
    heading: "Every small change tells a longer story.",
    introduction:
      "ShellTrack is becoming a private growth journal for tortoises, with room for the other pets that share your life.",
    principlesLabel: "Product principles",
    principles: [
      {
        id: "local",
        title: "Local by design",
        description:
          "Your pet records stay on this device in the first release.",
      },
      {
        id: "flexible",
        title: "Useful, not rigid",
        description:
          "Weight is essential. Shell dimensions are always optional.",
      },
      {
        id: "growth",
        title: "Ready to grow",
        description:
          "A calm foundation for richer tracking in the next iteration.",
      },
    ],
    footer: "Iteration 1 · Project foundation",
  },
};
