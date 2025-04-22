/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from 'express';
import Template from '../lib/template';
// import PdfEngine from "@/engines/pdf";

const router = express.Router();

router.get('/:templateName', async (req, res) => {
  const { templateName } = req.params;
  if (templateName === 'shared') {
    res.status(401).send('Cannot create shared pdf');
    return;
  }
  const template = new Template(templateName);

  if (!(await template.exists())) {
    res.status(404).send('Template not found');
    return;
  }

  try {
    // const pdf = await new PdfEngine(template).generate();
    // pdf.generate();
    const pdf = await template.pdf();
    res.set('Content-Type', 'application/pdf');
    if (pdf instanceof Error) throw pdf;
    res.send(pdf);
  } catch (e) {
    res.status(400).send(`${e}`);
  }
});

router.post('/:templateName', async (req, res) => {
  const { templateName } = req.params;
  if (templateName === 'shared') {
    res.status(401).send('Cannot create shared pdf');
    return;
  }
  const template = new Template(templateName);

  if (!(await template.exists())) {
    res.status(404).send('Template not found');
    return;
  }

  const request = { body: req.body, query: req.query };
  console.log('request: ', request);

  try {
    const pdf = await template.pdf(request);
    res.set('Content-Type', 'application/pdf');
    if (pdf instanceof Error) throw pdf;
    res.send(pdf);
  } catch (e) {
    res.status(400).send(`${e}`);
  }
});

export default router;
