import { createContext, useMemo, useState } from "react";
import Page from "./component/page";
import PostList from "./container/post-list";
import ThemeToggle from "./component/theme-toggle";

const THEME_TYPE = {
  LIGHT: "light",
  DARK: "dark",
};

export const ThemeContext = createContext(null);

function App() {
  const [currentTheme, setTheme] = useState(THEME_TYPE.LIGHT);

  const handleChangeTheme = () => {
    setTheme((prevTheme) => {
      console.log(prevTheme);
      return prevTheme === THEME_TYPE.LIGHT
        ? THEME_TYPE.DARK
        : THEME_TYPE.LIGHT;
    });
  };

  const theme = useMemo(
    () => ({
      value: currentTheme,
      toggle: handleChangeTheme,
    }),
    [currentTheme]
  );

  return (
    <Page>
      <ThemeContext.Provider value={theme}>
        <ThemeToggle />
        <PostList />
      </ThemeContext.Provider>
    </Page>
  );
}

export default App;
