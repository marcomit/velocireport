import { DirectoryTree } from "@/types/directory";
import { create } from "zustand";

interface DirectoriesState {
  directories: DirectoryTree[];
  selected: number[];
  rename: {
    name: string;
    path: DirectoryTree["path"];
  };
  getSelected: () => DirectoryTree;
  setRename: ({
    path,
    name,
  }: {
    path?: DirectoryTree["path"];
    name?: string;
  }) => void;
  updateSelectedContent: (content: string) => void;
  changeSelected: (selected: number[]) => void;
  setDirectories: (directories: DirectoryTree[]) => void;
  changeTabState: (tab: DirectoryTree) => void;
  getOpenDirectories: () => DirectoryTree[];
  //   updateContent: (paths: Omit<DirectoryTree, ''>[],) => void;
}

const useDirectories = create<DirectoriesState>()((set, get) => ({
  directories: [],
  selected: [],
  rename: { name: "", path: [] },
  getSelected: () => {
    const store = get();
    let selected: DirectoryTree;
    selected = store.directories[store.selected[0]];

    for (let i = 1; i < store.selected.length; i++) {
      selected = selected.content[store.selected[i]] as DirectoryTree;
    }
    return selected;
  },

  setRename: ({ path: path, name: name }) => {
    const newRename = { ...get().rename };
    if (path) {
      newRename.path = path;
    }
    if (name) {
      newRename.name = name;
    }
    set({ rename: newRename });
  },
  updateSelectedContent: (content: string) => {
    const store = get();
    const selected = store.getSelected();
    selected.content = content;
    selected.sync = false;
    set({ directories: [...store.directories] });
  },
  changeSelected: (selected) => set({ selected: [...selected] }),
  setDirectories: (directories) => set({ directories }),
  changeTabState: (tab) => {
    /* const directories = [...get().directories];
    let head = directories;
    for (let i = 0; i < tab.path.length - 1; i++) {
      head[i] = {
        ...head[i],
        content: [...(head[i].content as DirectoryTree[])],
      };
      head = head[i].content as DirectoryTree[];
    }
    const fileIndex = tab.path[tab.path.length - 1];
    const file = { ...head[fileIndex] };
    file.open = !file.open;
    head[fileIndex] = file;
    set({ directories }); */

    tab.open = !tab.open;
    set({ directories: get().directories });
  },
  getOpenDirectories: () => {
    const open: DirectoryTree[] = [];
    function dfs(directory: DirectoryTree) {
      if (directory.type === "directory") {
        if (typeof directory.content === "string") return;
        directory.content.forEach(dfs);
      } else if (directory.open) {
        open.push(directory);
      }
    }
    const { directories } = get();
    directories.forEach(dfs);
    return open;
  },
}));

export default useDirectories;
