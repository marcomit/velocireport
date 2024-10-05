"use client";
import React from "react";

const DirectoriesTree = ({ directories }) => {
  const mapDirectories = (directories) => {
    console.log(directories);
    return directories.map((directory) => (
      <li key={directory.name}>
        {directory.name}
        {directory.type === "directory" && directory.content ? (
          <ul>{mapDirectories(directory.content)}</ul>
        ) : null}
      </li>
    ));
  };

  return (
    <div>
      <h2>Directories</h2>
      <ul>{mapDirectories(directories)}</ul>
    </div>
  );
};

export default DirectoriesTree;
