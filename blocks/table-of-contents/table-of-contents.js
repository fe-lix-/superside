export default function decorate(block) {
  let below = false;
  const sticky = document.createElement('div');
  sticky.className = 'table-of-contents-sticky';
  const highlightObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        sticky.querySelectorAll('a').forEach((a) => a.classList.remove('selected'));
        const { id } = entry.target.querySelector('h2');
        const selected = sticky.querySelector(`a[href="#${id}"]`);
        if (selected) selected.classList.add('selected');
      }
    });
  });
  document.querySelectorAll('main h2').forEach((h2) => {
    if (below) {
      const title = h2.textContent;
      const teaser = h2.closest('.section').querySelector('.teaser');
      if (teaser) {
        const eyebrow = h2.previousElementSibling.textContent;
        const hash = h2.id;
        const card = document.createElement('a');
        card.className = 'table-of-contents-card';
        card.href = `#${hash}`;
        card.innerHTML = `<p class="table-of-contents-eyebrow">${eyebrow}</p>
        <h3>${title}</h3>
        <p class="table-of-contents-teaser">${teaser.textContent}</p>`;
        block.append(card);
        sticky.append(card.cloneNode(true));
        highlightObs.observe(h2.closest('.section'));
      }
    } else if (h2.closest('.section') === block.closest('.section')) {
      below = true;
    }
  });

  block.append(sticky);

  const obs = new IntersectionObserver((entries) => {
    if (entries.some((entry) => (!entry.isIntersecting && entry.boundingClientRect.top))) {
      sticky.classList.remove('hidden');
    } else {
      sticky.classList.add('hidden');
    }
  });
  obs.observe(block);
}
