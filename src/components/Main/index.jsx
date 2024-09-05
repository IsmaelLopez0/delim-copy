import { useState } from "react";
import TextArea from "../atoms/TextArea/Index";
import Settings from "../Settings";
import Select from "../atoms/Select";

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
  });

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
    let leftSideTemp = leftSide.split("\n");
    let delimiter = settings.delimiter;
    if (delimiter === "newLine") {
      delimiter = "\n";
    }
    if (settings.attackClones) {
      const dataArr = new Set(leftSideTemp);
      leftSideTemp = [...dataArr];
    }
    if (settings.openTag) {
      leftSideTemp = leftSideTemp.map((item) => `${settings.openTag}${item}`);
    }
    if (settings.closeTag) {
      leftSideTemp = leftSideTemp.map((item) => `${item}${settings.closeTag}`);
    }
    if (settings.quotes) {
      if (settings.quotes === "double") {
        leftSideTemp = leftSideTemp.map((item) => `"${item}"`);
      } else if (settings.quotes === "single") {
        leftSideTemp = leftSideTemp.map((item) => `'${item}'`);
      }
    }
    if (settings.interval) {
      const temp = [];
    }
    if (settings.removeNewlines) {
      leftSideTemp = leftSideTemp.join(delimiter);
    }
    setRightSide(leftSideTemp);
  }

  return (
    <>
      <div className="grid grid-cols-[1fr_100px_1fr] gap-5 mb-7">
        <div className="col-span-1">
          <h2 className="text-2xl mb-3 pl-4">Datos en columnas aquí ...</h2>
          <TextArea
            id="left"
            value={leftSide}
            setValue={setLeftSide}
            client:visible
          />
        </div>
        <div className="flex flex-col justify-center items-center mx-auto">
          <button>
            <svg
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
          <button onClick={() => transformFromLeftSide()}>
            <svg
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
