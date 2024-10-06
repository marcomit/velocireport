type FunctionResponse =
  | {
      status: number;
      message: string;
    }
  | { content: any };
type Template = {
  name: string;
  type: "directory" | "file";
  parent: string;
  content: string | Template[];
};
export { type FunctionResponse, type Template };
