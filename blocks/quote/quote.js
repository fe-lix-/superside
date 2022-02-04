export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  const [quote, picture, name, title] = [...cell.children];
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
