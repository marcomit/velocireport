"use client";
import useTabs from "@/stores/tabs";
import axios from "axios";
import { Play } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className=" w-full flex justify-between items-center border-b-2 border-border">
      <div className="flex items-center px-4  ">
        <Image src="/logo.png" alt="logo" width={80} height={80} />
        <h1 className="text-3xl font-bold mt-0">VelociReport</h1>
      </div>

      <div className="ms-auto me-4">
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
