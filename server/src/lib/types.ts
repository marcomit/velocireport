/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

import z from "zod";

const DataSchema = z
  .object({
    type: z.union([z.literal("raw"), z.literal("file"), z.literal("fetch")]),
    format: z.union([
      z.literal("txt"),
      z.literal("json"),
      z.literal("csv"),
      z.literal("tsv"),
      z.literal("get"),
      z.literal("post"),
      z.literal("put"),
      z.literal("delete"),
      z.literal("patch"),
    ]),
    name: z.string(),
    content: z.string(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "fetch" &&
      !["get", "post", "put", "delete", "patch"].includes(data.format)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        fatal: true,
      });
    }
    if (
      data.type !== "fetch" &&
      !["txt", "json", "csv", "tsv"].includes(data.format)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        fatal: true,
      });
    }
  });
type Data = z.infer<typeof DataSchema>;
export { DataSchema, type Data };
