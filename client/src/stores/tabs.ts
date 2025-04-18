/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

/* import { DirectoryTree } from "@/types/directory";
import { create } from "zustand";

interface TabsState {
  tabs: DirectoryTree[];
  selected: DirectoryTree | undefined;
  changeSelected: (file: DirectoryTree | undefined) => void;
  open: (fileName: DirectoryTree) => void;
  close: (file: DirectoryTree) => void;
  last: () => DirectoryTree | undefined;
  updateContent: (fileName: string, content: string) => void;
  sync: (file?: DirectoryTree) => void;
}

const useTabs = create<TabsState>()((set, get) => ({
  tabs: [],
  selected: undefined,
  changeSelected: (selected) => set({ selected }),
  open: (fileName) => set((state) => ({ tabs: [...state.tabs, fileName] })),
  close: (file) => {
    const store = get();
    set((state) => ({ tabs: state.tabs.filter((f) => f !== file) }));
    if (store.selected === file) {
      store.changeSelected(store.last());
    }
  },
  last: () => {
    const tabs = get().tabs;
    if (tabs.length === 0) return undefined;
    return tabs[tabs.length - 1];
  },
  updateContent: (fileName, content) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (tab.name === fileName) {
          return { ...tab, content, sync: false };
        }
        return tab;
      }),
    }));
  },
  sync: (file) => {
    if (file) {
      set((state) => ({
        tabs: state.tabs.map((tab) => {
          if (tab.name === file.name) {
            return { ...tab, sync: true };
          }
          return tab;
        }),
      }));
      return;
    }

    set((state) => ({
      tabs: state.tabs.map((tab) => {
        if (!tab.sync) {
          return { ...tab, sync: false };
        }
        return tab;
      }),
    }));
  },
}));

export default useTabs;
 */
