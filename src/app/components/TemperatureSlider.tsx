import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

type TemperatureSliderProps = {
  temperature: number;
  setTemperature: (temp: number) => void;
};

const TemperatureSlider: React.FC<TemperatureSliderProps> = ({
  temperature,
  setTemperature,
}) => {
  const helperText = () => {
    if (temperature <= 0.2) return "Generates predictable questions";
    if (temperature <= 0.4) return "Generates moderately creative questions";
    if (temperature <= 0.6) return "Generates creative questions";
    if (temperature <= 0.8) return "Generates very creative questions";
    return "Generates highly unpredictable questions";
  };

  return (
    <div className="mb-4 flex flex-col items-center">
      <label
        htmlFor="temperature-slider"
        className="font-bold text-gray-700 dark:text-gray-300"
      >
        AI Temperature:
      </label>
      <input
        id="temperature-slider"
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={temperature}
        onChange={(e) => setTemperature(Number(e.target.value))}
        className="w-full mt-2 cursor-pointer"
      />
      <p className="mt-1 text-sm text-gray-600">{helperText()}</p>
    </div>
  );
};

export default TemperatureSlider;
