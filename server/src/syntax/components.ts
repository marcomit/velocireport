/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { variants, type Variant } from "./variants";
import pdf, { type Content } from "./veloci-js";

type Data<T> = {
  name: string;
  value: string | ((e: T) => any);
  class?: string | ((e: T, i: number) => string);
};

type Cell = {
  description: Content;
  colSpan?: number;
  rowSpan?: number;
};

class Components {
  static instance = new Components();
  private constructor() {}

  private evalVariant<T extends keyof Variant>(
    vList: T[],
    tipo: keyof (typeof variants)[T]
  ): string {
    return vList.map((e) => variants[e][tipo]).join(" ");
  }

  table<T>(
    list: T[],
    { columns }: { columns: Data<T>[] },
    ...variant: (keyof Variant)[]
  ) {
    return pdf
      .table(
        pdf
          .tr(
            ...columns.map((c) =>
              pdf.th(c.name).$("class", this.evalVariant(variant, "th"))
            )
          )
          .$("class", ""),
        ...list.map((e, i) =>
          pdf
            .tr(
              ...columns.map((c) =>
                pdf
                  .td(this.evaluate(e, c.value))
                  .$(
                    "class",
                    `${this.evalVariant(variant, "td")} ${this.evaluateClass(
                      e,
                      i,
                      c.class
                    )}`
                  )
              )
            )
            .$("class", i % 2 === 0 ? "bg-white" : "bg-gray-50")
        )
      )
      .$("class", this.evalVariant(variant, "table"));
  }

  private evaluateClass<T>(item: T, i: number, className: Data<T>["class"]) {
    if (!className) return "";
    if (typeof className === "function") {
      return className(item, i);
    }
    return className;
  }

  evaluate<T>(listElement: T, column: Data<T>["value"]) {
    if (typeof column == "function") return column(listElement);
    if (typeof column === "string") {
      return this.getChild(listElement, column);
    }
    return listElement[column];
  }

  min<T>(
    path: String,
    column: Data<T>["value"],
    compare: (a: any, b: any) => number = (a: any, b: any) => a - b
  ): Data<T>["value"] {
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
    path: Data<T>["value"],
    column: Data<T>["value"],
    compare: (a: any, b: any) => number = this.compareNumbers
  ): Data<T>["value"] {
    const parse = (acc: any, curr: any) => {
      if (compare(acc, curr) < 0) return curr;
      return acc;
    };
    return this.groupedFunctions(path, column, parse, 0);
  }

  sum<T>(
    path: Data<T>["value"],
    column: Data<T>["value"],
    parse: (a: any) => any = parseFloat
  ): Data<T>["value"] {
    const reduce = (acc: any, curr: any) => {
      return (acc || 0) + parse(curr);
    };
    return this.groupedFunctions(path, column, reduce);
  }

  count(list: Data<any>["value"], value: Data<any>["value"]) {
    const parse = (acc: any, curr: any) => {
      //if()
    };
    return this.groupedFunctions(list, value, parse);
  }

  private groupedFunctions<T>(
    path: Data<T>["value"],
    value: Data<T>["value"],
    reduce: (acc: any, curr: any) => any,
    initialValue?: any
  ): Data<T>["value"] {
    return (item: T) => {
      const list = this.evaluate(item, path);
      if (!Array.isArray(list)) return "";
      let result = reduce(initialValue, this.evaluate(list[0], value));
      for (const child of list) {
        const curr = this.evaluate(child, value);
        result = reduce(result, curr);
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

  grid(cols: number, cells: Cell[]) {
    return pdf
      .div(
        ...cells.map((c) =>
          pdf
            .div(c.description)
            .$(
              "class",
              `col-span-${c.colSpan || 1} row-span-${
                c.rowSpan || 1
              } border border-black`
            )
        )
      )
      .$("class", `grid grid-cols-${cols}`);
  }
}

export default Components.instance;

// value = min("righe", "prezzo");
// value = min("righe", min("prezzi", "prezzo"));
