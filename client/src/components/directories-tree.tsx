"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { fetchDirectories, renameFile } from "@/lib/utils";
import { imagesForLanguage, runTemplate, saveFiles } from "@/lib/utils";
import useDirectories from "@/stores/directories";
import usePdfBuffer from "@/stores/pdf-buffer";
import { DirectoryTree } from "@/types/directory";
import { AxiosError } from "axios";
import {
  ChevronRight,
  Folder,
  LoaderIcon,
  Play,
  SaveAll,
  TextCursor,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog } from "./ui/dialog";
import DeleteFileDialog from "./dialogs/delete-file";
import NewFileDialog from "./dialogs/new-file";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";

interface DirectoriesTreeProps {
  directories: DirectoryTree[];
}

const DirectoriesTree = () => {
  const [expandedDirectories, setExpandedDirectories] = useState<{
    [key: string]: boolean;
  }>({});
  const {
    directories,
    setDirectories,
    changeSelected,
    changeTabState,
    getSelected,
    getOpenDirectories,
    rename,
    setRename,
    toggleChanged,
  } = useDirectories();

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["fetchDirectories"],
    queryFn: () => fetchDirectories(),
  });
  useEffect(() => {
    if (data) setDirectories(data);
  }, [data]);
  if (isPending)
    return (
      <div className=" flex justify-center mt-4 ">
        <LoaderIcon className="w-10 h-10 animate-spin" />
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-center my-4">
          <span className="text-destructive text-xl text-balance ">
            Whoops!
          </span>{" "}
          Something went wrong
        </h2>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  //setDirectories(data);

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

    async function handleKeyDown(event: React.KeyboardEvent) {
      if (event.key === "Enter" && rename.name !== "") {
        handleRename();
      }
      if (event.key === "Escape") {
        setRename({ path: [], name: "" });
      }
    }

    async function handleRename() {
      if (rename.name === "") {
        toast.error("Name cannot be empty");
        setRename({ path: [], name: "" });
        return;
      }
      renameFile(rename.name, rename.path)
        .then((response) => {
          setRename({ path: [], name: "" });
          toggleChanged();
          toast.success("File renamed successfully");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }

    return directories.map((directory, index) => (
      <li key={directory.name}>
        {directory.type === "directory" ? (
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                onClick={() => {
                  if (rename.path === directory.path) return;
                  toggleDirectory(directory.name);
                  changeSelected(directory.path);
                }}
                className={` min-w-max cursor-pointer rounded-md text-ellipsis overflow-hidden whitespace-nowrap ${
                  getSelected() == directory
                    ? "bg-primary/50"
                    : "hover:bg-secondary"
                }`}
              >
                <div className="cursor-pointer m-0 ms-2 text-nowrap flex items-center">
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
                    className=" me-2"
                    alt={directory.name}
                    width={20}
                    height={20}
                  />
                  {rename.path === directory.path ? (
                    <input
                      type="text"
                      className="renameInput"
                      autoFocus
                      onBlur={handleRename}
                      value={rename.name}
                      onChange={(e) => setRename({ name: e.target.value })}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    <span className="text-lg overflow-hidden text-ellipsis">
                      {directory.name}
                    </span>
                  )}
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
              <NewFileDialog />
              <ContextMenuItem
                onClick={() => setRename({ path: directory.path })}
              >
                <TextCursor className="w-4 h-4 me-2" />
                Rename
              </ContextMenuItem>
              <DeleteFileDialog file={directory} />
            </ContextMenuContent>
          </ContextMenu>
        ) : (
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                onClick={() => {
                  if (rename.path === directory.path) return;
                  if (
                    !getOpenDirectories().find(
                      (tab) => tab.name === directory.name
                    )
                  ) {
                    changeTabState(directory);
                  }
                  changeSelected(directory.path);
                }}
                className={`min-w-max cursor-pointer rounded-md flex items-center justify-start mt-1 ps-1 text-ellipsis overflow-hidden ${
                  getSelected() === directory
                    ? "bg-secondary"
                    : "hover:bg-secondary"
                }`}
                style={{
                  width: "100%", // Set width to fit in the panel
                  maxWidth: "calc(100% - 30px)", // Adjust for padding or margins
                }}
              >
                <Image
                  src={`/${imagesForLanguage.get(
                    directory.name.split(".").pop() || ""
                  )}`}
                  className=" me-2"
                  alt={directory.name}
                  width={20}
                  height={20}
                />
                {directory.path === rename.path ? (
                  <input
                    type="text"
                    className="renameInput"
                    value={rename.name}
                    autoFocus
                    onBlur={handleRename}
                    onChange={(e) => setRename({ name: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                ) : (
                  <span className="m-0 text-nowrap overflow-hidden text-ellipsis">
                    {directory.name}
                  </span>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => setRename({ path: directory.path })}
              >
                Rename
              </ContextMenuItem>
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
