export default function decorate(block) {
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const pictures = [...cell.querySelectorAll('picture')];
    if (pictures.length === 2) {
      const mobileSources = [...pictures[1].querySelectorAll('source[media="(min-width: 400px)"]')];
      const desktopSources = [...pictures[0].querySelectorAll('source[media="(min-width: 400px)"]')];
      mobileSources.forEach((source, i) => {
        desktopSources[i].setAttribute('media', '(min-width: 600px)');
        source.replaceWith(desktopSources[i]);
      });
      cell.append(pictures[1].cloneNode(true));
      pictures[1].remove();
      pictures[0].remove();
    }
  });
}
