import FarsiType from "./FarsiType.js";

let id = 0;
let words = [];
let subWordInputCount = 0;
let subTransInputCount = 0;
const translateInputs = [];

document.addEventListener("DOMContentLoaded", () =>
  loadData().then(() => {
    id = words.length - 1;
    showTranslate(id);
  })
);

document.addEventListener("keydown", (e) => {
  if (e.code === "KeyM" && (e.ctrlKey || e.metaKey)) {
    addSubWord();
  }
});

el("#save").onclick = saveAllWords;
el("#wordForm").onsubmit = addWords;
el(".prev").onclick = () => showTranslate(--id);
el(".next").onclick = () => showTranslate(++id);
el("#toggle-form-btn").onclick = toggleForm;
el("#addSubWord").addEventListener("click", addSubWord);
Array.from(elms('.translateFieldset input[type="checkbox"]')).map((elm) =>
  elm.addEventListener("change", addTranslateInput)
);

function showTranslate(id) {
  let content = showWords(id);

  if (content) {
    el(".mainWord").innerHTML = content;
  }
}

function toggleForm(e) {
  let text = e.target.innerHTML;
  text == "Hide"
    ? (e.target.innerHTML = "Show")
    : (e.target.innerHTML = "Hide");
  el("#wordForm").classList.toggle("hide");
}

function saveAllWords() {
  let blob = new Blob([JSON.stringify(words, null, 2)], { type: "text/plain" });
  let link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "words.json";
  link.click();

  URL.revokeObjectURL(link.href);
}

function addWords(e) {
  e.preventDefault();

  if (!this.word.value) {
    showAlert("There is probably an empty field!!", "warning");
    return;
  }

  const arrayToObject = (elmName) =>
    Array.from(elms(elmName)).reduce(
      (obj, elm) => ((obj[elm.name] = elm.value), obj),
      {}
    );

  let phrase = arrayToObject("#wordAndPronunArea input");
  phrase.translates = translateInputs.reduce(
    (acc, elm) => ((acc[elm.name] = elm.value), acc),
    {}
  );
  phrase.subWords = arrayToObject("#subWordInputs input");
  words.push(phrase);
  translateInputs.splice(0);

  showAlert(
    `<strong>${this.word.value}</strong> was successfully Added to the dictionary`,
    "success"
  );

  this.word.value = this.pronunciation.value = "";
  Array.from(elms('input[type="checkbox"]'))
    .filter((elm) => elm.checked)
    .map((elm) => (elm.checked = false));

  Array.from(elms('#translateFieldset input[type="text"]')).map((elm) =>
    elm.remove()
  );
  el("#subWordInputs").innerHTML = "";

  el("#wordInput").focus();
  id++;
  subTransInputCount = 0;
  subWordInputCount = 0;
  showTranslate(words.length - 1);
}

function showWords(n) {
  if (n < 0) {
    ++id;
    return;
  }

  if (n > words.length - 1) {
    --id;
    return;
  }

  function show(index) {
    let [word, pronunciation] = Object.values(words[index]);

    const row = (...content) =>
      content.map(
        (val) => `
            <tr><td colspan="2"><span>${val}</span></td></tr>`
      );

    const transRows = (...entries) =>
      entries.map(
        (item) => ` 
            <tr>
                <td><span>${item[0]}</span></td>
                <td class="translates"><span>${item[1]}</span></td>
            </tr>`
      );

    const subword = (arr, size) =>
      Array.from({ length: Math.ceil(arr.length / size) }, (val, i) =>
        arr.slice(i * size, i * size + size)
      );

    return ` 
        <table>
            <thead>
                ${row(word, pronunciation).join("")}
            </thead>
            <tbody>
                ${transRows(...Object.entries(words[index].translates)).join(
                  ""
                )}
                ${
                  words[index].subWords
                    ? subword(
                        Object.values(words[index].subWords).map(
                          (val) => `<td><span>${val}</span></td>`
                        ),
                        2
                      )
                        .map(
                          (val) => `<tr class="subWordRow">${val.join("")}</tr>`
                        )
                        .join("")
                    : ""
                }
            </tbody>
        </table>`;
  }

  return show(n);
}

function addSubWord() {
  let subWord = ` 
    <div class="packSubWord">
        <label for="subWordInput"class="formGroup">
            <span>Sub Word</span>
            <input type="text"id="subWordInput"
            class="formControl"name="subWord${subWordInputCount++}"/>
        </label>
        <label for="subTransInput"class="formGroup">
            <span>Sub Translate</span>
            <input type="text"id="subTransInput"
                class="translateInput formControl"
                name="subTranslate${subTransInputCount++}" lang="fa-ir"/>
        </label>
    </div>`;

  let deleteInputBtn = newElm(
    "button",
    {
      innerHTML: "X",
      type: "button",
      className: `button`,
    },
    {
      event: "click",
      func: function () {
        this.parentNode.remove();
      },
    }
  );

  let subWordArea = el(".subWordInputs");
  subWordArea.insertAdjacentHTML("beforeend", subWord);
  subWordArea.lastElementChild.append(deleteInputBtn);
  subWordArea.lastElementChild.firstElementChild.lastElementChild.focus();
  FarsiType.init();
}

function addTranslateInput(e) {
  if (e.target.checked) {
    let elm = newElm("input", {
      type: "text",
      className: "formControl translateInput",
      name: e.target.name,
      lang: "fa-ir",
    });

    e.target.parentNode.parentNode.append(elm);
    elm.focus();
    translateInputs.push(elm);
    FarsiType.init();
  } else {
    e.target.parentNode.parentNode.lastElementChild.remove();
    const prevInputs = Object.assign(
      [],
      translateInputs.filter((elm) => elm.name !== e.target.name)
    );
    translateInputs.splice(0);
    translateInputs.push(...prevInputs);
  }
}

async function loadData() {
  let res = await fetch("./words.json");
  words = await res.json();
}

function showAlert(msg, type) {
  let alert = newElm("div", {
    innerHTML: msg,
    className: `alert ${type}`,
  });

  el("body").prepend(alert);
  setTimeout(() => alert.remove(), 3000);
}

function el(name) {
  if (typeof name === "string") {
    return document.querySelector(name);
  }
}

function elms(name) {
  if (typeof name === "string") {
    return document.querySelectorAll(name);
  }
}

function newElm(
  name,
  options = { innerHTML, className, type, id, name, lang },
  listener = { event, func: "" }
) {
  if (typeof name !== "string") return;

  let elm = document.createElement(name);

  for (let [key, value] of Object.entries(arguments[1])) {
    elm[key] = value;
  }

  listener.func && elm.addEventListener(listener.event, listener.func);

  return elm;
}
