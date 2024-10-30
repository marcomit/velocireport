abstract class Engine {
  public content: string = "";
  constructor(content: string) {
    this.content = content;
  }
  public parse() {
    throw new Error("Method not implemented.");
  }
}

export default Engine;
