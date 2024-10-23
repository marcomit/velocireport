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
  const response = await axios.post(`http://localhost:8000/templates/}`, {
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

<<<<<<< HEAD
const renameFile = async (name: string, path: DirectoryTree["path"]) => {
  const response = await axios.put(`http://localhost:8000/templates/rename`, {
    name: name,
    path: path,
  });
  return response;
};

export { createNewFile, createNewFolder, createTemplate, renameFile };

=======
export { createTemplate, createNewFolder, createNewFile };
>>>>>>> 7150c6750a4ee0afcd2489ccbe8f95ac23a10ce2
