type FormFieldProps = {
  labelText: string,
  inputType: "text" | "password",
  inputPlaceholder?: string,
  inputValue: string,
  inputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FormField({labelText, inputType, inputPlaceholder, inputValue, inputChange} : FormFieldProps) {
  return (
    <div className="flex justify-between pt-1">  
      <label className="">
        {labelText}
      </label>
      <input 
        className="border-black border p-1"
        type={inputType} 
        placeholder={inputPlaceholder} 
        value={inputValue} 
        onChange={inputChange}
      />
    </div>
  )
}