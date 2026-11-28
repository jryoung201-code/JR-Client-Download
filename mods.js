
'use strict';
const AUTO_PAY_WARNING = 'This mod automatically pays RealJR_25736 all your in-game money when you join DonutSMP. Installing it enables automatic payments. Your balance may be reduced to a small remainder after tax and rounding.';
const list = document.getElementById('mod-list');
const status = document.getElementById('catalog-status');
const dialog = document.getElementById('download-warning');
const confirmButton = document.getElementById('confirm-download');
let pending = null;
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function downloadUrl(value) {
  const url = new URL(value, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.endsWith('.jar')) throw new Error('Invalid mod download');
  return url.href;
}
function download(mod) {
  const anchor = element('a');
  anchor.href = downloadUrl(mod.downloadUrl);
  anchor.download = new URL(anchor.href).pathname.split('/').pop();
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}
function requestDownload(mod) {
  if (mod.autoPay !== false) {
    pending = mod;
    document.getElementById('warning-mod-name').textContent = mod.name;
    dialog.showModal();
  } else download(mod);
}
confirmButton.addEventListener('click', () => {
  if (!pending) return;
  const mod = pending;
  pending = null;
  dialog.close();
  download(mod);
});
document.getElementById('cancel-download').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { pending = null; });
function render(mod) {
  const card = element('article', 'mod-card');
  const details = element('div', 'mod-details');
  const meta = element('p', 'mod-meta', mod.loader + ' / Minecraft ' + mod.minecraftVersion);
  details.append(meta, element('h3', '', mod.name), element('p', 'description', mod.description));
  if (mod.autoPay !== false) {
    const warning = element('div', 'warning');
    warning.append(element('strong', '', 'Automatic payments'), element('p', '', AUTO_PAY_WARNING));
    details.append(warning);
  }
  const side = element('div', 'mod-download');
  side.append(element('span', 'version', 'Version ' + mod.version));
  const button = element('button', 'primary', 'Download mod');
  button.type = 'button';
  button.addEventListener('click', () => requestDownload(mod));
  side.append(button);
  const requirements = element('ul', 'requirements');
  (mod.requirements || []).forEach(text => requirements.append(element('li', '', text)));
  side.append(requirements);
  card.append(details, side);
  return card;
}
async function loadCatalog() {
  status.textContent = 'Loading mods…';
  try {
    const response = await fetch('./mods.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Catalog unavailable');
    const catalog = await response.json();
    if (!Array.isArray(catalog.mods)) throw new Error('Invalid catalog');
    const mods = await Promise.all(catalog.mods.map(async entry => {
      let mod = { ...entry };
      if (mod.updateManifest) {
        try {
          const manifestUrl = new URL(mod.updateManifest, window.location.href);
          if (manifestUrl.origin !== window.location.origin) throw new Error('Invalid manifest');
          const response = await fetch(manifestUrl, { cache: 'no-store' });
          if (!response.ok) throw new Error('Release unavailable');
          const release = await response.json();
          if (!/^\d+\.\d+\.\d+$/.test(release.latestVersion)) throw new Error('Invalid version');
          downloadUrl(release.downloadUrl);
          mod = { ...mod, version: release.latestVersion, downloadUrl: release.downloadUrl, minecraftVersion: release.minecraftVersion };
        } catch (error) { console.error('Using catalog release', error); }
      }
      downloadUrl(mod.downloadUrl);
      return mod;
    }));
    list.replaceChildren(...mods.map(render));
    status.textContent = mods.length ? '' : 'No mods have been posted yet.';
  } catch (error) {
    status.textContent = 'The mod list could not be loaded. Reload the page to try again.';
    console.error(error);
  }
}
loadCatalog();
