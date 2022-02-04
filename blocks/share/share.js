export default function decorate(block) {
  block.querySelectorAll('.icon').forEach((icon) => {
    let href = '';
    if (icon.className.includes('twitter')) {
      href = `http://twitter.com/share?&url=${window.location.href}`;
    }
    if (icon.className.includes('linkedin')) {
      href = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`;
    }
    if (icon.className.includes('facebook')) {
      href = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    }
    if (icon.className.includes('email')) {
      href = `mailto:?subject=${document.title}&body=${window.location.href}`;
    }
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      icon.parentElement.insertBefore(a, icon);
      a.append(icon);
    }
  });
}
