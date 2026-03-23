async function load(id, file) {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
}
function filterPosts(category) {
  const posts = document.querySelectorAll(".post-item");

  posts.forEach(post => {
    const categories = post.dataset.category;

    if (category === "all" || categories.includes(category)) {
      post.style.display = "block";
    } else {
      post.style.display = "none";
    }
  });
}

async function init() {
  await load("header", "/components/header.html");
  await load("nav", "/components/nav.html");
  await load("footer", "/components/footer.html");
}

init();
