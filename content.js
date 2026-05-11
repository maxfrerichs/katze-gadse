const replacements = [
  [/Katzen/g,  "Gadsen"],
  [/katzen/g,  "gadsen"],
  [/KATZEN/g,  "GADSEN"],

  [/Katzes/g,  "Gadses"],
  [/katzes/g,  "gadses"],

  [/Katze/g,   "Gadse"],
  [/katze/g,   "gadse"],
  [/KATZE/g,   "GADSE"],

  [/KATER/g,   "GADSER"],
  [/Kater/g,   "Gadser"],
  [/kater/g,   "gadser"],
];

function replaceInText(text) {
  let result = text;
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function walkAndReplace(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const original = node.nodeValue;
    const replaced = replaceInText(original);
    if (replaced !== original) {
      node.nodeValue = replaced;
    }
    return;
  }

  const tag = node.nodeName.toUpperCase();
  if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "INPUT" || tag === "LINK") {
    return;
  }

  for (const child of node.childNodes) {
    walkAndReplace(child);
  }
}
walkAndReplace(document.head);
walkAndReplace(document.body);

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      walkAndReplace(node);
    }
    if (mutation.type === "characterData") {
      const n = mutation.target;
      const replaced = replaceInText(n.nodeValue);
      if (replaced !== n.nodeValue) {
        n.nodeValue = replaced;
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});
