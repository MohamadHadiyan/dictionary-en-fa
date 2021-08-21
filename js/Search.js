import showTranslate from "./ShowWords.js";
import {
  getIndexByIncludes,
  getIndexByStartsWith,
  getKeys,
  getValues,
  isEnglishLang,
  isRTL,
  newElm,
} from "./utils.js";
import { getWords, setCurrentWord } from "./WordStore.js";

const englishSearch = (wordsObj, value) => {
  let index = -1;
  const words = wordsObj.map((item) => item.word);
  index = getIndexByStartsWith(words, value);

  if (index === -1) {
    index = getIndexByIncludes(words, value);
  }

  if (index === -1) {
    index = wordsObj.findIndex((item) =>
      getValues(item.subWords).some((elm) => getKeys(elm)[0].includes(value))
    );
  }

  return index;
};

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
    let index = -1;

    if (!isRTL(value)) {
      index = englishSearch(words, value);
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
