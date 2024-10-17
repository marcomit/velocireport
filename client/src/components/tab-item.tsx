"use client";

import Image from "next/image";
import useDirectories from "@/stores/directories";
import { DirectoryTree } from "@/types/directory";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Dot, X } from "lucide-react";
import { imagesForLanguage } from "@/lib/utils";

const TabItem = ({ file }: { file: DirectoryTree }) => {
  const { getOpenDirectories, changeTabState, getSelected, changeSelected } =
    useDirectories();
  const tabRef = useRef<HTMLDivElement | null>(null);
  const selected = getSelected();
  const handleClose = () => {
    changeTabState(file);
    if (selected === file) {
      const tabs = getOpenDirectories();
      if (tabs.length === 0) {
        return;
      }
      changeSelected(tabs[tabs.length - 1].path);

      console.log(getSelected());
    }
  };

  // Scroll the selected tab into view
  useEffect(() => {
    if (file === getSelected() && tabRef.current) {
      tabRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }, [selected, file]);

  return (
    <motion.div
      ref={tabRef}
      className={`flex items-center justify-center space-x-2 hover:bg-border px-2 py-2 cursor-pointer m-1 rounded-lg ${
        file === selected ? "bg-primary/10" : ""
      }`}
      onClick={() => changeSelected(file.path)}
      style={{ scrollSnapAlign: "center" }}
    >
      {file.sync === false && <Dot className="w-6 h-6" />}
      <Image
        src={`/${imagesForLanguage.get(file.name.split(".").pop() || "")}`}
        className="w-4 h-4"
        alt={file.name}
        width={20}
        height={20}
      />
      <span>{file.name}</span>
      <Button
        onClick={() => handleClose()}
        size="icon"
        variant="ghost"
        className="h-6 w-6"
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};
export default TabItem;
