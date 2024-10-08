'use client'
import useTabs from "@/stores/tabs";
import axios from "axios";
import { Play } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

const Header = ({
  setPdfBuffer,
}: {
    setPdfBuffer: (buffer: Record<string, number> | null) => void;
}) => {
  const { selected, sync } = useTabs();
  async function handleRun() {
    const response = await axios.get("http://localhost:8000/pdf/scontrini", {
    });
    console.log(response.data);
    setPdfBuffer(response.data);
  }

  async function handleSave() {
    if (!selected || selected.sync == true) return;

    try {
      const response = await axios.put(
        `http://localhost:8000/templates/${selected.name}`,
        selected.content
      );
      console.log(response.data);
      sync(selected);
    } catch (error) {
      console.error("Error saving file:", error);
    }
  }

  function handleSaveAll() {}

  return (
    <header className=" w-full flex justify-between items-center border-b-2 border-border">
      <div className="flex w-full justify-start space-x-2 items-center">
        <div className="flex items-center px-4  ">
          <Image src="/logo.png" alt="logo" width={80} height={80} />
          <h1 className="text-3xl font-bold mt-0">VelociReport</h1>
        </div>

        <Button
          onClick={handleRun}
          className="flex items-center justify-center space-x-2 mx-4 my-2 border-2 bg-background text-foreground border-border hover:bg-border "
        >
          <Play className="w-8 h-w-8" />
          <span className="text-xl">Run</span>
        </Button>
        <Button
          onClick={handleSave}
          className="flex items-center justify-center space-x-2 mx-4 my-2 border-2 bg-background text-foreground  border-border hover:bg-border"
        >
          <Play className="w-8 h-w-8" />
          <span className="text-xl">Save file</span>
        </Button>
        <Button
          onClick={handleSaveAll}
          className="flex items-center justify-center space-x-2 mx-4 my-2 border-2 bg-background text-foreground  border-border hover:bg-border"
        >
          <Play className="w-8 h-w-8" />
          <span className="text-xl">Save all</span>
        </Button>
      </div>
      <div className="ms-auto me-4">
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
