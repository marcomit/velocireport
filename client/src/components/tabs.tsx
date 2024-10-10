"use client";

import useTabs from "@/stores/tabs";
import { DirectoryTree } from "@/types/directory";
import { Dot, X } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { imagesForLanguage } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const Tabs = () => {
  const { tabs } = useTabs();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const updateDragConstraints = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = contentRef.current.scrollWidth;

        // Calculate drag constraints
        const leftConstraint = containerWidth - contentWidth;
        const rightConstraint = 0;

        setDragConstraints({ left: leftConstraint, right: rightConstraint });
      }
    };

    updateDragConstraints();
    window.addEventListener("resize", updateDragConstraints);

    return () => {
      window.removeEventListener("resize", updateDragConstraints);
    };
  }, [tabs]);

  return (
    <div
      ref={containerRef}
      className="relative flex overflow-hidden border-b-2 border-border"
    >
      <motion.div
        ref={contentRef}
        className="flex space-x-2 p-1"
        drag="x"
        dragConstraints={dragConstraints}
        style={{ userSelect: "none" }}
      >
        {tabs.map((tab) => (
          <TabItem key={tab.name} file={tab} />
        ))}
      </motion.div>
    </div>
  );
};

const TabItem = ({ file }: { file: DirectoryTree }) => {
  const { selected, changeSelected, close, last } = useTabs();
  const tabRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    changeSelected(file);
  };

  const handleClose = () => {
    close(file);
    if (selected === file) {
      changeSelected(last());
    }
  };

  // Scroll the selected tab into view
  useEffect(() => {
    if (file === selected && tabRef.current) {
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
      onClick={handleClick}
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
        onClick={handleClose}
        size="icon"
        variant="ghost"
        className="h-6 w-6"
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default Tabs;
