function createSelect(fd) {
  const select = document.createElement('select');
  select.id = fd.Field;
  if (fd.Placeholder) {
    const ph = document.createElement('option');
    ph.textContent = fd.Placeholder;
    ph.setAttribute('selected', '');
    ph.setAttribute('disabled', '');
    select.append(ph);
  }
  fd.Options.split(',').forEach((o) => {
    const option = document.createElement('option');
    option.textContent = o.trim();
    option.value = o.trim();
    select.append(option);
  });
  return select;
}

function createButton(fd) {
  const button = document.createElement('button');
  button.textContent = fd.Label;
  return button;
}

function createInput(fd) {
  const input = document.createElement('input');
  input.type = fd.Type;
  input.id = fd.Field;
  input.setAttribute('placeholder', fd.Placeholder);
  return input;
}

function createLabel(fd) {
  const label = document.createElement('label');
  label.setAttribute('for', fd.Field);
  label.textContent = fd.Label;
  return label;
}

async function createForm(formURL) {
  const { pathname } = new URL(formURL);
  const resp = await fetch(pathname);
  const json = await resp.json();
  const form = document.createElement('form');
  json.data.forEach((fd) => {
    fd.Type = fd.Type || 'text';
    const fieldWrapper = document.createElement('div');
    const style = fd.Style ? ` form-${fd.Style}` : '';
    fieldWrapper.className = `form-${fd.Type}-wrapper${style}`;
    switch (fd.Type) {
      case 'select':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createSelect(fd));
        break;
      case 'button':
        fieldWrapper.append(createButton(fd));
        break;
      case 'checkbox':
        fieldWrapper.append(createInput(fd));
        fieldWrapper.append(createLabel(fd));
        break;
      default:
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createInput(fd));
    }
    form.append(fieldWrapper);
  });
  return (form);
}

export default async function decorate(block) {
  const form = block.querySelector('a[href$=".json"]');
  if (form) {
    form.closest('div').classList.add('form-container');
    form.replaceWith(await createForm(form.href));
  }

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
