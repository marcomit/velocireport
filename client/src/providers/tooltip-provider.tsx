"use client";
import * as React from "react";
import { TooltipProvider as T } from "@/components/ui/tooltip";

export const TooltipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <T>{children}</T>;
};
