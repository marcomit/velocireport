import z from "zod";
const FormatSchema = z.union([
  z.literal("txt"),
  z.literal("json"),
  z.literal("csv"),
  z.literal("tsv"),
  z.literal("get"),
  z.literal("post"),
  z.literal("put"),
  z.literal("delete"),
  z.literal("patch"),
]);

const DataSchema = z
  .object({
    type: z.union([z.literal("raw"), z.literal("file"), z.literal("fetch")]),
    format: FormatSchema,
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
type Format = z.infer<typeof FormatSchema>;

export { DataSchema, type Data, FormatSchema, type Format };
