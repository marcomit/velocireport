"use client";
import useTabs from "@/stores/tabs";
import { DirectoryTree } from "@/types/directory";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { NewFileDialog } from "./dialogs/new-file";
import { NewFolderDialog } from "./dialogs/new-folder";
import { NewTemplateDialog } from "./dialogs/new-template";
import { Tooltip, TooltipTrigger } from "./ui/tooltip";

interface DirectoriesTreeProps {
  directories: DirectoryTree[];
}

const imagesForLanguage = new Map<string, string>([
  ["ts", "ts.png"],
  ["js", "js.png"],
  ["css", "css.png"],
  ["json", "json.png"],
  ["pdf", "pdf.svg"],
]);

const DirectoriesTree = ({ directories }: DirectoriesTreeProps) => {
  const [expandedDirectories, setExpandedDirectories] = useState<{
    [key: string]: boolean;
  }>({});
  const { tabs, changeSelected, selected, open } = useTabs();

  const Directory = ({ directories }: { directories: DirectoryTree[] }) => {
    const { tabs } = useTabs();

    const toggleDirectory = (directoryName: string) => {
      setExpandedDirectories((prev) => ({
        ...prev,
        [directoryName]: !prev[directoryName],
      }));
    };

    return directories.map((directory) => (
      <li key={directory.name}>
        {directory.type === "directory" ? (
          <div onClick={() => toggleDirectory(directory.name)}>
            <p className=" cursor-pointer m-0 text-nowrap flex items-center justify-start">
              <ChevronRight
                className={`w-4 h-4 transition-all ${
                  expandedDirectories[directory.name] && "rotate-90"
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
              if (!tabs.find((tab) => tab.name === directory.name)) {
                open(directory);
              }
              changeSelected(directory);
            }}
            className={`cursor-pointer flex items-center justify-start ${
              selected === directory && "bg-secondary"
            }`}
          >
            <Image
              src={`/${imagesForLanguage.get(
                directory.name.split(".").pop() || ""
              )}`}
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
            <ul className="ps-6">
              <Directory directories={directory.content as DirectoryTree[]} />
            </ul>
          )}
      </li>
    ));
  };

  return (
    <div className="p-2 h-max overflow-x-auto text-nowrap text-ellipsis">
      <div className="flex justify-start items-center space-x-2"></div>
      <ul>
        <Directory directories={directories} />
      </ul>
    </div>
  );
};

export default DirectoriesTree;
