// A paragraph holding a single image becomes <figure>, with the alt text as its caption.
export default function rehypeFigure() {
  const isBlank = (n) => n.type === 'text' && !n.value.trim();

  const visit = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === 'element' && child.tagName === 'p') {
        const kids = child.children.filter((n) => !isBlank(n));
        const img = kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'img' ? kids[0] : null;
        if (img) {
          const alt = img.properties?.alt;
          const caption = alt ? [{ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: String(alt) }] }] : [];
          return { type: 'element', tagName: 'figure', properties: {}, children: [img, ...caption] };
        }
      }
      visit(child);
      return child;
    });
  };

  return (tree) => visit(tree);
}
