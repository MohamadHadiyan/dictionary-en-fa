import showTranslate from "./ShowWords.js";
import { newElm } from "./utils.js";
import { getWords, setCurrentWord } from "./WordStore.js";

export const SearchBox = () => {
  const checkClasses = (e) => {
    if (e.target.classList.contains("error-shadow")) {
      e.target.classList.remove("error-shadow");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    if (!value) return;

    const words = getWords();
    let index = words.findIndex((item) => item.word.startsWith(value));

    if (index === -1) {
      index = words.findIndex((item) => item.word.includes(value));
    }

    if (index === -1) {
      index = words.findIndex((item) =>
        Object.values(item.subWords).some((elm) =>
          Object.keys(elm)[0].includes(value)
        )
      );
    }

    if (index === -1) {
      e.target.classList.add("error-shadow");
      return;
    }

    checkClasses(e);
    setCurrentWord(index);
    showTranslate();
  };

  const search = newElm(
    "input",
    { type: "search", className: "option text-option" },
    { event: "keyup", func: handleSearch }
  );

  search.placeholder = "Search...";
  search.onblur = (e) => (e.target.value ? undefined : checkClasses(e));

  return search;
};
