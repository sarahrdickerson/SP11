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
// import { FileIdContext } from "@/context/fileIdContext";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import AddExtrasSelector from "@/components/addextras";

const InputForm = ({ onGenerate }) => {
  const [selectedModel, setSelectedModel] = React.useState(musicModels[0]);
  const [selectedInput, setSelectedInput] = React.useState(null);
  const [selectedGenre, setSelectedGenre] = React.useState(null);
  const [selectedMood, setSelectedMood] = React.useState(null);
  const [selectedInstruments, setSelectedInstruments] = React.useState(null);
  const [selectedTempo, setSelectedTempo] = React.useState(108);
  const [selectedLength, setSelectedLength] = React.useState(null);
  const [generating, setGenerating] = React.useState(false);
  const [selectedExtras, setSelectedExtras] = React.useState([]);
  const [userId, setUserId] = React.useState(null);

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Ensure we're running this in the browser
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          // Assuming that the user object was stored as JSON
          const user = JSON.parse(storedUser);
          setUserId(user.id); // or however you have stored the email field
          console.log("User ID:", user.id);
        } catch (error) {
          console.error("Failed to parse the user from localStorage:", error);
        }
      }
    }
  }, []);

  // Add state for error handling
  const [errors, setErrors] = React.useState({
    query: false,
    model: false,
    length: false,
  });

  // Validate the required fields
  const validate = () => {
    const newErrors = {
      query: !selectedInput,
      model: !selectedModel.id,
      length: !selectedLength,
    };

    setErrors(newErrors);

    // Return true if there are no errors
    return !Object.values(newErrors).some((error) => error);
  };

  const { setCurrentFileId } = useContext(FileIdContext); // set file ID in context
  const { setCurrentMp3FileId } = useContext(FileIdContext); // set mp3 file ID in context
  const { setCurrentChordId } = useContext(FileIdContext); // set chord ID in context

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

  const modelApiMap = {
    musicgen: "/api/generate/musicgen",
    riffusion: "/api/generate/riffusion",
    audio_ldm: "/api/generate/audio-ldm",
    looptest: "/api/generate/looptest",
  };

  const handleGenerate = () => {
    setIsLoading(true);
    // First validate the input
    if (!validate()) {
      console.log("Validation failed");
      setIsLoading(false);
      return; // Stop the function if validation fails
    }
    // Prepare the data
    const requestData = {
      user_id: userId,
      query: selectedInput,
      model: selectedModel.id,
      length: selectedLength,
    };
    selectedExtras.forEach((extra) => {
      requestData[extra.name.toLowerCase()] =
        extrasState[extra.name.toLowerCase()];
    });

    // Set generating to true to show the generating dialog
    // setGenerating(true);

    console.log("request data: ", requestData);

    // set api route based on selected model
    const apiRoute = modelApiMap[selectedModel.id];

    console.log("calling api route: ", apiRoute);

    // Make the POST request using Axios
    axiosInstance
      // .post("/api/generate_request", requestData)
      .post(apiRoute, requestData, { timeout: 480000 })
      .then((response) => {
        console.log("Success:", response.data);
        console.log("Setting file ID to:", response.data.wav_file_id);
        console.log("Setting mp3 file ID to:", response.data.mp3_file_id);
        console.log("Setting chord file ID to:", response.data.chord_file_id);
        setCurrentFileId(response.data.wav_file_id);
        setCurrentMp3FileId(response.data.mp3_file_id);
        setCurrentChordId(response.data.chord_file_id);
        console.log(response.data.mp3_file_id);
        console.log(response.data.wav_file_id);
        console.log(response.data.chord_file_id);
        // Handle the response here
        // setGenerating(false);
        setIsLoading(false);
        onGenerate();
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error here
        // setGenerating(false);
        setIsLoading(false);
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
      {/* <GeneralInputSelector
        selectedInput={selectedInput}
        setSelectedInput={setSelectedInput}
      /> */}
      <div className={errors.query ? "error-border" : ""}>
        <GeneralInputSelector
          selectedInput={selectedInput}
          setSelectedInput={setSelectedInput}
        />
        {errors.query && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-red-500 text-sm">
                  * Prompt is required
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                This field is required.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* <h1 className="font-semibold">Inputs</h1> */}
      <div className={errors.model ? "error-border" : ""}>
        <ModelSelector
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />{" "}
        {errors.model && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-red-500 text-sm">
                  * Model is required
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                This field is required.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* LENGTH */}
      <div className={errors.length ? "error-border" : ""}>
        <LengthSelector
          selectedLength={selectedLength}
          setSelectedLength={setSelectedLength}
        />
        {errors.length && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-red-500 text-sm">
                  * Sample Length is required
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                This field is required.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {renderExtras}

      {/* Add Extras */}
      <div className="flex flex-row justify-between place-items-center items-center pt-5">
        <AddExtrasSelector
          onAddExtra={handleAddExtra}
          selectedExtras={selectedExtras}
        />
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            ""
          )}
          Generate
        </Button>
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
