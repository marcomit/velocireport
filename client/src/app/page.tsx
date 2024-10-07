"use client";
import dynamic from "next/dynamic";

// Dynamically load PdfPreview
const PdfPreview = dynamic(() => import("@/components/pdf-preview"), {
  ssr: false, // Disable server-side rendering
});

import DirectoriesTree from "@/components/directories-tree";
import Header from "@/components/header";
import Tabs from "@/components/tabs";
import TextEditor from "@/components/text-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

export default function Home() {
  const [pdfBuffer, setPdfBuffer] = useState<Buffer | null>(null);
  const [directories, setDirectories] = useState([]);

  const fetchDirectories = async () => {
    const url = "http://localhost:8000/templates";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDirectories(data);
    } catch (error) {
      console.error("Error fetching directories:", error);
    }
  };

  useEffect(() => {
    fetchDirectories();
  }, []);

  return (
    <div className="h-screen w-screen">
      <Header />
      <ResizablePanelGroup direction="horizontal">
        {/* First panel with smaller size */}
        <ResizablePanel defaultSize={10} minSize={5}>
          {directories.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <DirectoriesTree directories={directories} />
          )}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={45} minSize={10}>
          <div className="h-full flex flex-col">
            <Tabs />
            <TextEditor />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={45} minSize={10}>
          <h2>PDF Preview</h2>
          <PdfPreview buffer={pdfBuffer} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
