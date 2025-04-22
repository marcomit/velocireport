/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

export const variants = {
  // === Core Variants ===
  primary: {
    table: "border-2 border-gray-300",
    th: "bg-gray-100 p-3 border-b-2 border-gray-300 font-semibold",
    td: "p-3 border-b border-gray-200",
  },
  secondary: {
    table: "border border-gray-200",
    th: "bg-gray-50 p-2 border-b border-gray-200 font-medium",
    td: "p-2 border-b border-gray-100",
  },
  clear: {
    table: "",
    th: "",
    td: "",
  },

  // === Border Width ===
  "border-sm": {
    table: "border",
    th: "border-b",
    td: "border-b",
  },
  "border-md": {
    table: "border-2",
    th: "border-b-2",
    td: "border-b",
  },
  "border-lg": {
    table: "border-4",
    th: "border-b-4",
    td: "border-b-2",
  },

  // === Border Color ===
  "border-black": {
    table: "border-black",
    th: "border-black",
    td: "border-black",
  },
  "border-gray": {
    table: "border-gray-300",
    th: "border-gray-300",
    td: "border-gray-300",
  },
  "border-red": {
    table: "border-red-500",
    th: "border-red-500",
    td: "border-red-500",
  },

  // === Border Radius ===
  "rounded-none": {
    table: "rounded-none",
    th: "rounded-none",
    td: "rounded-none",
  },
  "rounded-sm": {
    table: "rounded-sm",
    th: "rounded-sm",
    td: "rounded-sm",
  },
  "rounded-md": {
    table: "rounded-md",
    th: "rounded-md first:rounded-tl-md last:rounded-tr-md",
    td: "rounded-md",
  },

  // === Striped Rows ===
  "striped-none": {
    table: "",
    th: "",
    td: "",
  },
  "striped-gray": {
    table: "",
    th: "",
    td: "odd:bg-gray-50", // Applies to odd rows
  },
  "striped-accent": {
    table: "",
    th: "",
    td: "odd:bg-blue-50",
  },

  // === Padding ===
  "padding-sm": {
    table: "",
    th: "p-2",
    td: "p-2",
  },
  "padding-md": {
    table: "",
    th: "p-3",
    td: "p-3",
  },
  "padding-lg": {
    table: "",
    th: "p-4",
    td: "p-4",
  },

  // === Header Styles ===
  "header-light": {
    table: "",
    th: "bg-gray-50 font-medium",
    td: "",
  },
  "header-dark": {
    table: "",
    th: "bg-gray-800 text-white font-semibold",
    td: "",
  },
  "header-accent": {
    table: "",
    th: "bg-blue-600 text-white font-bold",
    td: "",
  },

  // === Compact Mode ===
  "compact-sm": {
    table: "",
    th: "p-1 text-sm",
    td: "p-1 text-sm",
  },
  "compact-md": {
    table: "",
    th: "p-1.5 text-sm",
    td: "p-1.5 text-sm",
  },
  "compact-lg": {
    table: "",
    th: "p-2 text-sm",
    td: "p-2 text-sm",
  },
} as const;

export type Variant = typeof variants;

export const gridVariants = {
  // === Core Layout Variants ===
  basic: {
    grid: "gap-4",
    cell: "p-2 border border-black",
  },
  tight: {
    grid: "gap-2",
    cell: "p-1 border border-black",
  },
  loose: {
    grid: "gap-6",
    cell: "p-4 border-2 border-black",
  },

  // === Grid Gaps ===
  "gap-none": {
    grid: "gap-0",
    cell: "",
  },
  "gap-sm": {
    grid: "gap-2",
    cell: "",
  },
  "gap-md": {
    grid: "gap-4",
    cell: "",
  },

  // === Cell Borders ===
  "border-none": {
    grid: "",
    cell: "border-0",
  },
  "border-thin": {
    grid: "",
    cell: "border border-gray-400",
  },
  "border-thick": {
    grid: "",
    cell: "border-2 border-black",
  },

  // === Cell Padding ===
  "padding-none": {
    grid: "",
    cell: "p-0",
  },
  "padding-sm": {
    grid: "",
    cell: "p-2",
  },
  "padding-md": {
    grid: "",
    cell: "p-4",
  },

  // === Cell Backgrounds ===
  "cells-transparent": {
    grid: "",
    cell: "bg-transparent",
  },
  "cells-gray": {
    grid: "",
    cell: "bg-gray-50",
  },
  "cells-zebra": {
    grid: "",
    cell: "odd:bg-gray-50",
  },
} as const;

export type GridVariant = typeof gridVariants;
