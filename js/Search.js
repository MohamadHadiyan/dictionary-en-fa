import showTranslate from "./ShowWords.js";
import { newElm } from "./utils.js";
import { getWords, setCurrentWord } from "./WordStore.js";

export const SearchBox = () => {
  const checkClasses = (e) => {
    if (e.target.classList.contains("error-shadow")) {
      e.target.classList.remove("error-shadow");
    }
  }
  const handleSearch = (e) => {
    const value = e.target.value.trim();
    if (!value) return;

    const words = getWords();
    const wordObj = words
      .filter((item) => item.word.startsWith(value))
      .slice(0, 5);

    if (wordObj.length == 0) {
      e.target.classList.add("error-shadow");
      return;
    }

    checkClasses(e);

    const word = wordObj[0].word;
    const index = words.findIndex((item) => item.word.includes(word));

    setCurrentWord(index);
    showTranslate();
  };

  const search = newElm(
    "input",
    { type: "search", className: "option text-option" },
    { event: "keyup", func: handleSearch }
  );

  search.placeholder = "Search...";
  search.onblur = (e) => e.target.value ? undefined : checkClasses(e);

  return search;
};
