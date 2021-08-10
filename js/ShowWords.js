import { el } from "./utils.js";
import { getCurrentWord, getWords } from "./WordStore.js";

export default function showTranslate() {
  let content = showWords();

  if (content) {
    el(".mainWord").innerHTML = content;
  }
}

function showWords() {
  const words = getWords();
  const index = getCurrentWord();
  el("#word-index").value = index;
  
  const [word, pronunciation] = Object.values(words[index]);
  const row = (...content) =>
    content.map(
      (val) => `
            <tr><th><span>${val}</span></th></tr>`
    );

  const transRows = [...Object.entries(words[index].translates)]
    .map(
      (item) => ` 
            <tr>
                <td><span>${item[0]}</span></td>
                <td class="translates"><span>${item[1]}</span></td>
            </tr>`
    )
    .join("");

  const subWord = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (val, i) =>
      arr.slice(i * size, i * size + size)
    );

  const subRows = words[index].subWords
    ? subWord(
        Object.values(words[index].subWords).map(
          (val) => `<td><span>${val}</span></td>`
        ),
        2
      )
        .map((val) => `<tr class="subWordRow">${val.join("")}</tr>`)
        .join("")
    : "";

  return ` 
    <table>
        <thead>
          <tr class="head-overlay"></tr>
            ${row(word, pronunciation).join("")}
        </thead>
        <tbody>
            <tr class="body-overlay"></tr>
            ${transRows}
            ${subRows}
        </tbody>
    </table>`;
}
