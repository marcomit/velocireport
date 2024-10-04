"use client";
import React, { useEffect, useState } from "react";

const DirectoriesTree = () => {
  const [directories, setDirectories] = useState([]);
  const fetchDirectories = async () => {
    const response = await fetch("localhost/templates");
    const data = await response.json();
    setDirectories(data);
  };

  useEffect(() => {
    fetchDirectories();
  }, []);

  return (
    <div>
      <h2>Directories</h2>
      <ul>
        {directories.map((directory) => (
          <li key={directory.id}>{directory.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DirectoriesTree;
