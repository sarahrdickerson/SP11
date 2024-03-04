"use client";
import React from "react";

import ModelSelector from "@/components/selectors/model-selector";
import GenreSelector from "@/components/selectors/genre-selector";
import MoodSelector from "@/components/selectors/mood-selector";
import InstrumentsSelector from "@/components/selectors/instruments-selector";
import TempoSelector from "@/components/selectors/tempo-selector";
import GeneralInputSelector from "@/components/selectors/general-input-selector";
import LengthSelector from "@/components/selectors/length-selector";

import { musicModels } from "@/data/models";
import axiosInstance from "@/api/axiosConfig";

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
  const [selectedInput, setSelectedInput] = React.useState(null);
  const [selectedGenre, setSelectedGenre] = React.useState(null);
  const [selectedMood, setSelectedMood] = React.useState(null);
  const [selectedInstruments, setSelectedInstruments] = React.useState(null);
  const [selectedTempo, setSelectedTempo] = React.useState(108);
  const [selectedLength, setSelectedLength] = React.useState(null);
  const [generating, setGenerating] = React.useState(false);

  const handleGenerate = () => {
    // Prepare the data
    const requestData = {
      model: selectedModel.id,
      query: selectedInput,
      genre: selectedGenre,
      mood: selectedMood,
      instruments: selectedInstruments,
      tempo: selectedTempo,
      length: selectedLength,
    };

    // Set generating to true to show the generating dialog
    setGenerating(true);

    // Make the POST request using Axios
    axiosInstance
      // .post("/api/generate_request", requestData)
      .post("/api/generate/MusicGen", requestData)
      .then((response) => {
        console.log("Success:", response.data);
        // Handle the response here
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error here
      })
      .finally(() => {
        setGenerating(false);
      });

    // Make the POST request
    // fetch("http://127.0.0.1:5000/api/generate_request", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(requestData),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Success:", data);
    //     // You can add additional logic here based on the response
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   })
    //   .finally(() => {
    //     // Hide the generating dialog
    //     setGenerating(false);
    //   });
  };

  return (
    <div className="flex flex-col gap-5 rounded-lg border-slate-400/25 p-10 border">
      <h1 className="font-semibold">Inputs</h1>
      <ModelSelector
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      {/* GENERAL INPUT */}
      <GeneralInputSelector
        selectedInput={selectedInput}
        setSelectedInput={setSelectedInput}
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

      {/* LENGTH */}
      <LengthSelector
        selectedLength={selectedLength}
        setSelectedLength={setSelectedLength}
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
