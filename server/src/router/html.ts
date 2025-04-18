/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Router } from "express";
import { readFile } from "fs/promises";
import path from "path";
import { renderToString } from "../syntax/veloci-js";

const router = Router();

router.get("/", async (req, res) => {
  const html = await readFile(path.join(__dirname, "index.html"), "utf8");
  res.send(renderToString(""));
});

export default router;
