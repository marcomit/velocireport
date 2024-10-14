import { DirectoryTree } from "@/types/directory";
import { create } from "zustand";

interface TemplatesState {
  templates: DirectoryTree[];
  set: (templates: DirectoryTree[]) => void;
}

const useTemplates = create<TemplatesState>()((set) => ({
  templates: [],
  set: (templates) => set({ templates }),
}));

export default useTemplates;
