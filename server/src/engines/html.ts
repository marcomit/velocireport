import Engine from "./engine";

class HtmlEngine extends Engine {
  constructor(content: string) {
    super(content);
  }
  public parse() {}
}

export default HtmlEngine;
