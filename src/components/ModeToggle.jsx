"use client";
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
const ModeToggle = () => {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      className="bg-transparent hover:bg-[#3674B5] border-none dark:hover:bg-transparent"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] dark:hidden text-white" />
      <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:inline text-white" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ModeToggle;
