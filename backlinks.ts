import { asset } from "$sb/plugos-syscall/mod.ts";
import { clientStore, editor, index } from "$sb/silverbullet-syscall/mod.ts";
import { showPanel } from "https://deno.land/x/silverbullet@0.1.2/plug-api/silverbullet-syscall/editor.ts";

const BackLinksKey = "showBacklinks";

export async function toggleBacklinks() {
  const showingBacklinks = (await getBacklinkStatus());
  await clientStore.set(BackLinksKey, !showingBacklinks);
  if (!showingBacklinks) {
    const name = await editor.getCurrentPage();
    await showBacklinks(name);
  } else {
    await editor.hidePanel("lhs");
  }
}

// if something changes, redraw
export async function updateBacklinks() {
  const name = await editor.getCurrentPage();
  await showBacklinks(name);
}

// use internal navigation via syscall to prevent reloading the full page.
export async function navigateTo(pageRef: string) {
  if (pageRef.length === 0) {
    console.log("no page name supplied, ignoring navigation");
    return;
  }
  const [page, pos] = pageRef.split("@");
  console.log(`navigating to ${pageRef}`);
  await editor.navigate(page, +pos); // todo: do we have the position for it?
}

// code to run within the iframe
const iframeSrc = `
  function processClick(e) {
    let pageName = e.currentTarget.getAttribute('data-page');
    if (!pageName) {
      console.log('no page value for:');
      console.log(e);
      pageName = '';
    }
    removeListeners();
    // send an event so the navigation happens internally preventing a full page reload
    sendEvent('backlink:navigateTo', pageName);
  }

  function getLinks() {
    return Array.from(document.getElementsByTagName('li'));
  }
  // remove listeners once we are done
  function removeListeners() {
    const links = getLinks();
    links.forEach((item) => item.removeEventListener('click', processClick));
  }

  // make li tags clickable
  const linkList = getLinks();
  linkList.forEach((item) => item.addEventListener('click', processClick));
`;

// render function into the LHS
async function showBacklinks(page: string) {
  if (await getBacklinkStatus()) {
    const linksResult = await getBacklinks(page);
    const css = await asset.readAsset("style.css");
    // TODO: do a better no links found page.
    const content = linksResult.length === 0
      ? "No links found"
      : formatResults(linksResult);
    await showPanel(
      "lhs",
      0.5,
      `<html><head><style>${css}</style></head><body>
        <h2>Backlinks</h2>
        <ul>
        ${content}
        </ul>
        </body></html>`,
      iframeSrc,
    );
  }
}

// Use store to figure out if backlinks are open or closed.
async function getBacklinkStatus(): Promise<boolean> {
  return !!(await clientStore.get(BackLinksKey));
}

// Query for backlinks for a page
async function getBacklinks(name: string) {
  const allBackLinksInfo = await index.queryPrefix(`pl:${name}:`);
  const allBackLinks = allBackLinksInfo.map(({ page, key }) => {
    const [, , pos] = key.split(":"); // Key: pl:page:pos
    return `${page}@${pos}`;
  });
  return allBackLinks;
}

function formatResults(list: string[]): string {
  const linkList = list.map((page) =>
    `<li data-page="${page}">🖇️&nbsp;<span class="wiki-link">[[</span><span class="wiki-link-page">${page}</span><span class="wiki-link">]]</span></li>`
  );
  return linkList.join("");
}
