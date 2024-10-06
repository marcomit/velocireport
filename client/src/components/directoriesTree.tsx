"use client";
import useTabs from "@/stores/tabs";
import { DirectoryTree } from "@/types/directory";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { ChevronRight, FilePlus2, FolderPlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Tooltip, TooltipTrigger } from "./ui/tooltip";

interface DirectoriesTreeProps {
  directories: DirectoryTree[];
}

const DirectoriesTree = ({ directories }: DirectoriesTreeProps) => {
  const [expandedDirectories, setExpandedDirectories] = useState<{ [key: string]: boolean }>({});
  const { tabs, changeSelected, selected, open } = useTabs();

  const toggleDirectory = (directoryName: string) => {
    setExpandedDirectories((prev) => ({
      ...prev,
      [directoryName]: !prev[directoryName],
    }));
  };

  const mapDirectories = (directories: DirectoryTree[]) => {
    return directories.map((directory) => (
      <li key={directory.name}>
        {directory.type === "directory" ? (
          <div onClick={() => toggleDirectory(directory.name)}>
            <p className=" cursor-pointer m-0 text-nowrap flex items-center justify-start">
              <ChevronRight
                className={`w-4 h-4 transition-all ${expandedDirectories[directory.name] && "rotate-90"
                  }`}
              />{" "}
              <Image
                src={
                  directory.name === "shared"
                    ? "folder-helpers.svg"
                    : "folder.svg"
                }
                className="w-4 h-4"
                alt={directory.name}
                width={20}
                height={20}
              />
              <span>{directory.name}</span>
            </p>
          </div>
        ) : (
          <div
            onClick={() => {
              if (!tabs.find(tab => tab.name === directory.name)) {
                open(directory);
              }
              changeSelected(directory);
            }}
            className={`cursor-pointer flex items-center justify-start ${selected === directory && "bg-secondary"}`}
          >
            <Image
              src={`/${directory.name.split(".")[1]}.png`}
              className="w-4 h-4"
              alt={directory.name}
              width={20}
              height={20}
            />{" "}
            <p className="m-0 text-nowrap">{directory.name}</p>
          </div>
        )}
        {directory.type === "directory" &&
          expandedDirectories[directory.name] && (
            <ul className="ps-6">{mapDirectories(directory.content as DirectoryTree[])}</ul>
          )}
      </li>
    ));
  };

  return (
    <div className="p-2 h-screen overflow-x-auto text-nowrap text-ellipsis">
      <div className="flex justify-end space-x-2">
        <Tooltip>
          <TooltipTrigger asChild><FilePlus2 className="w-4 h-4" /></TooltipTrigger>
          <TooltipContent><p>Add new file</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild><FolderPlus className="w-4 h-4" /></TooltipTrigger>
          <TooltipContent><p>Create new template</p></TooltipContent>
        </Tooltip>
      </div>
      <ul>{mapDirectories(directories)}</ul>
    </div>
  );
};

export default DirectoriesTree;
