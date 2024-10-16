"use client";

import { DirectoryTree } from "@/types/directory";
import { Dot, X } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { imagesForLanguage } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useDirectories from "@/stores/directories";

const Tabs = () => {
  const tabs = useDirectories().getOpenDirectories();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  // Update drag constraints based on container and content size
  const updateDragConstraints = () => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.offsetWidth; // Width of the container
      const contentWidth = contentRef.current.scrollWidth; // Width of all tabs combined

      // Calculate the left and right drag constraints
      const leftConstraint = 0; // The left side should start at 0
      const rightConstraint = Math.max(contentWidth - containerWidth, 0); // Prevent going past the last tab

      setDragConstraints({ left: leftConstraint, right: rightConstraint });
    }
  };

  /*   useEffect(() => {
    updateDragConstraints(); // Calculate constraints on mount
    window.addEventListener("resize", updateDragConstraints); // Update on resize

    return () => {
      window.removeEventListener("resize", updateDragConstraints); // Cleanup on unmount
    };
  }, [tabs]); // Recalculate when tabs change */

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
        onDragEnd={() => updateDragConstraints()} // Recalculate constraints after drag ends
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
  const {
    getOpenDirectories,
    changeTabState,
    selected,
    getSelected,
    changeSelected,
  } = useDirectories();
  const tabRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    changeTabState(file);
  };

  const handleClose = () => {
    changeTabState(file);
    if (getSelected() === file) {
      const tabs = getOpenDirectories();
      if (tabs.length === 0) {
        return;
      }
      changeSelected(tabs[tabs.length - 1].path);
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
        file === getSelected() ? "bg-primary/10" : ""
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
