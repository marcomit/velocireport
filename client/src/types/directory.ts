interface DirectoryTree {
  name: string;
  type: "directory" | "file";
  parent: string;
  content: string | DirectoryTree[];
  sync: boolean;
  open: boolean;
  path: number[];
}

export type { DirectoryTree };
