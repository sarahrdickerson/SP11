"use client";
import React, { useContext } from "react";

import ModelSelector from "@/components/selectors/model-selector";
import GenreSelector from "@/components/selectors/genre-selector";
import MoodSelector from "@/components/selectors/mood-selector";
import InstrumentsSelector from "@/components/selectors/instruments-selector";
import TempoSelector from "@/components/selectors/tempo-selector";
import GeneralInputSelector from "@/components/selectors/general-input-selector";
import LengthSelector from "@/components/selectors/length-selector";

import { musicModels } from "@/data/models";
import axiosInstance from "@/api/axiosConfig";
import { FileIdContext } from "@/context/fileIdContext";

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
import { PlusCircledIcon } from "@radix-ui/react-icons";
import AddExtrasSelector from "@/components/addextras";

const InputForm = () => {
  const [selectedModel, setSelectedModel] = React.useState(musicModels[0]);
  const [selectedInput, setSelectedInput] = React.useState(null);
  const [selectedGenre, setSelectedGenre] = React.useState(null);
  const [selectedMood, setSelectedMood] = React.useState(null);
  const [selectedInstruments, setSelectedInstruments] = React.useState(null);
  const [selectedTempo, setSelectedTempo] = React.useState(108);
  const [selectedLength, setSelectedLength] = React.useState(null);
  const [generating, setGenerating] = React.useState(false);
  const [selectedExtras, setSelectedExtras] = React.useState([]);

  const { setCurrentFileId } = useContext(FileIdContext); // set file ID in context

  const extrasComponents = {
    Genre: GenreSelector,
    Mood: MoodSelector,
    Instruments: InstrumentsSelector,
    Tempo: TempoSelector,
    // Add any other extras here
  };
  const [extrasState, setExtrasState] = React.useState({
    genre: "",
    mood: "",
    instruments: "",
    tempo: 120, // Assuming the tempo is a number
  });

  const handleGenerate = () => {
    // Prepare the data
    const requestData = {
      query: selectedInput,
      model: selectedModel.id,
      length: selectedLength,
    };
    selectedExtras.forEach((extra) => {
      requestData[extra.name.toLowerCase()] =
        extrasState[extra.name.toLowerCase()];
    });

    // Set generating to true to show the generating dialog
    setGenerating(true);

    console.log("request data: ", requestData);
    // Make the POST request using Axios
    axiosInstance
      // .post("/api/generate_request", requestData)
      .post("/api/generate/MusicGen", requestData, { timeout: 120000 })
      .then((response) => {
        console.log("Success:", response.data);
        console.log("Setting file ID to:", response.data.file_id);
        setCurrentFileId(response.data.file_id);
        console.log(response.data.file_id);
        // Handle the response here
        setGenerating(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error here
        setGenerating(false);
      });
  };

  const handleAddExtra = (extra) => {
    setSelectedExtras((prevExtras) => {
      // Check if the extra is already added
      if (prevExtras.some((e) => e.name === extra)) return prevExtras;
      // Add the new extra at the end
      return [
        ...prevExtras,
        { name: extra, Component: extrasComponents[extra] },
      ];
    });
  };

  const handleRemoveExtra = (extraName) => {
    setSelectedExtras((prevExtras) =>
      prevExtras.filter((e) => e.name !== extraName)
    );
    // You might also want to reset the state for this extra if necessary
    setExtrasState((prevState) => ({
      ...prevState,
      [extraName.toLowerCase()]: "", // Reset to default value
    }));
  };

  const updateExtraState = (extraType, value) => {
    setExtrasState((prevExtrasState) => ({
      ...prevExtrasState,
      [extraType.toLowerCase()]: value,
    }));
  };

  // Render the extra selectors based on the selected extras
  const renderExtras = selectedExtras.map((extra) => {
    const ExtraComponent = extrasComponents[extra.name];
    return (
      <ExtraComponent
        key={extra.name}
        selected={extrasState[extra.name.toLowerCase()]}
        setSelected={(value) =>
          updateExtraState(extra.name.toLowerCase(), value)
        }
        onRemove={() => handleRemoveExtra(extra.name)}
      />
    );
  });

  return (
    <div className="flex flex-col gap-5 rounded-lg  p-10 bg-white">
      {/* GENERAL INPUT */}
      <GeneralInputSelector
        selectedInput={selectedInput}
        setSelectedInput={setSelectedInput}
      />

      {/* <h1 className="font-semibold">Inputs</h1> */}
      <ModelSelector
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      {/* LENGTH */}
      <LengthSelector
        selectedLength={selectedLength}
        setSelectedLength={setSelectedLength}
      />

      {renderExtras}

      {/* Add Extras */}
      <div className="flex flex-row justify-between place-items-center items-center pt-5">
        <AddExtrasSelector
          onAddExtra={handleAddExtra}
          selectedExtras={selectedExtras}
        />
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
