import { createOptimizedPicture, readBlockConfig } from '../../scripts/lib-franklin.js';

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

async function addValidationError(el) {
  if (!el.parentNode.querySelector('span.error')) {
    el.insertAdjacentHTML('afterend', '<span class="error">Required</span>');
  }
  el.parentNode.classList.add('error');
}

async function submitForm(form) {
  let isError = false;
  const payload = {};
  [...form.elements].forEach((fe) => {
    if (fe.required && fe.value === '') {
      isError = true;
      addValidationError(fe);
    }
    if (fe.type === 'checkbox') {
      if (fe.checked) payload[fe.id] = fe.value;
    } else if (fe.id) {
      payload[fe.id] = fe.value;
    }
  });

  return isError ? false : payload;
}

function createButton(fd) {
  const button = document.createElement('button');
  button.textContent = fd.Label;
  if (fd.Field === 'submit') {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      button.setAttribute('disabled', '');
      const payload = await submitForm(button.closest('form'));

      if (!payload) {
        button.removeAttribute('disabled');
        return;
      }

      let redirectTo = fd.Extra;
      if (fd.Extra.includes('calendly')) {
        redirectTo = `https://www.superside.com/calendly?calendlyEventType=superside-customer-development&calendlyEventName=call&eventType=call&full_name=${payload.first}%20${payload.last}&email=${payload.email}&a1=${payload.phone}&a2=${payload.company}&companySize=${payload['company-size']}&a4=${payload['company-size']}`;
      }
      window.location.href = redirectTo;
    });
  }
  return button;
}

function createInput(fd) {
  const input = document.createElement('input');
  input.type = fd.Type;
  input.id = fd.Field;
  input.setAttribute('placeholder', fd.Placeholder);

  if (fd.Mandatory === 'x') {
    input.setAttribute('required', '');
  }

  input.addEventListener('change', () => {
    const errorSpan = input.parentNode.querySelector('span.error');
    if (errorSpan) {
      input.parentNode.classList.remove('error');
      errorSpan.remove();
    }
  });

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
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split('.json')[0];
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
  const { form: formUrl, image } = readBlockConfig(block);

  function getContentFor(key) {
    const content = Array.from(block.querySelectorAll('div'))
      .find((el) => el.textContent === key).parentNode.children[1];
    content.classList.add(key.toLowerCase());

    return content;
  }

  const title = getContentFor('Title');
  const subtitle = getContentFor('Subtitle');
  const subtitleForDesktop = subtitle.cloneNode(true);
  subtitleForDesktop.classList.add('desktop');

  const subtitleForMobile = subtitle.cloneNode(true);
  subtitleForMobile.classList.add('mobile');

  block.textContent = '';

  const wrapper = document.createElement('div'); // just for now to reuse previous styling; FIXME
  const left = document.createElement('div');
  const right = document.createElement('div');

  const imageWrapper = createOptimizedPicture(image, '', true);
  const imageForDesktop = imageWrapper.cloneNode(true);
  imageForDesktop.classList.add('desktop');

  const imageForMobile = imageWrapper.cloneNode(true);
  imageForMobile.classList.add('mobile');

  left.append(title);
  left.append(subtitleForDesktop);
  left.append(imageForDesktop);
  wrapper.append(left);

  if (formUrl) {
    const formEl = document.createElement('div');
    right.append(formEl);

    right.classList.add('form-container');
    formEl.replaceWith(await createForm(formUrl));

    wrapper.append(right);
  }
  wrapper.append(subtitleForMobile);
  wrapper.append(imageForMobile);
  block.append(wrapper);
}
