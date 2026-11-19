#!/usr/bin/env python3
"""Generate audit scorecard chart + compute weighted overall rating."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# Tier scores assigned from audit evidence (see report body for justification)
tiers = [
    ("Tier 1 - Crawlability & Indexation", 8.0),
    ("Tier 2 - Technical Foundations", 4.0),
    ("Tier 3 - On-Page Optimization", 2.5),
    ("Tier 4 - Content Quality", 3.0),
    ("Tier 5 - Authority & Local Signals", 6.0),
]
weights = {"Tier 1": 0.15, "Tier 2": 0.20, "Tier 3": 0.30, "Tier 4": 0.25, "Tier 5": 0.10}

# Weighted overall
overall = 0.0
for name, score in tiers:
    w_key = name.split(" - ")[0]
    overall += score * weights[w_key]
print(f"Weighted overall score: {overall:.2f} -> rounded rating: {round(overall)}/10")

# Horizontal bar chart
labels = [t[0] for t in tiers][::-1]
scores = [t[1] for t in tiers][::-1]
ACCENT = "#529286"   # DS-1 accent
BAD = "#B87472"      # Morandi red for weak tiers
colors = [BAD if s < 4 else ACCENT for s in scores]

fig, ax = plt.subplots(figsize=(10, 5.2), constrained_layout=True)
bars = ax.barh(labels, scores, color=colors, height=0.55)
for bar, s in zip(bars, scores):
    ax.text(bar.get_width() + 0.12, bar.get_y() + bar.get_height() / 2,
            f"{s:.1f}", va="center", fontsize=11, color="#182030")
ax.axvline(overall, color="#28201C", linestyle="--", linewidth=1.4)
ax.text(overall + 0.1, 4.42, f"Weighted overall: {overall:.1f}/10", fontsize=11,
        color="#28201C", fontweight="bold")
ax.set_xlim(0, 10)
ax.set_xlabel("Score (0-10)", fontsize=11)
ax.set_title("SEO audit scorecard by tier - trulytoursnamibia.com", fontsize=13, fontweight="bold")
ax.grid(True, axis="x", alpha=0.3)
ax.set_axisbelow(True)
ax.spines[["top", "right"]].set_visible(False)
ax.tick_params(axis="y", labelsize=10.5)
plt.savefig("/home/z/my-project/audit_data/scorecard.png", dpi=200)
print("saved scorecard.png")
