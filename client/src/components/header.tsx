import useTabs from "@/stores/tabs";
import axios from "axios";
import { Play } from "lucide-react";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { ModeToggle } from "./theme-toggle";

const Header = () => {
  const { selected, sync } = useTabs();
  function handleRun() {}

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
    <header className=" w-full flex justify-between items-center">
      <div className="flex w-full justify-start space-x-2 items-center">
        <div className="flex items-center px-4  ">
          <Image src="/logo.png" alt="logo" width={80} height={80} />
          <h1 className="text-3xl font-bold mt-0">VelociReport</h1>
        </div>

        <Button
          onClick={handleRun}
          className="flex items-center justify-center space-x-2 mx-4 my-2 border-2 bg-background text-foreground border-foreground hover:text-background"
        >
          <Play className="w-8 h-w-8" />
          <span className="text-xl">Run</span>
        </Button>
        <Button
          onClick={handleSave}
          className="flex items-center justify-center space-x-2 mx-4 my-2 border-2 bg-background text-foreground border-foreground hover:text-background"
        >
          <Play className="w-8 h-w-8" />
          <span className="text-xl">Save file</span>
        </Button>
        <Button
          onClick={handleSaveAll}
          className="flex items-center justify-center space-x-2 mx-4 my-2 border-2 bg-background text-foreground border-foreground hover:text-background"
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
