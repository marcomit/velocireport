"use server";

import axios from "axios";

const createTemplate = async (e: FormData) => {
  console.log(e.get("name"));
  const response = await axios.post(
    `http://localhost:8000/templates/${e.get("name")}?${
      e.get("default") && "default=true"
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

const renameFile = async (e: FormData) => {
  const response = await axios.put(
    `http://localhost:8000/templates/rename/${e.get("template")}`,
    {
      old: {
        name: e.get("name"),
        type: "file",
        content: [],
        parent: e.get("parent"),
      },
      new: {
        name: e.get("name"),
        type: "file",
        content: [],
        parent: e.get("parent"),
      },
    }
  );
  console.log(response.data);
};

export { createTemplate, createNewFolder, createNewFile, renameFile };
