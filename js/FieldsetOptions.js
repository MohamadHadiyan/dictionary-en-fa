import FarsiType from "./FarsiType.js";
import {
  arrayElementsTwoObject,
  el,
  getKeys,
  getObjectFromToArray,
  getValues,
  newElm,
  textToArray,
} from "./utils.js";

export const translateInputs = [];

export const getTranslatesWord = () => {
  const elems = arrayElementsTwoObject(translateInputs);
  const values = getValues(elems).map((item) => textToArray(item, "،"));
  const keys = getKeys(elems);
  const translates = getObjectFromToArray(keys, values);

  translateInputs.splice(0);

  return translates;
};

const addInput = (name) => {
  let elm = newElm("input", {
    type: "text",
    className: "formControl translateInput",
    name: name,
    lang: "fa-ir",
  });

  translateInputs.push(elm);
  return elm;
};

const removeInput = (name) => {
  const prevInputs = Object.assign(
    [],
    translateInputs.filter((elm) => elm.name !== name)
  );
  translateInputs.splice(0);
  translateInputs.push(...prevInputs);
};

const handleChangeInput = (e) => {
  if (e.target.checked) {
    const elm = addInput(e.target.name);
    e.target.parentNode.parentNode.append(elm);
    elm.focus();
    FarsiType.init();
  } else {
    e.target.parentNode.parentNode.lastElementChild.remove();
    removeInput(e.target.name);
  }
};

export const addFieldsetOptions = () => {
  const wordFiledset = el("#wordFiledset");
  const wordFieldsetOptions = [
    { id: "noun", title: "Ctrl + Alt + J", text: "(n) noun -- اسم" },
    {
      id: "adjective",
      title: "Ctrl + Alt + K",
      text: "(adj) adjective -- صفت",
    },
    { id: "adverb", title: "Ctrl + Alt + L", text: "(adv) adveb -- قید" },
    {
      id: "transitive-verb",
      title: "Ctrl + Alt + O",
      text: "(vt) transitive verb -- فعل متعدی",
    },
    {
      id: "intransitive-verb",
      title: "Ctrl + Alt + I",
      text: "(vi) intransitive verb -- فعل لازم",
    },
    {
      id: "preposition",
      title: "preposition",
      text: "(prep) preposition -- حرف اضافه",
    },
    {
      id: "conjunction",
      title: "conjunction",
      text: "(conj) conjunction -- حرف ربط",
    },
    { id: "pronoun", title: "pronoun", text: "(pron) pronoun -- ضمیر" },
    {
      id: "past-tens",
      title: "past-tens",
      text: "(p) past tens -- (زمان) گذشته",
    },
    {
      id: "auxiliary-verb",
      title: "auxiliary-verb",
      text: "(aux v) auxiliary verb -- فعل کمکی (معین)",
    },
    {
      id: "past-participle",
      title: "past-participle",
      text: "(pp) past participle -- اسم مفعول",
    },
    { id: "prefix", title: "prefix", text: "prefix -- پیشوند" },
    { id: "suffix", title: "suffix", text: "suffix -- پسوند" },
    {
      id: "interjection",
      title: "interjection",
      text: "interjection -- صوت یا عبارت تعجبی",
    },
    {
      id: "indefinite-article",
      title: "indefinite-article",
      text: "indefinite article -- حرف تعریف",
    },
  ];

  wordFieldsetOptions.map((option) => {
    const checkbox = newElm("input", {
      type: "checkbox",
      id: option.id,
      name: option.id,
    });
    checkbox.onchange = handleChangeInput;
    const div = newElm("div", { className: "fieldset-option" });
    const sign = newElm("div", { className: "sign" });
    const span = newElm("span", { innerHTML: option.text });
    div.append(checkbox, sign, span);
    const elem = newElm("label", { innerHTML: "" });
    elem.htmlFor = option.id;
    elem.title = option.title;
    elem.append(div);

    wordFiledset.append(elem);
  });
};
