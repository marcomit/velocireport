"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { imagesForLanguage, runTemplate, saveFiles } from "@/lib/utils";
import useDirectories from "@/stores/directories";
import usePdfBuffer from "@/stores/pdf-buffer";
import { DirectoryTree } from "@/types/directory";
import { AxiosError } from "axios";
import {
  ChevronRight,
  Folder,
  Play,
  SaveAll,
  TextCursor,
  Trash
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { NewFileDialog } from "./dialogs/new-file";

interface DirectoriesTreeProps {
  directories: DirectoryTree[];
}

const DirectoriesTree = () => {
  const { directories } = useDirectories();
  const [expandedDirectories, setExpandedDirectories] = useState<{
    [key: string]: boolean;
  }>({});
  const {
    selected,
    changeSelected,
    changeTabState,
    getSelected,
    getOpenDirectories,
  } = useDirectories();

  const Directory = ({
    directories,
    path = [],
  }: {
    directories: DirectoryTree[];
    path?: number[];
  }) => {
    const { setPdfBuffer } = usePdfBuffer();

    const toggleDirectory = (directoryName: string) => {
      setExpandedDirectories((prev) => ({
        ...prev,
        [directoryName]: !prev[directoryName],
      }));
    };

    async function handleRun(directoryName: string) {
      const buffer = await runTemplate(directoryName);
      if (buffer != null) setPdfBuffer(buffer);
    }

    async function handleSaveAll(directory: DirectoryTree) {
      //TODO only send modified files :)
      if (typeof directory.content === "string") return;
      try {
        console.log();
        const response = await saveFiles(directory.content);
      } catch (e) {
        if (e instanceof AxiosError) {
          toast.error(e.message.toString());
        }
      }
    }

    return directories.map((directory, index) => (
      <li key={directory.name}>
        {directory.type === "directory" ? (
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                onClick={() => {
                  toggleDirectory(directory.name);
                  changeSelected(directory.path);
                }}
                className={`cursor-pointer rounded-md text-ellipsis ${
                  getSelected() == directory
                    ? "bg-primary/50 "
                    : "hover:bg-secondary"
                }`}
              >
                <div className=" cursor-pointer m-0 ms-2 text-nowrap flex items-center ">
                  <ChevronRight
                    className={`w-4 h-4 transition-all visible ${
                      expandedDirectories[directory.name] && "rotate-90"
                    }`}
                  />
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
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => handleRun(directory.name)}>
                <Play className="w-4 h-4 me-2" />
                Run
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleSaveAll(directory)}>
                <SaveAll className="w-4 h-4 me-2" />
                Save all
              </ContextMenuItem>
              <ContextMenuItem>
                <Folder className="w-4 h-4 me-2" />
                New folder
              </ContextMenuItem>
              <ContextMenuItem>
                <NewFileDialog />
              </ContextMenuItem>
              <ContextMenuItem>
                <TextCursor className="w-4 h-4 me-2" />
                Rename
              </ContextMenuItem>
              <ContextMenuItem className="text-destructive focus:text-destructive">
                <Trash className="w-4 h-4 me-2 " />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ) : (
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                onClick={() => {
                  if (
                    !getOpenDirectories().find(
                      (tab) => tab.name === directory.name
                    )
                  ) {
                    changeTabState(directory);
                  }
                  changeSelected(directory.path);
                }}
                className={`cursor-pointer  rounded-md flex items-center justify-start mt-1 ps-1 ${
                  getSelected() === directory
                    ? "bg-secondary"
                    : "hover:bg-secondary"
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
              <ContextMenuItem>Rename</ContextMenuItem>
              <ContextMenuItem>Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )}
        {directory.type === "directory" &&
          expandedDirectories[directory.name] && (
            <ul className="ps-6">
              <Directory
                directories={directory.content as DirectoryTree[]}
                path={[...path, index]}
              />
            </ul>
          )}
      </li>
    ));
  };

  return (
    <div className="p-2 h-max overflow-x-auto text-nowrap text-ellipsis scrollbar-thin">
      <div className="flex justify-start items-center space-x-2 scrollbar-thin"></div>
      <ul className="scrollbar-thin">
        <Directory directories={directories} />
      </ul>
    </div>
  );
};

export default DirectoriesTree;
