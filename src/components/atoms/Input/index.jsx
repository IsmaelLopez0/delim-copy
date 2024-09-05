export default function Input({ id, value, onChange }) {
  return (
    <input
      id={id}
      type="text"
      defaultValue={value}
      onChange={onChange}
      className="w-full h-7 px-2 bg-slate-600 border rounded-md"
    />
  );
}
