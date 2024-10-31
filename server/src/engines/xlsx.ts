import type Template from "@/lib/template";
import Engine from "./engine";

class XlsxEngine extends Engine {
  constructor(template: Template) {
    super(template);
  }
  async generate(): Promise<Uint8Array | string> {
    return "Unsupported";
  }
}
export default XlsxEngine;
