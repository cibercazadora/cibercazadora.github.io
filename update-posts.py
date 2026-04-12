import requests
import json
from datetime import datetime

headers = {"User-Agent": "Mozilla/5.0"}

res = requests.get(
    "https://securitytranslated.substack.com/api/v1/posts?limit=8",
    headers=headers
)
res.raise_for_status()

posts = []
for post in res.json():
    date = post.get("post_date", "")[:10]
    try:
        date = datetime.strptime(date, "%Y-%m-%d").strftime("%B %d, %Y")
    except Exception:
        pass
    posts.append({
        "title":   post.get("title", ""),
        "url":     "https://securitytranslated.substack.com/p/" + post.get("slug", ""),
        "date":    date,
        "excerpt": post.get("subtitle", ""),
    })

with open("posts.json", "w") as f:
    json.dump(posts, f, indent=2)

print(f"Done — wrote {len(posts)} posts to posts.json")