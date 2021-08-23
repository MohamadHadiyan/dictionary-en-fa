import FarsiType from "./FarsiType.js";
import {
  arrayElementsTwoObject,
  arrayToKeyValueObject,
  el,
  elms,
  isEmptyObject,
  newElm,
  showAlert,
  textToArray,
} from "./utils.js";
import { addFieldsetOptions, getTranslatesWord } from "./FieldsetOptions.js";
import { SearchBox } from "./Search.js";
import {
  addWordToStore,
  getCurrentWord,
  getWords,
  setCurrentWord,
  setWordStore,
} from "./WordStore.js";
import showTranslate from "./ShowWords.js";

const words = [];
let subWordInputCount = 0;
let subTransInputCount = 0;
const randomOption = el("#rand-option");

document.addEventListener("DOMContentLoaded", async () => {
  await setWordStore();
  const data = getWords();

  words.push(...data);
  setCurrentWord(words.length - 1);
  showTranslate();
});

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

addFieldsetOptions();
handleChangeLangOptions();
addOptionsMenu();

function addOptionsMenu() {
  const optionsMenu = el(".options-menu");
  optionsMenu.append(SearchBox());
}

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
    const nextId = Math.floor(Math.random() * words.length);
    setCurrentWord(nextId);
    showTranslate();
  }

  const currentIndex = getCurrentWord();
  if (currentIndex > words.length - 2) return;

  setCurrentWord(currentIndex + 1);
  showTranslate();
}

function showPrevWord() {
  if (randomOption.checked) {
    const nextId = Math.floor(Math.random() * words.length);
    setCurrentWord(nextId);
    showTranslate();
  }

  const currentIndex = getCurrentWord();
  if (currentIndex < 1) return;

  setCurrentWord(currentIndex - 1);
  showTranslate();
}

function goTo(index) {
  if (isNaN(index)) return;

  const nextId =
    index < 0 ? 0 : index > words.length - 1 ? words.length - 1 : index;

  setCurrentWord(nextId);
  showTranslate();
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

  const inputs = [...elms("#wordAndPronunArea input")];
  const subInputs = [...elms("#subWordInputs input")].map((elem) => elem.value);

  const word = arrayElementsTwoObject(inputs);
  const subWords = subInputs.map((item, i) =>
    i % 2 !== 0 ? textToArray(item, "،") : item
  );

  word.translates = getTranslatesWord();
  word.subWords = subInputs.length > 0 ? arrayToKeyValueObject(subWords) : {};

  const isEmpty = isEmptyObject(word.translates);
  const isSubEmpty = subInputs.some((item) => item === "");

  if (isEmpty || isSubEmpty) {
    showAlert("There is probably an empty translate fields!!", "warning");
    return;
  }

  words.push(word);
  addWordToStore(word);

  showAlert(
    `<strong>${this.word.value + " "}</strong> Added successfully`,
    "success"
  );

  Array.from(elms('input[type="checkbox"]'))
    .filter((elm) => elm.checked)
    .map((elm) => (elm.checked = false));

  Array.from(elms('#wordFiledset input[type="text"]')).map((elm) =>
    elm.remove()
  );

  this.word.value = this.pronunciation.value = "";
  el("#subWordInputs").innerHTML = "";
  el("#wordInput").focus();

  setCurrentWord(getCurrentWord() + 1);
  subTransInputCount = 0;
  subWordInputCount = 0;
  showTranslate();
}

function handleChangeLangOptions() {
  el("#en-option").onchange = (e) => {
    const faOption = el("#fa-option");
    const headOverlay = el(".head-overlay");
    const bodyOverlay = el(".body-overlay");

    if (e.target.checked) {
      headOverlay.style.opacity = 0;
      bodyOverlay.style.opacity = 1;

      faOption.checked = false;
    } else {
      bodyOverlay.style.opacity = 0;
    }
  };

  el("#fa-option").onchange = (e) => {
    const enOption = el("#en-option");
    const headOverlay = el(".head-overlay");
    const bodyOverlay = el(".body-overlay");

    if (e.target.checked) {
      headOverlay.style.opacity = 1;
      bodyOverlay.style.opacity = 0;

      enOption.checked = false;
    } else {
      headOverlay.style.opacity = 0;
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
