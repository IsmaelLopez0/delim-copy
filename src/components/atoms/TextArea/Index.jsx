import { useRef } from "react";
import "./TextArea.css";

export default function TextArea({ id, value, setValue }) {
  const textareaRef = useRef(null);
  const divRef = useRef(null);

  function ScrollDiv() {
    textareaRef.current.scrollTop = divRef.current.scrollTop;
  }

  function ScrollTextArea() {
    divRef.current.scrollTop = textareaRef.current.scrollTop;
  }

  const onChange = (e) => setValue(e.target.value);

  async function copyToClipboard(e) {
    e.preventDefault();
    await navigator.clipboard.writeText(value);
  }

  return (
    <div className="flex h-32" id={id}>
      <div
        id={`lines-${id}`}
        ref={divRef}
        onScroll={ScrollDiv}
        className="h-full bg-slate-400 border border-r-0 rounded-l-md custom-scroll"
      >
        {value.split("\n").map((_, i) => (
          <div
            key={i}
            className="w-12 text-right px-3 h-[24px] box-border border-b border-slate-300 ml-1"
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div className="relative w-full">
        <button
          onClick={copyToClipboard}
          className="right-2 top-2 text-sm absolute rounded-md text-white bg-blue-500 py-1 px-2 active:bg-slate-600"
        >
          Copiar
        </button>
        <textarea
          id={`textArea-${id}`}
          ref={textareaRef}
          onScroll={ScrollTextArea}
          className="w-full h-32 resize-none border border-l-0 box-border !leading-6 rounded-r px-2 custom-scroll"
          placeholder="Enter your data here..."
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
