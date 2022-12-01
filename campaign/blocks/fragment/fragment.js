/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-disable import/named, import/extensions */

import {
  decorateMain,
// eslint-disable-next-line import/no-unresolved
} from '../../scripts/scripts.js';

import { loadBlocks } from '../../scripts/lib-franklin.js';

async function decorateFragment($block) {
  const ref = $block.textContent;
  const path = new URL(ref).pathname.split('.')[0];
  const resp = await fetch(`${path}.plain.html`);
  const html = await resp.text();
  const $main = document.createElement('main');
  $main.innerHTML = html;
  const img = $main.querySelector('img');
  img.setAttribute('loading', 'lazy');
  decorateMain($main);
  await loadBlocks($main);
  const sections = [...$main.children];
  const $section = $block.closest('.section');
  sections.forEach((section, i) => {
    if (!i) {
      while (sections[0].firstChild) {
        $section.insertBefore(sections[0].firstChild, $block.closest('.fragment-wrapper'));
      }
    } else {
      $section.insertBefore(section, $section.nextElementSibling);
    }
  });
  $block.remove();
}

export default async function decorate($block) {
  await decorateFragment($block);
}
