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
  //   updateContent: (paths: Omit<DirectoryTree, ''>[],) => void;
}

const useDirectories = create<DirectoriesState>()((set, get) => ({
  directories: [],
  selected: [],
  getSelected: () => {
    const store = get();
    let selected: DirectoryTree;
    selected = store.directories[store.selected[0]];

    for (let i = 1; i < store.selected.length; i++) {
      selected = selected.content[store.selected[i]] as DirectoryTree;
    }
    return selected;
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
