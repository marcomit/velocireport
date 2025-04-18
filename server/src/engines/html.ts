/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

import Engine from "./engine";

class HtmlEngine extends Engine {
  constructor(content: string) {
    super(content);
  }
  public parse() {}
}

export default HtmlEngine;
