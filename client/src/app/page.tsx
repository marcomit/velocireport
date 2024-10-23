"use client";

import CommandBar from "@/components/command-bar";
import DirectoriesTree from "@/components/directories-tree";
import Header from "@/components/header";
import PdfPreview from "@/components/pdf-preview";
import ShortcutSidebar from "@/components/shortcut-sidebar";
import Tabs from "@/components/tabs";
import TextEditor from "@/components/text-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import usePdfBuffer from "@/stores/pdf-buffer";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const { pdfBuffer, error } = usePdfBuffer();

  const constraintsRef = useRef(null);

  return (
    <motion.div
      ref={constraintsRef}
      className="h-screen flex flex-col font-mono"
    >
      <CommandBar constraintsRef={constraintsRef} />

      <Header />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel
            defaultSize={10}
            minSize={5}
            className="h-full overflow-auto flex flex-col content-between scrollbar-thin "
          >
            <DirectoriesTree />

            <ShortcutSidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={45}
            minSize={10}
            className="h-full flex flex-col border-s-2 border-e-2 border-border"
          >
            <Tabs />
            <div className="flex-1 overflow-auto ">
              <TextEditor />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={45} minSize={10} className="h-full">
            <div className="h-full flex justify-center items-center overflow-auto">
              {error ? (
                <p className="text-center p-10 text-balance">{error}</p>
              ) : !pdfBuffer ? (
                <h2>PDF Preview</h2>
              ) : (
                <PdfPreview />
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </motion.div>
  );
}
