export default async function decorate(block) {
  block.querySelectorAll('a[href^="https://fast.wistia.net/"]').forEach((wistia) => {
    const { href } = wistia;
    wistia.classList.add('hidden');
    const observer = new IntersectionObserver((events) => {
      if (events.some((e) => e.isIntersecting)) {
        const iframe = document.createElement('iframe');
        iframe.src = href;
        iframe.classList.add('embed-wistia');
        wistia.replaceWith(iframe);
        observer.disconnect();
      }
    });
    observer.observe(block);
  });

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const pictures = [...cell.querySelectorAll('picture')];
      if (pictures.length > 2) {
        cell.textContent = '';
        cell.className = 'columns-carousel';
        cell.append(...pictures);
        let scrollCounter = 0;
        setInterval(() => {
          scrollCounter += 1;
          scrollCounter %= pictures.length;
          cell.scrollTo({ top: 0, left: pictures[scrollCounter].offsetLeft, behavior: 'smooth' });
        }, 4000);
      }
    });
  });
}
