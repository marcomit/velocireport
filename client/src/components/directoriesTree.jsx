"use client";
import React from "react";

const DirectoriesTree = ({ directories }) => {
  const mapDirectories = (directories, deph = 0) => {
    console.log(directories);
    return directories.map((directory) => (
      <li key={directory.name} style={{ marginLeft: `${deph * 20}px` }}>
        {directory.name}
        {directory.type === "directory" && directory.content ? (
          <ul className={`ml-[${deph * 20}px]`}>
            {mapDirectories(directory.content, deph + 1)}
          </ul>
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
