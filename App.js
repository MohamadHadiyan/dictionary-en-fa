import FarsiType from "./FarsiType.js";

let id = 0;
let words = [];
let subWordInputCount = 0;
let subTransInputCount = 0;
const translateInputs = [];
const randomOption = el("#rand-option");

document.addEventListener("DOMContentLoaded", () =>
  loadData().then(() => {
    id = words.length - 1;
    showTranslate(id);
  })
);

document.addEventListener("keydown", handleKeyDown);

el("#save").onclick = saveAllWords;
el("#wordForm").onsubmit = addWords;
el(".prev").onclick = showPrevWord;
el(".next").onclick = showNextWord;
el("#toggle-form-btn").onclick = toggleForm;
el("#addSubWord").addEventListener("click", addSubWord);
el("#first-word").onclick = () => goTo(0);
el("#last-word").onclick = () => goTo(words.length - 1);
el("#word-index").onchange = (e) => goTo(Number(e.target.value));

Array.from(elms('.translateFieldset input[type="checkbox"]')).map((elm) =>
  elm.addEventListener("change", addTranslateInput)
);

handleChangeLangOptions();
function handleKeyDown(e) {
  if (e.code === "KeyM" && (e.ctrlKey || e.metaKey)) {
    addSubWord();
  } else if (e.code === "KeyJ" && (e.ctrlKey || e.metaKey) && e.altKey) {
    el("#noun").focus();
  } else if (e.code === "KeyK" && (e.ctrlKey || e.metaKey) && e.altKey) {
    el("#adjective").focus();
  } else if (e.code === "KeyL" && (e.ctrlKey || e.metaKey) && e.altKey) {
    el("#adverb").focus();
  } else if (e.code === "KeyO" && (e.ctrlKey || e.metaKey) && e.altKey) {
    el("#transitive-verb").focus();
  } else if (e.code === "KeyI" && (e.ctrlKey || e.metaKey) && e.altKey) {
    el("#intransitive-verb").focus();
  }
}
function showNextWord() {
  if (randomOption.checked) {
    id = Math.floor(Math.random() * words.length);
    showTranslate();
  }

  if (id > words.length - 2) return;

  id++;
  showTranslate();
}

function showPrevWord() {
  if (randomOption.checked) {
    id = Math.floor(Math.random() * words.length);
    showTranslate();
  }

  if (id < 1) return;

  id--;
  showTranslate();
}

function goTo(index) {
  if (isNaN(index)) return;

  id = index < 0 ? 0 : index > words.length - 1 ? words.length - 1 : index;
  showTranslate();
}

function showTranslate() {
  let content = showWords();

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

  Array.from(elms('input[type="checkbox"]'))
    .filter((elm) => elm.checked)
    .map((elm) => (elm.checked = false));

  Array.from(elms('#translateFieldset input[type="text"]')).map((elm) =>
    elm.remove()
  );

  this.word.value = this.pronunciation.value = "";
  el("#subWordInputs").innerHTML = "";
  el("#wordInput").focus();
  id++;
  subTransInputCount = 0;
  subWordInputCount = 0;
  showTranslate(words.length - 1);
}

function showWords() {
  el("#word-index").value = id;
  const [word, pronunciation] = Object.values(words[id]);
  const row = (...content) =>
    content.map(
      (val) => `
            <tr><th><span>${val}</span></th></tr>`
    );

  const transRows = [...Object.entries(words[id].translates)]
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

  const subRows = words[id].subWords
    ? subWord(
        Object.values(words[id].subWords).map(
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

function handleChangeLangOptions() {
  el("#en-option").onchange = (e) => {
    if (e.target.checked) {
      const headOverlay = el(".head-overlay");
      const bodyOverlay = el(".body-overlay");
      headOverlay.style.opacity = 0;
      bodyOverlay.style.opacity = 1;
    }
  };

  el("#fa-option").onchange = (e) => {
    if (e.target.checked) {
      const headOverlay = el(".head-overlay");
      const bodyOverlay = el(".body-overlay");
      headOverlay.style.opacity = 1;
      bodyOverlay.style.opacity = 0;
    }
  };
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
