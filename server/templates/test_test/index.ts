/*
 * Copyright (c) 2025, Marco Menegazzi
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

import pdf from '@/syntax/veloci-js';
import veloci from '@/syntax/components';

export default async (content: any) => {
  const receipts: any[] = (await content.getScontriniData())['scontrini'];

  return pdf.div(
    pdf.h1('Report test').$('class', 'text-center text-red-500'),
    veloci.table(receipts, {
      columns: [
        { name: 'test', value: '_id' },
        {
          name: 'minimo',
          value: veloci.min('righe', 'prezzoUnitario'),
        },
        {
          name: 'massimo',
          value: veloci.max('righe', 'prezzoUnitario'),
        },
        {
          name: 'righe',
          value: 'righe.length',
          variant: 'primary',
          //class: "text-red-500"
          class: (el, i) => (i % 2 == 0 ? 'text-red-500' : 'text-green-500'),
        },
        {
          name: 'somma',
          value: veloci.sum('righe', 'prezzoUnitario'),
        },
      ],
    }),
  );
};
