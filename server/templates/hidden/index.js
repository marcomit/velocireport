import fs from "fs/promises";
import fetch from "node-fetch";

const format = {
  csv: async (fileName) => {
    let file = await fs.readFile(fileName, "utf8");
    file = file.split("\n");
    let headers = file[0].split(",");
    file.shift();
    file = file.map((row) => {
      let data = row.split(",");
      let obj = {};
      for (let i = 0; i < headers.length; i++) {
        obj[headers[i]] = data[i];
      }
      return obj;
    });
    return file;
  },
  tsv: async (fileName) => {
    let file = await fs.readFile(fileName, "utf8");
    file = file.split("\n");
    let headers = file[0].split("\t");
    file.shift();
    file = file.map((row) => {
      let data = row.split(",");
      let obj = {};
      for (let i = 0; i < headers.length; i++) {
        obj[headers[i]] = data[i];
      }
      return obj;
    });
    return file;
  },
  json: async (fileName) => {
    let file = await fs.readFile(fileName, "utf8");
    return JSON.parse(file);
  },
  get: async (url) => {
    let response = await fetch(url);
    return await response.json();
  },
};
export default format;
