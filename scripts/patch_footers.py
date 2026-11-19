#!/usr/bin/env python3
"""Post-process footers: explicit PAGE format switches + strip empty pgNumType."""
import re, shutil, zipfile, os

SRC = "/home/z/my-project/download/SEO_Audit_Report_Truly_Tours_Namibia.docx"
TMP = "/tmp/docx_patch"

if os.path.exists(TMP):
    shutil.rmtree(TMP)
os.makedirs(TMP)
with zipfile.ZipFile(SRC) as z:
    z.extractall(TMP)

# 1. Remove empty pgNumType (cover section)
doc_path = os.path.join(TMP, "word", "document.xml")
with open(doc_path, encoding="utf-8") as f:
    doc = f.read()
n_removed = len(re.findall(r"<w:pgNumType/>", doc))
doc = doc.replace("<w:pgNumType/>", "")
with open(doc_path, "w", encoding="utf-8") as f:
    f.write(doc)
print(f"document.xml: removed {n_removed} empty <w:pgNumType/>")

# 2. Patch footer PAGE fields. Roman footer marked by color 888888, arabic by 808080.
for fn in sorted(os.listdir(os.path.join(TMP, "word"))):
    if not fn.startswith("footer"):
        continue
    p = os.path.join(TMP, "word", fn)
    with open(p, encoding="utf-8") as f:
        xml = f.read()
    if "PAGE" not in xml:
        continue
    if "888888" in xml:
        fmt = r"PAGE \\* ROMAN \\* MERGEFORMAT"
        kind = "ROMAN"
    else:
        fmt = r"PAGE \\* arabic \\* MERGEFORMAT"
        kind = "arabic"
    new_xml, n = re.subn(
        r"(<w:instrText[^>]*>)\s*PAGE\s*(</w:instrText>)",
        rf"\1 {fmt} \2",
        xml,
    )
    with open(p, "w", encoding="utf-8") as f:
        f.write(new_xml)
    print(f"{fn}: patched {n} PAGE field(s) -> {kind}")

# 3. Repack
out = SRC
tmp_zip = "/tmp/docx_patch_out.docx"
if os.path.exists(tmp_zip):
    os.remove(tmp_zip)
zf = zipfile.ZipFile(tmp_zip, "w", zipfile.ZIP_DEFLATED)
for root, dirs, files in os.walk(TMP):
    for f in files:
        full = os.path.join(root, f)
        rel = os.path.relpath(full, TMP)
        zf.write(full, rel)
zf.close()
shutil.move(tmp_zip, out)
print("Repacked:", out, os.path.getsize(out), "bytes")
