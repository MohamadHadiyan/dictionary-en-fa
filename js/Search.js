import showTranslate from "./ShowWords.js";
import { getKeys, getValues, isRTL, newElm } from "./utils.js";
import { getWords, setCurrentWord } from "./WordStore.js";

const englishSearch = (wordsObj, value) => {
  let index = -1;
  const words = wordsObj.map((item) => item.word);
  index = words.findIndex((item) => item.startsWith(value));

  if (index === -1) {
    index = words.findIndex((item) => item.startsWith(value));
  }

  if (index === -1) {
    index = wordsObj.findIndex((item) =>
      getKeys(item.subWords).some((elm) => elm.includes(value))
    );
  }

  return index;
};

const persianSearch = (wordsObj, value) => {
  let index = -1;
  const words = wordsObj.map((item) => item.translates);
  const translates = words.map((item) =>
    getValues(item).reduce((arr, val) => [...arr, ...val], [])
  );

  index = translates.findIndex((arr) =>
    arr.some((word) => word.startsWith(value))
  );

  if (index === -1) {
    index = translates.findIndex((arr) =>
      arr.some((word) => word.includes(value))
    );
  }

  if (index === -1) {
    index = wordsObj.findIndex((item) =>
      getValues(item.subWords).some((elm) =>
        getValues(elm).some((item) => item.includes(value))
      )
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

    if (isRTL(value)) {
      e.target.style = "direction:rtl;font-family:IRANSansWeb, Lato;";
      index = persianSearch(words, value);
    } else {
      e.target.style.direction = "ltr";
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
  search.onblur = (e) => {
    e.target.value ? undefined : checkClasses(e);
    e.target.value ? undefined : (e.target.style.direction = "ltr");
  };

  return search;
};
