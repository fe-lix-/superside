export default function decorate(block) {
  const rowClasses = ['person', 'bio'];
  const personClasses = ['photo', 'title', 'logo'];
  const rows = [...block.children];
  rows.forEach((row, i) => row.classList.add(`person-${rowClasses[i]}`));
  const personCols = [...block.querySelector('.person-person').children];
  personCols.forEach((col, i) => col.classList.add(`person-${personClasses[i]}`));
}
