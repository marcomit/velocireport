"use client";
import useTabs from "@/stores/tabs";
import { DirectoryTree } from "@/types/directory";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { ChevronRight, File, Folder, TextCursor, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { imagesForLanguage } from "@/lib/utils";

interface DirectoriesTreeProps {
  directories: DirectoryTree[];
}

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
          <ContextMenu>
            <ContextMenuTrigger asChild>
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
                    className="w-6 h-6 me-2"
                    alt={directory.name}
                    width={30}
                    height={30}
                  />
                  <span className="text-lg">{directory.name}</span>
                </p>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                <Folder className="w-4 h-4 me-2" />
                New folder
              </ContextMenuItem>
              <ContextMenuItem>
                <File className="w-4 h-4 me-2" />
                New file
              </ContextMenuItem>
              <ContextMenuItem>
                <TextCursor className="w-4 h-4 me-2" />
                Rename
              </ContextMenuItem>
              <ContextMenuItem>
                <Trash className="w-4 h-4 me-2" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ) : (
          <ContextMenu>
            <ContextMenuTrigger asChild>
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
                  className="w-5 h-5 me-2"
                  alt={directory.name}
                  width={20}
                  height={20}
                />{" "}
                <span className="m-0 text-nowrap">{directory.name}</span>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>New folder</ContextMenuItem>
              <ContextMenuItem>New file</ContextMenuItem>
              <ContextMenuItem>Rename</ContextMenuItem>
              <ContextMenuItem>Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
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
