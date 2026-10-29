#!/usr/bin/env python3
"""Deterministic site gate: local link/asset resolution, id anchors, pessary gate links."""
import re, sys, pathlib
from html.parser import HTMLParser
root = pathlib.Path('.').resolve()
mode = sys.argv[1] if len(sys.argv) > 1 else 'links'
pages = [p for p in root.rglob('*.html') if not any(x in p.parts for x in ('.graph-loop','node_modules','photos for website','in clinic photos'))]
class P(HTMLParser):
    def __init__(s): super().__init__(); s.refs=[]; s.ids=set()
    def handle_starttag(s, t, a):
        a=dict(a)
        if 'id' in a: s.ids.add(a['id'])
        for k in ('href','src','poster'):
            if a.get(k): s.refs.append(a[k])
        if a.get('srcset'):
            s.refs += [x.strip().split()[0] for x in a['srcset'].split(',') if x.strip()]
errs=[]
parsed={}
for p in pages:
    x=P(); x.feed(p.read_text(encoding='utf-8')); parsed[p]=x
if mode=='links':
    for p,x in parsed.items():
        for r in x.refs:
            if re.match(r'(https?:|mailto:|tel:|data:|javascript:|//)', r): continue
            path,_,frag=r.partition('#'); path=path.split('?')[0]
            t = p if not path else (p.parent/path)
            if t.is_dir(): t=t/'index.html'
            if not t.exists(): errs.append(f'{p.relative_to(root)}: missing {r}'); continue
            if frag and t.suffix=='.html' and t in parsed and frag not in parsed[t].ids:
                errs.append(f'{p.relative_to(root)}: missing anchor {r}')
elif mode=='gate':
    for p in pages:
        rel=p.relative_to(root)
        if rel.parts[0]=='pessary': continue
        if not any('pessary/' in r for r in parsed[p].refs): errs.append(f'{rel}: no link to pessary/')
    for need in ('pessary/index.html','pessary/visit.html'):
        if not (root/need).exists(): errs.append(f'missing {need}')
    for p in pages:
        rel=p.relative_to(root)
        if rel.parts[0]=='pessary' and not any(r.startswith('../') and 'index.html' in r or r=='../' for r in parsed[p].refs):
            errs.append(f'{rel}: no link back to Core Connections')
print('\n'.join(errs) if errs else f'OK ({len(pages)} pages)')
sys.exit(1 if errs else 0)
