"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircledIcon } from "@radix-ui/react-icons";

const AddExtrasSelector = ({ onAddExtra, selectedExtras }) => {
  const isExtraAdded = (extra) => selectedExtras.some((e) => e.name === extra);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex flex-row gap-3 hover:text-black/50 transition-all duration-100 ease-in-out">
          <PlusCircledIcon className="h-6 w-6" /> <span>Add Extras</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Extra Specifiers</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => onAddExtra("Genre")}
          disabled={isExtraAdded("Genre")}
        >
          Genre
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onAddExtra("Mood")}
          disabled={isExtraAdded("Mood")}
        >
          Mood
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onAddExtra("Instruments")}
          disabled={isExtraAdded("Instruments")}
        >
          Instruments
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onAddExtra("Tempo")}
          disabled={isExtraAdded("Tempo")}
        >
          Tempo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddExtrasSelector;
