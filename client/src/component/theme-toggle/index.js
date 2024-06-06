import { useContext } from "react";
import "./index.css";
import { ThemeContext } from "../../App";

export default function ThemeToggle() {
  const theme = useContext(ThemeContext);
  return (
    <div class="theme-custom-checkbox">
      <i class="fa-solid fa-sun"></i>
      <label href="checkbox" class="container">
        <input
          type="checkbox"
          name="checkbox"
          class="theme"
          onChange={theme.toggle}
        />
        <span></span>
      </label>
      <i class="fa-solid fa-moon"></i>
    </div>
  );
}
