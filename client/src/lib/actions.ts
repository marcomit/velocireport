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

export { createTemplate };
