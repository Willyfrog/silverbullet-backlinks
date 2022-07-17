
import {getCurrentPage, hideLhs, showLhs, navigate} from "@silverbulletmd/plugos-silverbullet-syscall/editor";
import * as clientStore from "@silverbulletmd/plugos-silverbullet-syscall/clientStore"
import {css} from "./css";
import { queryPrefix } from "@silverbulletmd/plugos-silverbullet-syscall";

const BackLinksKey = "showBacklinks"

export async function toggleBacklinks() {
  const showingBacklinks = (await getBacklinkStatus());
  await clientStore.set(BackLinksKey, !showingBacklinks);
  if (!showingBacklinks) {
    const name = await getCurrentPage(); 
    await showBacklinks(name);
  } else {
    await hideLhs()
  }
}

// if something changes, redraw
export async function updateBacklinks() {
  const name = await getCurrentPage();
  await showBacklinks(name);
}

// use internal navigation via syscall to prevent reloading the full page.
export async function navigateTo(page:string) {
  if (page.length === 0) {
    console.log('no page name supplied, ignoring navigation');
    return;
  }
  console.log(`navigating to ${page}`);
  await navigate(page, 0); // todo: do we have the position for it?
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
async function showBacklinks(page) {
  if (await getBacklinkStatus()) {
    const linksResult = await getBacklinks(page);
    // TODO: do a better no links found page.
    const content = linksResult.length === 0 ? "No links found" : formatResults(linksResult);
    await showLhs(
      `<html><head>${css}</head><body>
        <h2>Backlinks to ${page}</h2>
        <ul>
        ${content}
        </ul>
        </body></html>`,
      iframeSrc,
      1
    );
  }
}

// Use store to figure out if backlinks are open or closed.
async function getBacklinkStatus():Promise<boolean> {
  return !!(await clientStore.get(BackLinksKey));
}

// Query for backlinks for a page
async function getBacklinks(name) {
  const allBackLinksInfo = await queryPrefix(`pl:${name}:`);
  const allBackLinks = allBackLinksInfo.map(({page}) => page);
  return allBackLinks;
}

function formatResults(list: string[]):string {
  const linkList = list.map((page) => `<li data-page="${page}"><-<span class="wiki-link">[[</span>${page}<span class="wiki-link">]]</span></li>`);
  return linkList.join('');
}