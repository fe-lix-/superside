import { decorateIcons, readBlockConfig } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || `${window.hlx.codeBasePath}/footer`;
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;
  decorateIcons(footer);
  const sections = ['social', 'links'];
  sections.forEach((section, i) => {
    footer.children[i].classList.add(section);
  });
  block.append(footer);
}
