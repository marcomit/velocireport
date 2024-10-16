import { DirectoryTree } from "@/types/directory";
import { create } from "zustand";

interface DirectoriesState {
  directories: DirectoryTree[];
  selected: number[];
  getSelected: () => DirectoryTree;
  changeSelected: (selected: number[]) => void;
  setDirectories: (directories: DirectoryTree[]) => void;
  changeTabState: (tab: DirectoryTree) => void;
  getOpenDirectories: () => DirectoryTree[];
  getPath: (file: DirectoryTree) => number[];
  //   updateContent: (paths: Omit<DirectoryTree, ''>[],) => void;
}

const useDirectories = create<DirectoriesState>()((set, get) => ({
  directories: [],
  selected: [],
  getSelected: () => {
    const store = get();
    let selected: DirectoryTree;
    selected = store.directories[store.selected[0]];
    for (let i = 0; i < store.selected.length; i++) {
      selected = selected.content[store.selected[i]] as DirectoryTree;
    }
    return selected;
  },
  changeSelected: (selected) => set({ selected }),
  setDirectories: (directories) => set({ directories }),
  changeTabState: (tab) => {
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
  getPath: (file) => {
    const parent = file.parent.split("/");
    const path: number[] = [];
    const store = get();

    for (let i = 0; i < parent.length; i++) {
      const index = store.directories.findIndex(
        (dir) => dir.name === parent[i]
      );
      if (index === -1) return path;
      path.push(index);
    }

    return path;
  },
}));

export default useDirectories;
