/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

import pdf from '@/syntax/veloci-js';

export default () => {
  return pdf
    .div(
      pdf.span().$('class', 'pageNumber'),
      '/',
      pdf.span().$('class', 'totalPages'),
    )
    .$('id', 'header-page')
    .$('style', 'font-size:10px; color:#808080; padding-left:10px');
};
