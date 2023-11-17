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
  const [generating, setGenerating] = React.useState(false);

  const handleGenerate = () => {
    // console.log(selectedModel);
    // console.log(selectedGenre);
    // console.log(selectedMood);
    // console.log(selectedInstruments);
    // console.log(selectedTempo);

    setGenerating(true);

    setTimeout(() => {
      setGenerating(false);
    }, 3000);

    // Making a fetch request to the backend
    fetch("http://127.0.0.1:5000/api/generate")
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

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
        <Button onClick={handleGenerate}>Generate</Button>
      </div>

      {/* GENERATING DIALOG */}
      {generating && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg">
          <p>Generating music...</p>
        </div>
      )}
    </div>
  );
};

export default InputForm;
