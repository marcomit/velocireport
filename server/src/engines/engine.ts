import type Template from "@/lib/template";

class Engine {
  protected template: Template;
  constructor(template: Template) {
    this.template = template;
  }

  public async generate(): Promise<Uint8Array | string> {
    return "Unimplemented";
  }
}
export default Engine;
