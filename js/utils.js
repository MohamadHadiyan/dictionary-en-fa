export const arrayToObject = (arr) =>
  arr.reduce((obj, elm) => ((obj[elm.name] = elm.value), obj), {});

export async function loadData() {
  let res = await fetch("./words.json");
  return await res.json();
}

export function showAlert(msg, type) {
  let alert = newElm("div", {
    innerHTML: msg,
    className: `alert ${type}`,
  });

  el("body").prepend(alert);
  setTimeout(() => alert.remove(), 3000);
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
