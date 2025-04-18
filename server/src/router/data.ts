/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Router } from "express";
import Template from "../lib/template";
import { DataSchema } from "../lib/types";
import fs from 'fs/promises';
import { isAlphanumeric, treePath, validateTemplate } from "../lib/utils";

const router = Router();

router.get("/:templateName", async (req, res) => {
  const { templateName } = req.params;
  const template: Error | Template = await validateTemplate(templateName);
  if (template instanceof Error) {
    console.log(template);
    res.status(405).send(template);
    return;
  }
  if (!(await template.exists('data'))) {
    console.log('data folder does not exists on this template');
    res.status(400).send("Data doesnt exists for this template");
  }
  const data = await template.data.getAll();
  if (data instanceof Error) {
    res.status(400).send(data);
    return;
  }
  res.json(data);
});

router.post("/:templateName", async (req, res) => {
  const { templateName } = req.params;
  const body = DataSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).send(body.error.issues.map((i) => i.message));
    return;
  }
  const { name, type, format, content } = body.data;
  const template = new Template(templateName);
  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }
  const exists = await template.data.exists(name);
  if (exists instanceof Error) {
    res.status(400).send(exists);
  }
  if (exists) {
    res.status(400).send("Data already exists");
    return;
  }
  if (!isAlphanumeric(name)) {
    res.status(400).send("Invalid name");
    return;
  }
  try {
    await template.connect({ type, name, content, format });
  } catch (e) {
    res.status(400).send(e);
  }
  res.send("OK");
});

router.delete("/:templateName/:data", async (req, res) => {
  const { data } = req.params;
  const { type } = req.body;

  if (!type) {
    res.status(400).send('Invalid request, missing "format" or "type" field');
  }

  const template = new Template(req.params.templateName);
  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }
  if (!(await template.exists(treePath({ name: data, parent: "data" })))) {
    res.status(404).send("Data not found");
    return;
  }

  // await template.delete({
  //   name: template.data({ name: data, type, format: type }),
  //   parent: "data",
  // });
  res.send("TODO");
});
export default router;
