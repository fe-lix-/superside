import { readBlockConfig } from '../../scripts/scripts.js';

function decorateBrand(section) {
  // console.log('hi from brand section');
  // console.log('section:', section);
}

function decorateSocial(section) {
  section.querySelectorAll('a').forEach((a) => {
    a.setAttribute('target', '_blank');
  });
}

function decorateCTA(section) {
  console.log('hi from CTA section');
  console.log('section:', section);
}

function styleSection(type, section) {
  switch (type) {
    case 'brand':
      decorateBrand(section);
      break;
    case 'social':
      decorateSocial(section);
      break;
    case 'cta':
      decorateCTA(section);
      break;
    case 'nav':
      break;
    case 'bio':
      break;
    case 'links':
      break;
    default:
      // eslint-disable-next-line no-console
      console.error('Unconfigured section in footer');
      break;
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;
  const sections = ['brand', 'social', 'cta', 'nav', 'bio', 'links'];
  sections.forEach((section, i) => {
    footer.children[i].classList.add(section);
    styleSection(section, footer.children[i]);
  });
  block.append(footer);
}
