import {
  startPlaygroundWeb,
  installPlugin,
  login,
} from "@wp-playground/client";

import './style.css';

export async function main() {
  const root = document.getElementById("root");
  const iframe = render(root);

  const playground = await startPlaygroundWeb({
    iframe,
    remoteUrl: "https://playground.wordpress.net/remote.html",
  });

  await playground.isReady();

  await login(playground, { username: "admin", password: "password" });

  const pluginZipFile = await fetchPlugin();

  await installPlugin(playground, { pluginZipFile, activate: true });

  await playground.goTo("/wp-admin");
}

async function fetchPlugin() {
  const response = await fetch("/playground-experiment/wp-feature-notifications.zip");
  const blob = await response.blob();
  const file = new File([blob], "wp-feature-notifications.zip");
  return file;
}

/**
 *
 * @param {HTMLElement} el
 */
function render(el) {
  const iframe = document.createElement('iframe');
  iframe.title = "Playground Viewport";
  iframe.className = "playground__viewport--full-size";
  el.appendChild(iframe);
  return iframe;
}
