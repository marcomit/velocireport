import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePlus2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import axios from "axios";
import { createTemplate } from "@/lib/actions";

export function NewTemplateDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"custom-dark"} className="mt-2 w-full">
          NEW TEMPLATE
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={createTemplate}>
          <DialogHeader>
            <DialogTitle>New template</DialogTitle>
            <DialogDescription>
              Create a new template for your reports.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" className="col-span-3" />
            </div>
            <div className=" grid grid-cols-4 items-center gap-4">
              <Checkbox id="terms" name="default" className="ms-auto" />
              <Label htmlFor="terms" className="text-sm font-medium col-span-3">
                Use sample template
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
