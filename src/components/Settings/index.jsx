import { useState } from "react";
import Input from "../atoms/Input";

function CustomButton({ text, onClick, selected }) {
  return (
    <button
      className={`w-full py-1 bg-slate-600 border rounded-md ${
        selected ? "!bg-slate-900" : ""
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default function Settings({ settings, setSettings }) {
  const [showSettings, setShowSettings] = useState(false);

  function onChange(key, value) {
    setSettings({ ...settings, [key]: value });
  }

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <button
        id="open-settings"
        className="w-fit flex items-center justify-center gap-4 underline underline-offset-4 mb-7"
        onClick={() => setShowSettings(!showSettings)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12.003 21c-.732 .001 -1.465 -.438 -1.678 -1.317a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c.886 .215 1.325 .957 1.318 1.694" />
          <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
          <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M19.001 15.5v1.5" />
          <path d="M19.001 21v1.5" />
          <path d="M22.032 17.25l-1.299 .75" />
          <path d="M17.27 20l-1.3 .75" />
          <path d="M15.97 17.25l1.3 .75" />
          <path d="M20.733 20l1.3 .75" />
        </svg>
        Configuración de conversión
      </button>
      {showSettings && (
        <div className="grid grid-cols-2 gap-4 bg-gray-700 p-2 rounded">
          <div className="grid grid-cols-1 md:grid-cols-[30%_70%] p-4 gap-3 bg-gray-500 rounded items-center">
            <label className="text-center md:w-fit md:text-left">
              Eliminar saltos de línea
            </label>
            <div className="grid grid-cols-2 gap-8">
              <CustomButton
                selected={settings.removeNewlines === true}
                text="Sí"
                onClick={(e) => onChange("removeNewlines", true)}
              />
              <CustomButton
                selected={settings.removeNewlines === false}
                text="No"
                onClick={(e) => onChange("removeNewlines", false)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[30%_70%] p-4 gap-3 bg-gray-500 rounded items-center">
            <label className="text-center md:w-fit md:text-left">
              Delimitador
            </label>
            <Input
              value={settings.delimiter}
              onChange={(e) => onChange("delimiter", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[30%_70%] p-4 gap-3 bg-gray-500 rounded items-center">
            <label className="text-center md:w-fit md:text-left">
              Remover duplicados
            </label>
            <div className="grid grid-cols-2 gap-8">
              <CustomButton
                selected={settings.attackClones === true}
                text="Sí"
                onClick={(e) => onChange("attackClones", true)}
              />
              <CustomButton
                selected={settings.attackClones === false}
                text="No"
                onClick={(e) => onChange("attackClones", false)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[30%_70%] p-4 gap-3 bg-gray-500 rounded items-center">
            <div className="md:w-fit">
              <label className="block text-center md:text-left">
                Etiquetas
              </label>
              <small>
                Añade al inicio o al final de cada valor una etiqueta
              </small>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center justify-center">
                <label className="w-full text-center">Abre</label>
                <Input
                  value={settings.openTag}
                  onChange={(e) => onChange("openTag", e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <label className="w-full text-center">Cierra</label>
                <Input
                  value={settings.closeTag}
                  onChange={(e) => onChange("closeTag", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[30%_70%] p-4 gap-3 bg-gray-500 rounded items-center">
            <label className="w-fit text-center md:text-left">
              Detonar con:
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
              <CustomButton
                selected={settings.explodeBy === "newLines"}
                text="Nuevas lineas"
                onClick={(e) => onChange("explodeBy", "newLines")}
              />
              <CustomButton
                selected={settings.explodeBy === "spaces"}
                text="Espacios"
                onClick={(e) => onChange("explodeBy", "spaces")}
              />
              <CustomButton
                selected={settings.explodeBy === "commas"}
                text="Comas"
                onClick={(e) => onChange("explodeBy", "commas")}
              />
              <CustomButton
                selected={settings.explodeBy === "semicolons"}
                text="Punto y coma"
                onClick={(e) => onChange("explodeBy", "semicolons")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[30%_70%] p-4 gap-3 bg-gray-500 rounded items-center">
            <label className="w-fit text-center md:text-left">
              Añadir comillas
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <CustomButton
                selected={settings.quotes === null}
                text="No"
                onClick={(e) => onChange("quotes", null)}
              />
              <CustomButton
                selected={settings.quotes === "double"}
                text="Dobles"
                onClick={(e) => onChange("quotes", "double")}
              />
              <CustomButton
                selected={settings.quotes === "single"}
                text="Simples"
                onClick={(e) => onChange("quotes", "single")}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[30%_70%] p-4 gap-3 bg-gray-500 rounded items-center">
            <div className="w-fit">
              <label className="block text-center md:text-left">
                Intervalos
              </label>
              <small>Añade una nueva línea cada X valores</small>
            </div>
            <Input
              value={settings.interval}
              onChange={(e) => onChange("interval", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[30%_70%] p-4 gap-3 bg-gray-500 rounded items-center">
            <div className="w-fit">
              <label className="block">Etiquetas de intervalos</label>
              <small>
                Añade al inicio o al final de cada intervalo una etiqueta
              </small>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center justify-center">
                <label className="w-full text-center">Abre</label>
                <Input
                  value={settings.openIntervalTag}
                  onChange={(e) => onChange("openIntervalTag", e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <label className="w-full text-center">Cierra</label>
                <Input
                  value={settings.closeIntervalTag}
                  onChange={(e) => onChange("closeIntervalTag", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[30%_70%] p-4 gap-3 bg-gray-500 rounded items-center">
            <div className="w-fit">
              <label className="block text-center md:text-left">
                Recortar al inicio
              </label>
              <small>Remueve X caracteres al inicio de cada valor</small>
            </div>
            <Input
              value={settings.trimStart}
              onChange={(e) => onChange("trimStart", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[30%_70%] p-4 gap-3 bg-gray-500 rounded items-center">
            <div className="w-fit">
              <label className="block text-center md:text-left">
                Recortar al final
              </label>
              <small>Remueve X caracteres al final de cada valor</small>
            </div>
            <Input
              value={settings.trimEnd}
              onChange={(e) => onChange("trimEnd", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
