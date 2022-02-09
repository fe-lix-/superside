export default function decorate(block) {
  if (!(block.children.length % 2)) {
    block.classList.add('works-even');
  }
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    cols[0].classList.add('works-image');
    cols[1].classList.add('works-description');
  });

  let scrolling = false;

  block.querySelectorAll('img').forEach((img) => {
    img.setAttribute('loading', '');
  });

  block.parentElement.addEventListener('click', (e) => {
    if (!scrolling) {
      scrolling = true;
      const left = ((e.clientX - e.currentTarget.offsetLeft) / e.currentTarget.clientWidth) < 0.5;
      if (!left) {
        block.append(block.firstElementChild);
        block.classList.add('works-toright');
      } else {
        block.prepend(block.lastElementChild);
        block.classList.add('works-toleft');
      }
      setTimeout(() => {
        scrolling = false;
        block.classList.remove('works-toleft', 'works-toright');
      }, 300);
    }
  });
}
