interface DirectoryTree {
  name: string;
  type: "directory" | "file";
  parent: string;
  content: string | DirectoryTree[];
  sync: boolean;
}

export type { DirectoryTree };
