import { loadData } from "./utils.js";

const wordStore={
  words:[],
  currentWord: 0,
};

export const setWordStore = async () =>{
    const data = await loadData();
    wordStore.words.push(...data);
}

export const getWords = () => {
  return wordStore.words;
}

export const setCurrentWord = (index) =>{
  wordStore.currentWord = index;
}

export const getCurrentWord = () =>{
  return wordStore.currentWord;
}