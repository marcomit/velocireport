import pdf from "./veloci-js";

type Column<T> = {
  name: string;
  value: string | ((e: T) => any);
};

class Components {
  static instance = new Components();
  private constructor() {}

  table<T>(
    list: T[],
    { columns, footer }: { columns: Column<T>[]; footer: any }
  ) {
    return pdf.table(
      pdf.tr(...columns.map((c) => pdf.th(c.name))),
      ...list.map((e) =>
        pdf.tr(...columns.map((c) => pdf.td(this.evaluate(e, c.value))))
      )
    );
  }
  col<T>(options: Column<T>): Column<T> {
    return options;
  }

  evaluate<T>(listElement: T, column: Column<T>["value"]) {
    if (typeof column == "function") return column(listElement);
    if (typeof column === "string") {
      return this.getChild(listElement, column);
    }
    return listElement[column];
  }

  min<T>(
    path: String,
    column: Column<T>["value"],
    compare: (a: any, b: any) => number = (a: any, b: any) => a - b
  ): Column<T>["value"] {
    return (listElement: T) => {
      const child = this.getChild(listElement, path);
      if (!Array.isArray(child)) return "";
      let result = this.evaluate(child[0], column);
      for (let i = 1; i < child.length; i++) {
        let evaluated = this.evaluate(child[i], column);
        if (compare(result, evaluated) > 0) result = evaluated;
      }
      return result;
    };
  }

  max<T>(
    path: String,
    column: Column<T>["value"],
    compare: (a: any, b: any) => number = this.compareNumbers
  ): Column<T>["value"] {
    return (listElement: T) => {
      const child = this.getChild(listElement, path);
      if (!Array.isArray(child)) return "";
      let result = this.evaluate(child[0], column);
      for (let i = 1; i < child.length; i++) {
        let evaluated = this.evaluate(child[i], column);
        if (compare(result, evaluated) < 0) result = evaluated;
      }
      return result;
    };
  }

  sum<T>(
    path: String,
    column: Column<T>["value"],
    parse: (a: any) => any = parseFloat
  ): Column<T>["value"] {
    return (listElement: T) => {
      const child = this.getChild(listElement, path);
      if (!Array.isArray(child)) return "";
      let result = parse(this.evaluate(child[0], column));
      for (let i = 1; i < child.length; i++) {
        let evaluated = this.evaluate(child[i], column);
        result += parse(evaluated);
      }
      return result;
    };
  }

  compareNumbers(a: any, b: any): number {
    return parseFloat(a) - parseFloat(b);
  }

  getChild<T>(listElement: T, path: String) {
    const splitted = path.split(".");
    let curr: any = listElement;
    for (let i = 0; i < splitted.length - 1; i++) {
      curr = curr[splitted[i]];
    }
    return curr[splitted[splitted.length - 1]];
  }
}

export default Components.instance;

// value = min("righe", "prezzo");
// value = min("righe", min("prezzi", "prezzo"));
