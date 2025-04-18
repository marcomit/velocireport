/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

import PdfEngine from "./pdf";
// import XlsxEngine from "./xlsx";

export * from "./pdf";
// export * from "./xlsx";

const engines = {
  pdf: PdfEngine,
  // xlsx: XlsxEngine,
} as const;

export { engines };
