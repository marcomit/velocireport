import useTabs from "@/stores/tabs";
import axios from "axios";
import { Play } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  const { selected, sync } = useTabs();
  function handleRun() {

  }

  async function handleSave() {
    if (!selected || selected.sync == true) return

    try {
      const response = await axios.put(`http://localhost:8000/templates/${selected.name}`, selected.content);
      console.log(response.data);
      sync(selected)
    }
    catch (error) {
      console.error("Error saving file:", error);
    }
  }

  function handleSaveAll() {

  }

  return (
    <header className="flex w-full justify-start space-x-2">
      <h1 className="text-3xl font-bold">Sellogic Report</h1>
      <Button onClick={handleRun} className="flex items-center justify-center space-x-2 mx-2 my-1"><Play className="w-4 h-4" /><span>Run</span></Button>
      <Button onClick={handleSave} className="flex items-center justify-center space-x-2 mx-2 my-1"><Play className="w-4 h-4" /><span>Save file</span></Button>
      <Button onClick={handleSaveAll} className="flex items-center justify-center space-x-2 mx-2 my-1"><Play className="w-4 h-4" /><span>Save all</span></Button>
    </header>
  );
};

export default Header;