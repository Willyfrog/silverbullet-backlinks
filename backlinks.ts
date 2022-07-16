
import {hideRhs, showRhs} from "@silverbulletmd/plugos-silverbullet-syscall/editor";
import * as clientStore from "@silverbulletmd/plugos-silverbullet-syscall/clientStore"

const BackLinksKey = "showBacklinks"

export async function toggleBacklinks() {
  let showingBacklinks = !!(await clientStore.get(BackLinksKey));
  await clientStore.set(BackLinksKey, !showingBacklinks);
  if (!showingBacklinks) {
    await showRhs(
      `<html><head></head><body>some backlinks</body></html>`,
      undefined,
      2
    );
  } else {
    await hideRhs()
  }
}

export async function updateBacklinks() {
  await showRhs(
    `<html><head></head><body>more backlinks</body></html>`,
    undefined,
    2
  );
}