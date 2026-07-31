#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime, timezone
from bs4 import BeautifulSoup
BASE="https://castrointelligence.com.br"
ROOT=Path(__file__).resolve().parents[1]
urls=[]
for p in sorted(ROOT.rglob("*.html")):
    rel=p.relative_to(ROOT).as_posix()
    if rel.startswith("portfolio/"):
        continue
    soup=BeautifulSoup(p.read_text(encoding="utf-8"),"html.parser")
    robots=soup.find("meta",attrs={"name":"robots"})
    if robots and "noindex" in robots.get("content","").lower():
        continue
    can=soup.find("link",rel="canonical")
    if not can: continue
    last=datetime.fromtimestamp(p.stat().st_mtime,tz=timezone.utc).date().isoformat()
    urls.append((can.get("href"),last))
xml=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u,last in urls:
    priority="1.0" if u==BASE+"/" else ("0.9" if any(x in u for x in ["consultoria","castro-talk","castro-chat","diagnostico"]) else "0.7")
    xml += ["  <url>",f"    <loc>{u}</loc>",f"    <lastmod>{last}</lastmod>","    <changefreq>monthly</changefreq>",f"    <priority>{priority}</priority>","  </url>"]
xml.append("</urlset>")
(ROOT/"sitemap.xml").write_text("\n".join(xml)+"\n",encoding="utf-8")
print(f"sitemap.xml gerado com {len(urls)} URLs")
