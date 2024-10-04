type FunctionResponse =
  | {
      status: number;
      message: string;
    }
  | { content: any };
type Template = {
  name: string;
  type: "directory" | "file";
  content: string | Template[];
};
export { type FunctionResponse, type Template };
