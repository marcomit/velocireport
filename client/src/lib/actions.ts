"use server";

import useDirectories from "@/stores/directories";
import { DirectoryTree } from "@/types/directory";
import axios from "axios";
import { toast } from "sonner";

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

export { createTemplate, createNewFolder, createNewFile };
