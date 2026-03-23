async function load(id, file) {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
}

async function init() {
  await load("header", "/components/header.html");
  await load("nav", "/components/nav.html");
  await load("footer", "/components/footer.html");
}

init();
