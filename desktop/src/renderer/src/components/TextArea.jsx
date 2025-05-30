export default function TextArea({ placeholder, rows, value, onChange }) {
  return (
    <textarea
      placeholder={placeholder}
      rows={rows}
      className="w-full placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300"
      value={value}
      onChange={onChange}
    />
  )
}
