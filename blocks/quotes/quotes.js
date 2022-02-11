export default function decorate(block) {
  const navButtons = document.createElement('div');
  navButtons.className = 'quotes-buttons';
  const carousel = document.createElement('div');
  carousel.className = 'quotes-carousel';
  [...block.children].forEach((row, i) => {
    const sections = ['quote', 'source', 'picture'];
    sections.forEach((e, j) => {
      row.children[j].classList.add(`quotes-${e}`);
    });
    carousel.append(row);
    const button = document.createElement('div');
    if (!i) button.classList.add('selected');
    button.addEventListener('click', () => {
      carousel.scrollTo({ top: 0, left: row.offsetLeft - row.parentNode.offsetLeft, behavior: 'smooth' });
      [...navButtons.children].forEach((r) => r.classList.remove('selected'));
      button.classList.add('selected');
    });
    navButtons.append(button);
  });
  block.append(carousel);
  block.append(navButtons);
  if (block.classList.contains('highlight')) block.parentNode.classList.add('highlight');
}
