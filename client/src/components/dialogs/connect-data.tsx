import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { DirectoryTree } from "@/types/directory";
import { Textarea } from "../ui/textarea";

const ConnectDataDialog = ({ selected }: { selected: DirectoryTree }) => {
  const [selectedFile, setSelectedFile] = useState<DirectoryTree | null>(null);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"custom-dark"} className="mt-2 w-full">
          CONNECT DATA
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Connect data</DialogTitle>
          <DialogDescription>
            Connect your data sources to this template. Click save when you're
            done
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue={selected.name + "Data"} />
        </div>
        <Tabs
          defaultValue="rawdata"
          className="flex flex-col items-center justify-center"
        >
          <TabsList>
            <TabsTrigger value="rawdata">Raw Data</TabsTrigger>
            <TabsTrigger value="file">Select existing file</TabsTrigger>
            <TabsTrigger value="import">Import file</TabsTrigger>
            <TabsTrigger value="fetch">Api Endpoint</TabsTrigger>
          </TabsList>
          <TabsContent value="rawdata">
            paste your raw data here.
            <Textarea id="rawdata" className="w-96 h-48 " />
          </TabsContent>
          <TabsContent value="file">
            Select a file:
            {Array.isArray(selected.content) &&
              selected.content.map((file) => (
                <div
                  key={file.name}
                  className={`cursor-pointer rounded-sm px-2 ${
                    selectedFile == file
                      ? "bg-primary/50 "
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => setSelectedFile(file)}
                >
                  {file.name}
                </div>
              ))}
          </TabsContent>
          <TabsContent value="import">
            <Input type="file" id="import" className="col-span-3" />
          </TabsContent>
          <TabsContent value="fetch">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input id="url" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">
                  Method
                </Label>
                <Input id="method" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="headers" className="text-right">
                  Headers
                </Label>
                <Input id="headers" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="body" className="text-right">
                  Body
                </Label>
                <Input id="body" className="col-span-3" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectDataDialog;
