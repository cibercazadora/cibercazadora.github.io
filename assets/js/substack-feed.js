// ─── Substack Feed Loader ─────────────────────────────────
// Fetches latest posts from Security Translated and renders
// them into the #substack-posts container in the Writing section.

const SUBSTACK_URL = "https://securitytranslated.substack.com";
const POST_LIMIT   = 6;

(async function loadSubstackFeed() {
  const container = document.getElementById("substack-posts");
  if (!container) return;

  const rssUrl = `${SUBSTACK_URL}/feed`;
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=${POST_LIMIT}`;

  try {
    const res  = await fetch(apiUrl);
    const data = await res.json();

    if (data.status !== "ok" || !data.items?.length) {
      throw new Error("No posts returned.");
    }

    container.innerHTML = "";

    data.items.forEach(post => {
      const article = document.createElement("article");
      article.className = "blog-post-preview";

      const date = formatDate(post.pubDate);
      const excerpt = stripHtml(post.description || post.content || "").slice(0, 160).trim();

      article.innerHTML = `
        <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="post-preview-link">
          <span class="post-preview-date">${date}</span>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(excerpt)}${excerpt.length >= 160 ? "…" : ""}</p>
          <span class="read-more">Read more →</span>
        </a>
      `;

      container.appendChild(article);
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