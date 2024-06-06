import { ThemeContext } from "../../App";
import "./index.css";
import { useState, memo, useContext } from "react";

function Field({ onSubmit, placeholder, button, className = "", style }) {
  const [value, setValue] = useState("");
  const handleChange = (e) => setValue(e.target.value);
  const handleSubmit = () => {
    if (value.length === 0) return null;

    if (onSubmit) {
      onSubmit(value);
    } else {
      throw new Error("Error!!! onSubmit props is undefined.");
    }
    setValue("");
  };

  const isDisabled = value.length === 0;

  const theme = useContext(ThemeContext);

  return (
    <div className={`field ${className}`} style={style}>
      <textarea
        onChange={handleChange}
        value={value}
        rows={2}
        placeholder={placeholder}
        className="field__input"
      ></textarea>
      <button
        disabled={isDisabled}
        onClick={handleSubmit}
        className={`field__button field__button--${theme}`}
      >
        {button}
      </button>
    </div>
  );
}

export default memo(Field);
