import pdf from "./veloci-js";

const variants = {
  primary: "",
  secondary: ""
} as const;

type Variant = typeof variants;
type Column<T> = {
  name: string;
  value: string | ((e: T) => any);
  class?: string | ((e: T, i: number) => string);
};

class Components {
  static instance = new Components();
  private constructor() { }

  table<T>(
    list: T[],
    { columns, footer }: { columns: Column<T>[]; footer: any },
    variant: keyof Variant
  ) {
    return pdf.table(
      pdf.tr(...columns.map((c) => pdf.th(c.name))),
      ...list.map((e, i) =>
        pdf.tr(...columns.map((c) => pdf.td(this.evaluate(e, c.value)).$('class', this.evaluateClass(e, i, c.class))))
      )
    ).$('class', variants[variant]);
  }

  private evaluateClass<T>(item: T, i: number, className: Column<T>['class']) {
    if (!className) return '';
    if (typeof className === 'function') {
      return className(item, i);
    }
    return className;
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
    path: Column<T>["value"],
    column: Column<T>["value"],
    compare: (a: any, b: any) => number = this.compareNumbers
  ): Column<T>["value"] {
    const parse = (acc: any, curr: any) => {
      if (compare(acc, curr) < 0) return curr;
      return acc;
    };
    return this.groupedFunctions(path, column, parse);
    //return (listElement: T) => {
    //  const child = this.getChild(listElement, path);
    //  if (!Array.isArray(child)) return "";
    //  let result = this.evaluate(child[0], column);
    //  for (let i = 1; i < child.length; i++) {
    //    let evaluated = this.evaluate(child[i], column);
    //    if (compare(result, evaluated) < 0) result = evaluated;
    //  }
    //  return result;
    //};
  }

  sum<T>(
    path: Column<T>["value"],
    column: Column<T>["value"],
    parse: (a: any) => any = parseFloat
  ): Column<T>["value"] {
    const reduce = (acc: any, curr: any) => {
      return (acc || 0) + parse(curr)
    }
    return this.groupedFunctions(path, column, reduce)
    //return (listElement: T) => {
    //  const child = this.getChild(listElement, path);
    //  if (!Array.isArray(child)) return "";
    //  let result = parse(this.evaluate(child[0], column));
    //  for (let i = 1; i < child.length; i++) {
    //    let evaluated = this.evaluate(child[i], column);
    //    result += parse(evaluated);
    //  }
    //  return result;
    //};
  }

  count(list: Column<any>['value'], value: Column<any>['value']) {
    const parse = (acc: any, curr: any) => {
      //if()
    };
    return this.groupedFunctions(list, value, parse);
  }

  private groupedFunctions<T>(path: Column<T>['value'], value: Column<T>['value'], reduce: (acc: any, curr: any) => any): Column<T>['value'] {
    return (item: T) => {
      const list = this.evaluate(item, path);
      if (!Array.isArray(list)) return "";
      let result = this.evaluate(list[0], value);
      for (const child of list) {
        const curr = this.evaluate(child, value);
        result = reduce(result, curr);
      }
      return result;
    }
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
