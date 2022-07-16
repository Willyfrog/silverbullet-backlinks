
import {getCurrentPage, hideLhs, showLhs} from "@silverbulletmd/plugos-silverbullet-syscall/editor";
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

export async function updateBacklinks() {
  const name = await getCurrentPage();
  await showBacklinks(name);
}

async function showBacklinks(page) {
  if (await getBacklinkStatus()) {
    const linksResult = await getBacklinks(page);
    const content = linksResult.length === 0 ? "No links found" : formatResults(linksResult);
    await showLhs(
      `<html><head>${css}</head><body>
        <h2>Backlinks to ${page}</h2>
        <ul>
        ${content}
        </ul>
        </body></html>`,
      undefined,
      1
    );
  }
}

async function getBacklinkStatus():Promise<boolean> {
  return !!(await clientStore.get(BackLinksKey));
}

async function getBacklinks(name) {
  const allBackLinksInfo = await queryPrefix(`pl:${name}:`);
  const allBackLinks = allBackLinksInfo.map(({page}) => page);
  return allBackLinks;
}

function formatResults(list: string[]):string {
  const linkList = list.map((page) => `<li><-<span class="wiki-link">[[</span><a href=${page}>${page}</a><span class="wiki-link">]]</span></li>`);
  return linkList.join('');
}