function InputLogin({ type, placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-3 rounded-lg border border-gray-400"
    />
  )
}

export default InputLogin
