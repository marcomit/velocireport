"use client";

import useTabs from "@/stores/tabs";
import { DirectoryTree } from "@/types/directory";
import { Dot, X } from "lucide-react";
import { Button } from "./ui/button";

const Tabs = () => {
  const { tabs } = useTabs();
  return (
    <div className="flex h-10 space-x-2 overflow-x-scroll no-scrollbar ">
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
      className={`flex items-center justify-center space-x-2 border-2 border-primary px-2 cursor-pointer m-1 rounded-md ${
        file === selected && "bg-primary/10"
      }`}
      onClick={handleClick}
    >
      {file.sync == false && <Dot className="w-6 h-6 p-0" />}
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
