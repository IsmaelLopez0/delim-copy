import { useState } from "react";
import TextArea from "../atoms/TextArea/Index";
import Settings from "../Settings";
import Select from "../atoms/Select";
import { attackTheClones } from "../../utils/functions";

export default function Main() {
  const [leftSide, setLeftSide] = useState("");
  const [rightSide, setRightSide] = useState("");
  const [settings, setSettings] = useState({
    removeNewlines: true,
    attackClones: false,
    explodeBy: "newLines",
    quotes: null,
    delimiter: ",",
    openTag: "",
    closeTag: "",
    interval: "",
    openIntervalTag: "",
    closeIntervalTag: "",
    trimStart: 0,
    trimEnd: 0,
  });

  function cleanEmptyLines(lines) {
    const cleanedLines = lines.filter((line) => line.trim() !== "");
    return cleanedLines;
  }

  function transformFromLeftSide() {
    let explode = "\n";
    switch (settings.explodeBy) {
      case "spaces":
        explode = " ";
        break;
      case "comma":
        explode = ",";
        break;
      case "semicolon":
        explode = ";";
        break;
      default:
        explode = "\n";
        break;
    }
    let delimiter = settings.delimiter;
    if (delimiter === "newLine") {
      delimiter = "\n";
    }
    const itemsByLine = {};
    const existingValues = [];
    const openIntervalTag = settings.openIntervalTag
      ? `\\${settings.openIntervalTag}`
      : "";
    const closeIntervalTag = settings.closeIntervalTag
      ? `\\${settings.closeIntervalTag}`
      : "";
    let countToIntervals = 0;
    const lines = attackTheClones(
      cleanEmptyLines(leftSide.split("\n")),
      settings.attackClones,
      explode
    );
    lines.forEach((record, index) => {
      if (record.trim().length === 0) {
        return;
      }
      let rowValues = record.split(explode);
      if (settings.attackClones) {
        for (let i = rowValues.length - 1; i >= 0; i--) {
          const value = rowValues[i];
          if (!existingValues.includes(value)) {
            existingValues.push(value);
          } else {
            rowValues.splice(i, 1);
          }
        }
      }
      if (rowValues.length === 0) {
        return;
      }
      if (settings.trimStart) {
        rowValues = rowValues.map((item) =>
          item.substring(Number(settings.trimStart))
        );
      }
      if (settings.trimEnd) {
        rowValues = rowValues.map((item) =>
          item.substring(item.length - Number(settings.trimEnd))
        );
      }
      if (settings.quotes) {
        const quotes = settings.quotes === "double" ? '"' : "'";
        rowValues = rowValues.map((item) => `${quotes}${item}${quotes}`);
      }
      if (settings.openTag || settings.closeTag) {
        const { openTag, closeTag } = settings;
        rowValues = rowValues.map(
          (item) => `${openTag ?? ""}${item}${closeTag ?? ""}`
        );
      }
      if (settings.interval) {
        for (let i = 0; i < rowValues.length; i += 1) {
          if (countToIntervals === 0) {
            rowValues[i] = `${openIntervalTag}${rowValues[i]}`;
          }
          if (
            countToIntervals >= 0 &&
            countToIntervals < Number(settings.interval)
          ) {
            countToIntervals += 1;
          }
          const canContinue =
            index < lines.length - 1 || i < rowValues.length - 1;
          if (countToIntervals === Number(settings.interval) || !canContinue) {
            rowValues[i] = `${rowValues[i]}${closeIntervalTag}`;
            countToIntervals = 0;
          }
        }
      }
      itemsByLine[index] = rowValues;
    });
    let finalOutput = Object.values(itemsByLine).map((item) =>
      item.join(delimiter)
    );
    if (settings.removeNewlines) {
      finalOutput = finalOutput.join(delimiter);
    } else {
      finalOutput = finalOutput.join(`${delimiter}\n`);
    }
    if (settings.interval) {
      const regex = new RegExp(
        `${closeIntervalTag}${
          delimiter ? `\\${delimiter}` : ""
        }${openIntervalTag}`,
        "gm"
      );
      console.log({ regex });
      finalOutput = finalOutput
        .trim()
        .replace(regex, `${closeIntervalTag}\n${openIntervalTag}`);
    }
    setRightSide(finalOutput);
  }

  function transformFromRightSide() {
    let baseInitial = rightSide;
    let delimiter = settings.delimiter;
    if (delimiter === "newLine") {
      delimiter = "\n";
    }
    const openIntervalTag = settings.openIntervalTag
      ? `\\${settings.openIntervalTag}`
      : "";
    const closeIntervalTag = settings.closeIntervalTag
      ? `\\${settings.closeIntervalTag}`
      : "";
    if (settings.interval) {
      const regex = new RegExp(`${closeIntervalTag}\n${openIntervalTag}`, "gm");
      baseInitial = baseInitial
        .trim()
        .replace(
          regex,
          `${closeIntervalTag}\\${
            delimiter ? `\\${delimiter}` : ""
          }${openIntervalTag}`
        );
    }
    if (settings.removeNewlines) {
      baseInitial = baseInitial.split(delimiter);
    } else {
      baseInitial = baseInitial.split(`${delimiter}\n`);
    }
    let rowValues = baseInitial;
    if (settings.interval) {
      let countToIntervals = 0;
      for (let i = 0; i < rowValues.length; i += 1) {
        if (countToIntervals === 0) {
          rowValues[i] = rowValues[i].replace(openIntervalTag, "");
        }
        if (
          countToIntervals >= 0 &&
          countToIntervals < Number(settings.interval)
        ) {
          countToIntervals += 1;
        }
        const canContinue = i < rowValues.length - 1;
        if (countToIntervals === Number(settings.interval) || !canContinue) {
          rowValues[i] = rowValues[i].replace(closeIntervalTag, "");
          countToIntervals = 0;
        }
      }
    }
    if (settings.openTag || settings.closeTag) {
      const { openTag, closeTag } = settings;
      const regex = new RegExp(
        `${openTag ? `\\${openTag}` : ""}${closeTag ? `\\${closeTag}` : ""}`,
        "gm"
      );
      rowValues = rowValues.map((item) => item.replace(regex, ""));
    }
    if (settings.quotes) {
      const quotes = settings.quotes === "double" ? '"' : "'";
      const regex = new RegExp(quotes, "gm");
      rowValues = rowValues.map((item) => item.replace(regex, ""));
    }
    let explode = "\n";
    switch (settings.explodeBy) {
      case "spaces":
        explode = " ";
        break;
      case "comma":
        explode = ",";
        break;
      case "semicolon":
        explode = ";";
        break;
      default:
        explode = "\n";
        break;
    }
    setLeftSide(rowValues.join(explode));
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_1fr] gap-5 mb-7">
        <div className="col-span-1">
          <h2 className="text-2xl mb-3 pl-4">Datos en columnas aquí ...</h2>
          <TextArea
            id="left"
            value={leftSide}
            setValue={setLeftSide}
            client:visible
          />
        </div>
        <div className="flex md:flex-col justify-center items-center md:pt-11 mx-auto gap-5 md:gap-0">
          <button
            id="transformRight"
            aria-label="transform-right"
            onClick={() => transformFromRightSide()}
          >
            <svg
              className="rotate-90 md:transform-none"
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 15v3.586a1 1 0 0 1 -1.707 .707l-6.586 -6.586a1 1 0 0 1 0 -1.414l6.586 -6.586a1 1 0 0 1 1.707 .707v3.586h6v6h-6z" />
              <path d="M21 15v-6" />
            </svg>
          </button>
          <Select
            label=""
            value={settings.delimiter}
            options={[
              { value: ",", label: "Coma" },
              { value: ";", label: "Punto y coma" },
              { value: "|", label: "Pipe" },
              { value: " ", label: "Espacio" },
              { value: "newLine", label: "Nueva Línea" },
            ]}
            onChange={(evt) =>
              setSettings({ ...settings, delimiter: evt.target.value })
            }
            client:visible
          />
          <button
            id="transformLeft"
            aria-label="transform-left"
            onClick={() => transformFromLeftSide()}
          >
            <svg
              className="rotate-90 md:transform-none"
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 9v-3.586a1 1 0 0 1 1.707 -.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586a1 1 0 0 1 -1.707 -.707v-3.586h-6v-6h6z" />
              <path d="M3 9v6" />
            </svg>
          </button>
        </div>
        <div className="col-span-1">
          <h2 className="text-2xl mb-3 pl-4">Datos delimitados aquí ...</h2>
          <TextArea
            id="right"
            value={rightSide}
            setValue={setRightSide}
            client:visible
          />
        </div>
      </div>

      <Settings settings={settings} setSettings={setSettings} client:visible />
    </>
  );
}
