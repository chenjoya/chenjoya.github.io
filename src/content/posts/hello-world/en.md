---
title: Hello, World — what this blog can do
subtitle: A sample post for checking typography. It will be replaced by your first real post at launch.
date: 2026-10-03
tags: [meta, typography]
draft: true
---

> This is a **sample post** for previewing typography only. To publish, drop a Markdown file into `src/content/posts/` — title, date, table of contents, reading time, math and code highlighting are generated automatically. Every post can ship in both English and Chinese.

## Why write a blog

Papers are optimized for reviewers; blog posts can be optimized for readers. A paper has to be rigorous and complete, while a blog can keep what never made it into the paper: failed attempts, half-formed intuitions, and how an idea slowly took shape.[^sidenote]

Mixed Chinese–English text such as 流式视频理解 (streaming video understanding) is spaced automatically, and details like hanging punctuation and widow control are handled by the stylesheet.

## Math

Write inline math like $\mathcal{O}(T)$ or $x_t \in \mathbb{R}^d$, and wrap display math in double dollar signs. For example, the simplest online update in test-time training:

$$
W_t = W_{t-1} - \eta \, \nabla_{W}\, \ell\big(W_{t-1};\, x_t\big)
$$

and the familiar attention:

$$
\operatorname{Attn}(Q, K, V) = \operatorname{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d}}\right) V
$$

## Code

Code blocks are highlighted by language and come with a copy button:

```python
import torch


@torch.no_grad()
def stream(model, frames, fps: int = 2):
    """Feed frames one at a time and let the model decide when to speak."""
    cache = None
    for t, frame in enumerate(frames):
        out, cache = model.step(frame, past_key_values=cache)
        if out.should_respond:
            yield t / fps, out.text
```

## Figures and captions

The caption under an image comes from its Markdown alt text — no HTML needed:

![VideoLLM-online narrating and chatting over a live video stream (figure from the paper).](./videollm-online.webp)

## Tables

| Setting | Input | When to respond |
| --- | --- | --- |
| Offline | The whole video | After watching everything |
| Streaming | Frames arrive one by one | Decides while watching |
| Full-duplex | Audio-visual streams | Can be interrupted, can reply any time |

## Lists, footnotes and quotes

- Ordered and unordered lists, `inline code`, **bold** and *italic*;
- Footnotes are numbered automatically[^footnote] and sit in the margin on wide screens;
- Dark mode, RSS and syntax highlighting work out of the box.

> The best way to have a good idea is to have a lot of ideas.
> — Linus Pauling

[^sidenote]: This is a sidenote. On wide screens it sits to the right of the text; on narrow screens, tap the superscript to expand it.
[^footnote]: Footnotes use GitHub syntax: write `[^name]` in the text and define it at the end.
