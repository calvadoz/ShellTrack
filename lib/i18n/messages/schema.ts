export type PrincipleId = "local" | "flexible" | "growth";

export type Messages = {
  common: {
    appName: string;
    tagline: string;
  };
  metadata: {
    titleTemplate: string;
    description: string;
  };
  loading: {
    label: string;
    status: string;
  };
  home: {
    eyebrow: string;
    heading: string;
    introduction: string;
    principlesLabel: string;
    principles: ReadonlyArray<{
      id: PrincipleId;
      title: string;
      description: string;
    }>;
    footer: string;
  };
};
