export type extractedData = {
  sources: string | null;
  tracks: [
    {
      file: string | null;
      label: string | null;
      kind: string | null;
      default: boolean | null;
    },
    {
      file: string | null;
      kind: string | null;
    }
  ];
};
