/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

"use server";

import { DirectoryTree } from "@/types/directory";
import axios from "axios";

const createTemplate = async (e: FormData) => {
  console.log(e.get("name"));
  const response = await axios.post(
    `http://localhost:8000/templates/${e.get("name")}?${
      e.get("default") == "on" && "default=true"
    }`
  );
  console.log(response.data);
};

const createNewFolder = async (e: FormData) => {
  const response = await axios.post(`http://localhost:8000/templates/`, {
    name: e.get("name"),
    type: "directory",
    content: [],
    parent: e.get("parent"),
  });
  console.log(response.data);
};

const createNewFile = async (e: FormData) => {
  const response = await axios.post(`http://localhost:8000/templates/`, {
    name: e.get("name"),
    type: "file",
    content: [],
    parent: e.get("parent"),
  });
  console.log(response.data);
};

const renameFile = async (name: string, path: DirectoryTree["path"]) => {
  const response = await axios.put(`http://localhost:8000/templates/rename`, {
    name: name,
    path: path,
  });
  return response;
};

export { createNewFile, createNewFolder, createTemplate, renameFile };
