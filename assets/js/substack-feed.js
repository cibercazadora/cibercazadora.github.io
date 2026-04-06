// ─── Substack Feed Loader ─────────────────────────────────
// Uses Substack's native API directly — no third-party proxy.

const SUBSTACK_URL = "https://securitytranslated.substack.com";
const POST_LIMIT   = 6;

(async function loadSubstackFeed() {
  const container = document.getElementById("substack-posts");
  if (!container) return;

  const apiUrl = `${SUBSTACK_URL}/api/v1/posts?limit=${POST_LIMIT}`;

  try {
    const res = await fetch(apiUrl);

    if (!res.ok) throw new Error(`API responded with ${res.status}`);

    const posts = await res.json();

    if (!Array.isArray(posts) || !posts.length) {
      throw new Error("No posts returned.");
    }

    container.innerHTML = "";

    posts.forEach(post => {
      const card = buildCard(post);
      container.appendChild(card);
    });

  } catch (err) {
    console.error("Substack feed error:", err);
    container.innerHTML = `
      <p class="feed-error">
        Couldn't load posts right now.
        <a href="${SUBSTACK_URL}" target="_blank" rel="noopener">Read them on Substack instead →</a>
      </p>
    `;
  }
})();

// ─── Build a single post card ──────────────────────────────
function buildCard(post) {
  const article = document.createElement("article");
  article.className = "blog-post-preview";

  const url     = `${SUBSTACK_URL}/p/${post.slug}`;
  const date    = formatDate(post.post_date);
  const excerpt = post.subtitle || stripHtml(post.body_html || "").slice(0, 160).trim();

  article.innerHTML = `
    <a href="${url}" target="_blank" rel="noopener noreferrer" class="post-preview-link">
      <span class="post-preview-date">${date}</span>
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(excerpt)}${excerpt.length >= 160 ? "…" : ""}</p>
      <span class="read-more">Read more →</span>
    </a>
  `;

  return article;
}

// ─── Helpers ──────────────────────────────────────────────
function stripHtml(html) {
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.textContent || el.innerText || "";
}

function escapeHtml(str) {
  const el = document.createElement("div");
  el.appendChild(document.createTextNode(str));
  return el.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  });
}