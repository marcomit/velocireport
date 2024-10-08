"use client";

import useTabs from "@/stores/tabs";
import { DirectoryTree } from "@/types/directory";
import { Dot, X } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { imagesForLanguage } from "@/lib/utils";

const Tabs = () => {
  const { tabs } = useTabs();
  return (
    <div className="flex p-1 space-x-2 overflow-x-scroll no-scrollbar border-b-2 border-border">
      {tabs.map((tab) => (
        <TabItem key={tab.name} file={tab} />
      ))}
    </div>
  );
};

const TabItem = ({ file }: { file: DirectoryTree }) => {
  const { selected, changeSelected, close, last } = useTabs();
  const handleClick = () => {
    changeSelected(file);
  };

  const handleClose = () => {
    close(file);
    if (selected === file) {
      changeSelected(last());
    }
  };

  return (
    <div
      className={`flex items-center justify-center space-x-2 hover:bg-border px-2 py-2 cursor-pointer m-1 rounded-lg ${
        file === selected && "bg-primary/10"
      }`}
      onClick={handleClick}
    >
      {file.sync == false && <Dot className="w-6 h-6 p-0" />}
      <Image
        src={`/${imagesForLanguage.get(file.name.split(".").pop() || "")}`}
        className="w-4 h-4"
        alt={file.name}
        width={20}
        height={20}
      />{" "}
      <span>{file.name}</span>
      <Button
        onClick={handleClose}
        size={"icon"}
        variant={"ghost"}
        className="h-6 w-6 p-1"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Tabs;
