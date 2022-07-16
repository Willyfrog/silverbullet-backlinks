
import {hideLhs, showLhs} from "@silverbulletmd/plugos-silverbullet-syscall/editor";
import * as clientStore from "@silverbulletmd/plugos-silverbullet-syscall/clientStore"
import {css} from "./css";

const BackLinksKey = "showBacklinks"

export async function toggleBacklinks() {
  const showingBacklinks = (await getBacklinkStatus());
  await clientStore.set(BackLinksKey, !showingBacklinks);
  if (!showingBacklinks) {
    await showBacklinks("<li>some backlinks</li>");
  } else {
    await hideLhs()
  }
}

export async function updateBacklinks() {
  await showBacklinks("<li>more backlinks</li>");
}

async function showBacklinks(content) {
  if (await getBacklinkStatus()) {
    await showLhs(
      `<html><head>${css}</head><body>
        <h2>Backlinks to this page</h2>
        <ul>
        ${content}
        </ul>
        </body></html>`,
      undefined,
      1
    );
  }
}

async function getBacklinkStatus() {
  return !!(await clientStore.get(BackLinksKey));
}