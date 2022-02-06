export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  const children = [...cell.children].filter((e) => !!e.innerHTML);
  cell.textContent = '';
  if (children.length < 4) children.splice(1, 0, document.createElement('p'));
  const [quote, picture, name, title] = children;
  block.innerHTML = '';
  quote.className = 'quote-quote';
  block.append(quote);
  const attr = document.createElement('div');
  attr.className = 'quote-attribution';
  attr.append(picture);
  const div = document.createElement('div');
  div.append(name, title);
  attr.append(div);
  block.append(attr);
}
