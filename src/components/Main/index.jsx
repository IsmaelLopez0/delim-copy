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
  });

  function cleanEmptyLines(lines) {
    const cleanedLines = lines.filter(line => line.trim() !== "");
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
    // Paso 7: Delimiter: Usar un delimitador entre los registros es algo que se hace típicamente después de haber aplicado el formato y las transformaciones.
    let delimiter = settings.delimiter;
    if (delimiter === "newLine") {
      delimiter = "\n";
    }
    // Paso 1: Explode: Primero debes dividir el texto en registros utilizando el delimitador adecuado.
    let leftSideTemp = [];
    const itemsByLine = {};
    const existingValues = [];
    const openTag = settings.openIntervalTag ?? "";
    const closeTag = settings.closeIntervalTag ?? "";
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
      // leftSideTemp.push(...record.split(explode));
      let rowValues = record.split(explode);
      // Paso 2: Attack the Clones: Eliminar duplicados una vez que los registros están bien formateados y limpiados.
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
      // Paso 3: Add Quotes: Agregar comillas a los registros después de haber eliminado los duplicados y limpiado el formato.
      if (settings.quotes) {
        const quotes = settings.quotes === "double" ? '"' : "'";
        rowValues = rowValues.map((item) => `${quotes}${item}${quotes}`);
      }
      // Paso 4: Tags: Envolver los registros en etiquetas HTML después de haber definido el formato y los delimitadores.
      if (settings.openTag || settings.closeTag) {
        const { openTag, closeTag } = settings;
        rowValues = rowValues.map((item) => `${openTag ?? ""}${item}${closeTag ?? ""}`);
      }
      // Paso 5: Interval: Agregar saltos de línea aquí de un cierto número de registros, lo cual puede ser una función antes de finalizar el proceso.
      // Paso 6: Interval Wrap: Finalmente, envolver los intervalos con etiquetas HTML si es necesario. Esta operación se realiza mejor al final porque encapsula los intervalos completos. */
      if (settings.interval) {
        for (let i = 0; i < rowValues.length; i += 1) {
          if (countToIntervals === 0) {
            rowValues[i] = `${openTag}${rowValues[i]}`;
          }
          if (countToIntervals >= 0 && countToIntervals < Number(settings.interval)) {
            countToIntervals += 1;
          }
          const canContinue = index < lines.length - 1 || i < rowValues.length - 1;
          if (countToIntervals === Number(settings.interval) || !canContinue) {
            rowValues[i] = `${rowValues[i]}${closeTag}`;
            countToIntervals = 0;
          }
        }
      }
      itemsByLine[index] = rowValues;
    });
    // Paso 8: Tidy Up: Eliminar saltos de línea internos es útil para limpiar los registros.
    let finalOutput = Object.values(itemsByLine).map((item) => item.join(delimiter));
    if (settings.removeNewlines) {
      finalOutput = finalOutput.join(delimiter);
    } else {
      finalOutput = finalOutput.join(`${delimiter}\n`);
    }
    leftSideTemp = leftSideTemp.join(delimiter);
    setRightSide(finalOutput.trim());
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
