"use client";
import React, { useState } from "react";

const DirectoriesTree = ({ directories, setSelectedFile }) => {
  const [expandedDirectories, setExpandedDirectories] = useState({});

  const toggleDirectory = (directoryName) => {
    setExpandedDirectories((prev) => ({
      ...prev,
      [directoryName]: !prev[directoryName],
    }));
  };

  const mapDirectories = (directories) => {
    return directories.map((directory) => (
      <li key={directory.name}>
        {directory.type === "directory" ? (
          <div onClick={() => toggleDirectory(directory.name)}>
            <p className=" cursor-pointer m-0 text-nowrap ">
              {expandedDirectories[directory.name] ? "-" : "+"} {directory.name}
            </p>
          </div>
        ) : (
          <div
            onClick={() => setSelectedFile(directory.content)}
            className=" cursor-pointer "
          >
            <p className=" m-0 text-nowrap ">{directory.name}</p>
          </div>
        )}
        {directory.type === "directory" &&
          expandedDirectories[directory.name] && (
            <ul className=" ms-6 ">{mapDirectories(directory.content)}</ul>
          )}
      </li>
    ));
  };

  return (
    <div className="p-2 h-screen overflow-x-auto text-nowrap text-ellipsis">
      <h2 className=" font-bold text-center mb-2 text-xl ">Your files</h2>
      <ul>{mapDirectories(directories)}</ul>
    </div>
  );
};

export default DirectoriesTree;
