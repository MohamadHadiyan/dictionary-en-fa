import { loadData } from "./utils.js";

const wordStore = {
  words: [],
  currentWord: 0,
};

export const setWordStore = async () => {
  const data = await loadData("../all-words/j-words.json");
  if (data) {
    wordStore.words.push(...data);
  }
};

export const getWords = () => {
  return wordStore.words;
};

export const addWordToStore = (word) => {
  if (typeof word !== "object") return;
  wordStore.words.push(word);
};

export const setCurrentWord = (index) => {
  wordStore.currentWord = index;
};

export const getCurrentWord = () => {
  return wordStore.currentWord;
};
