"use client";
import React from "react";

import ModelSelector from "@/components/selectors/model-selector";
import GenreSelector from "@/components/selectors/genre-selector";
import MoodSelector from "@/components/selectors/mood-selector";
import InstrumentsSelector from "@/components/selectors/instruments-selector";
import TempoSelector from "@/components/selectors/tempo-selector";

import { musicModels } from "@/data/models";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const InputForm = () => {
  const [selectedModel, setSelectedModel] = React.useState(musicModels[0]);
  const [selectedGenre, setSelectedGenre] = React.useState(null);
  const [selectedMood, setSelectedMood] = React.useState(null);
  const [selectedInstruments, setSelectedInstruments] = React.useState(null);
  const [selectedTempo, setSelectedTempo] = React.useState(108);

  return (
    <div className="flex flex-col gap-5 rounded-lg border-slate-400/25 p-10 border">
      <h1 className="font-semibold">Inputs</h1>
      <ModelSelector
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      {/* GENRE */}
      <GenreSelector
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />

      {/* MOOD */}
      <MoodSelector
        selectedMood={selectedMood}
        setSelectedMood={setSelectedMood}
      />

      {/* INSTRUMENTS */}
      <InstrumentsSelector
        selectedInstruments={selectedInstruments}
        setSelectedInstruments={setSelectedInstruments}
      />

      {/* TEMPO */}
      <TempoSelector
        selectedTempo={selectedTempo}
        setSelectedTempo={setSelectedTempo}
      />

      {/* SUBMIT BUTTON */}
      <div className="flex flex-row justify-end pt-5">
        <Button>Generate</Button>
      </div>
    </div>
  );
};

export default InputForm;
