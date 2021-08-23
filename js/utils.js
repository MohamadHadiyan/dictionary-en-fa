export const getValues = (arr) => {
  return Object.values(arr);
};

export const getKeys = (arr) => {
  return Object.keys(arr);
};

export const getEntries = (arr) => {
  return Object.entries(arr);
};

export const isEnglishLang = (str) => {
  const reg = /^[a-zA-Z]+$/;
  return reg.test(str);
};

export const isRTL = (str) => {
  var ltrChars =
      "A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF" +
      "\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF",
    rtlChars = "\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC",
    rtlDirCheck = new RegExp("^[^" + ltrChars + "]*[" + rtlChars + "]");

  return rtlDirCheck.test(str);
};

export const isArray = (arr) => {
  return arr instanceof Array;
};

export const isString = (str) => {
  return typeof str === "string";
};

export const textToArray = (str, spliter=",") =>
  str
    .split(spliter)
    .map((item) => item.trim())
    .filter((item) => item);

export const arrayElementsTwoObject = (arr) =>
  arr.reduce(
    (obj, elm) => ((obj[elm.name] = elm.value), obj),
    {}
  );

export const getObjectFromToArray = (arr1, arr2) =>
  arr1.reduce((obj, val, i) => ((obj[val] = arr2[i]), obj), {});

export const arrayToKeyValueObject = (arr) =>
  arr.reduce(
    (obj, val, i) =>
      i % 2 === 0 ? {...obj,  [arr[i]]: arr[i + 1] } : {...obj},
    {}
  );

export const objectTOArray = (obj) => {
  const sub = Object.values(obj);
  return sub.reduce(
    (obj, val, i) =>
      i % 2 === 0 ? [...obj, { [sub[i]]: sub[i + 1] }] : [...obj],
    []
  );
};

export async function loadData(url) {
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}

export function showAlert(msg, type) {
  let alert = newElm("div", {
    innerHTML: msg,
    className: `alert ${type}`,
  });

  el("body").prepend(alert);
  const dur = type === "warning" ? 3000 : 1000;
  setTimeout(() => alert.remove(), dur);
}

export function el(name) {
  if (typeof name === "string") {
    return document.querySelector(name);
  }
}

export function elms(name) {
  if (typeof name === "string") {
    return document.querySelectorAll(name);
  }
}

export function newElm(
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

export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
