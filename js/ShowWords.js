import { el, getEntries } from "./utils.js";
import { getCurrentWord, getWords } from "./WordStore.js";

export default function showTranslate() {
  let content = showWords();

  if (content) {
    el(".mainWord").innerHTML = content;
  }
}

function showWords() {
  const words = getWords();
  if (!words || words.length === 0) return;

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
                <td class="translates"><span>${item[1].join(" ، ")}</span></td>
            </tr>`
    )
    .join("");

  const subWords = getEntries(words[index].subWords);
  const subRows =
    subWords.length > 0
      ? subWords
          .map((item) => {
            return `<tr class="subWordRow"><td><span>${
              item[0]
            }</span></td><td><span>${item[1].join(" ، ")}</span></td></tr>`;
          })
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
