/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

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
