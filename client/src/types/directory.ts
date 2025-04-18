/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

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
