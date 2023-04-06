import { connectPlayground, login, installPlugin } from "@wp-playground/client";

import './style.css'

main();

export async function main() {
  const root = document.getElementById('root');
  const iframe = render(root);

  const client = await connectPlayground(
    iframe,
    "https://playground.wordpress.net/remote.html"
  );

  await client.isReady();

  login(client, 'admin');

  const plugin = await fetchPlugin();
  installPlugin(client, plugin);

  await client.goTo("/wp-admin/");

  const result = await client.run({
    code: '<?php echo "Hi!"; ',
  });

  console.log(new TextDecoder().decode(result.body));
}

async function fetchPlugin() {
  const response = await fetch("/wp-feature-notifications.zip");
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
