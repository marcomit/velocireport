/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

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
