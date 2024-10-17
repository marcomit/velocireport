"use client";

import { DirectoryTree } from "@/types/directory";
import { Dot, X } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { imagesForLanguage } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useDirectories from "@/stores/directories";
import TabItem from "./tab-item";

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

  const selected = useDirectories((state) => state.selected);
  useEffect(() => {
    console.log("rerendered", selected);
  }, [selected]);

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
          <TabItem key={`${tab.path}-${selected}`} file={tab} />
        ))}
      </motion.div>
    </div>
  );
};

export default Tabs;

/*   useEffect(() => {
  updateDragConstraints(); // Calculate constraints on mount
  window.addEventListener("resize", updateDragConstraints); // Update on resize

  return () => {
    window.removeEventListener("resize", updateDragConstraints); // Cleanup on unmount
  };
}, [tabs]); // Recalculate when tabs change */
