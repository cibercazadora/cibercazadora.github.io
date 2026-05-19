"""
.github/scripts/fetch_posts.py

Fetches the Security Translated RSS feed and writes posts.json
to the repo root. Called by the GitHub Actions workflow.

Uses RSS (not the Substack API) because RSS is a public standard
that doesn't require auth or allowlisted hosts.
"""

import json
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import URLError

FEED_URL    = "https://securitytranslated.substack.com/feed"
OUTPUT_FILE = "posts.json"
POST_LIMIT  = 6

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; GitHub Actions feed fetcher; "
        "+https://github.com/cibercazadora/cibercazadora.github.io)"
    ),
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
}

# RSS namespace used by Substack for full content
CONTENT_NS = "http://purl.org/rss/1.0/modules/content/"


def fetch_feed(url: str) -> str:
    req = Request(url, headers=HEADERS)
    try:
        with urlopen(req, timeout=15) as resp:
            return resp.read().decode("utf-8")
    except URLError as e:
        print(f"ERROR: Could not fetch feed — {e}", file=sys.stderr)
        sys.exit(1)


def strip_html(html: str) -> str:
    """Remove HTML tags and decode common entities."""
    text = re.sub(r"<[^>]+>", "", html or "")
    text = re.sub(r"&amp;",  "&", text)
    text = re.sub(r"&lt;",   "<", text)
    text = re.sub(r"&gt;",   ">", text)
    text = re.sub(r"&nbsp;", " ", text)
    text = re.sub(r"&#\d+;", "",  text)
    return re.sub(r"\s+", " ", text).strip()


def truncate(text: str, max_chars: int = 200) -> str:
    if len(text) <= max_chars:
        return text
    cut = text[:max_chars].rsplit(" ", 1)[0]
    return cut.rstrip(".,;:") + "…"


def fmt_date(raw: str) -> str:
    """Convert RSS pubDate to 'May 14, 2026' format."""
    for fmt in (
        "%a, %d %b %Y %H:%M:%S %z",
        "%a, %d %b %Y %H:%M:%S %Z",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%d",
    ):
        try:
            return datetime.strptime(raw.strip(), fmt).strftime("%B %d, %Y")
        except ValueError:
            continue
    return raw.strip()


def slug_from_url(url: str) -> str:
    """Extract slug from a Substack post URL."""
    match = re.search(r"/p/([^/?#]+)", url)
    return match.group(1) if match else ""


def parse_feed(xml_text: str) -> list[dict]:
    root = ET.fromstring(xml_text)
    channel = root.find("channel")
    if channel is None:
        print("ERROR: No <channel> found in feed", file=sys.stderr)
        sys.exit(1)

    posts = []
    for item in channel.findall("item")[:POST_LIMIT]:
        title   = item.findtext("title", "").strip()
        url     = item.findtext("link",  "").strip()
        pub     = item.findtext("pubDate", "").strip()
        desc    = item.findtext("description", "")

        # Substack puts a plain-text excerpt in <description>
        # and the full HTML in <content:encoded>
        excerpt = strip_html(desc)

        posts.append({
            "title":   title,
            "url":     url,
            "slug":    slug_from_url(url),
            "date":    fmt_date(pub) if pub else "",
            "excerpt": truncate(excerpt),
        })

    return posts


def main():
    print(f"Fetching {FEED_URL} …")
    xml_text = fetch_feed(FEED_URL)

    posts = parse_feed(xml_text)
    if not posts:
        print("WARNING: Feed parsed but returned 0 posts.", file=sys.stderr)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print(f"Done — wrote {len(posts)} posts to {OUTPUT_FILE}")
    for p in posts:
        print(f"  • {p['date']}  {p['title']}")


if __name__ == "__main__":
    main()