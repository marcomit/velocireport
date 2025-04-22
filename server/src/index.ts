/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

// ███╗   ███╗ █████╗ ██████╗  ██████╗ ██████╗ ███╗   ███╗██╗████████╗
// ████╗ ████║██╔══██╗██╔══██╗██╔════╝██╔═══██╗████╗ ████║██║╚══██╔══╝
// ██╔████╔██║███████║██████╔╝██║     ██║   ██║██╔████╔██║██║   ██║
// ██║╚██╔╝██║██╔══██║██╔══██╗██║     ██║   ██║██║╚██╔╝██║██║   ██║
// ██║ ╚═╝ ██║██║  ██║██║  ██║╚██████╗╚██████╔╝██║ ╚═╝ ██║██║   ██║
// ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝   ╚═╝

import cors from 'cors';
import express from 'express';
import path from 'path';
import { default as data } from './router/data';
import { default as pdfRouter } from './router/pdf';
import { default as templates } from './router/templates';

const app = express();
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../templates')));
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use('/pdf', pdfRouter);
app.use('/templates', templates);
app.use('/data', data);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
