import { ShoppingBagIcon } from "lucide-react";
import { Button } from "./ui/button";
import { NewTemplateDialog } from "./dialogs/new-template";
import ConnectDataDialog from "./dialogs/connect-data";
import useDirectories from "@/stores/directories";

const ShortcutSidebar = () => {
  function createNewTemplate() {}
  const selected = useDirectories().getSelected();

  return (
    <div className=" h-1/2 mt-auto flex flex-col items-center p-2">
      <h2 className="text-xl font-bold self-start">Shortcuts</h2>

      <NewTemplateDialog />
      {selected &&
        selected?.name !== "shared" &&
        selected?.parent.split("/")[0] !== "shared" && (
          <ConnectDataDialog
            selected={
              selected?.parent === ""
                ? selected.name
                : selected?.parent.split("/")[0]
            }
          />
        )}
      <Button variant={"custom-dark"} className="mt-2 w-full">
        CONNECT SCRIPTS
      </Button>
      <Button variant={"destructive-outline"} className="mt-2 w-full">
        DELETE TEMPLATE
      </Button>
      <Button variant={"custom-dark"} className="mt-auto w-full">
        PUBLISH TEMPLATE
      </Button>
      <Button variant={"custom-dark"} className="mt-2 w-full">
        <ShoppingBagIcon className="w-4 h-4 me-2" />
        Marketplace
      </Button>
    </div>
  );
};

export default ShortcutSidebar;
