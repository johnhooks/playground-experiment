import {
  startPlaygroundWeb,
  installPlugin,
  login,
} from "@wp-playground/client";

import "./style.css";

export async function main() {
  const root = document.getElementById("root");
  const iframe = render(root);
  const response = await fetch(
    "/playground-experiment/wp-feature-notifications.zip"
  );
  const blob = await response.blob();
  const pluginZipFile = new File([blob], "wp-feature-notifications.zip");

  const playground = await startPlaygroundWeb({
    iframe,
    remoteUrl: "https://playground.wordpress.net/remote.html",
    blueprint: {
      landingPage: "/wp-admin/",
      preferredVersions: {
        php: "8.0",
        wp: "latest",
      },
      steps: [
        { step: "login", username: "admin", password: "password" },
        {
          step: "setSiteOptions",
          options: {
            WPLANG: "en",
            permalink_structure: "/%postname%/",
            gp_enable_local_translation: 1,
            gp_enable_inline_translation: 1,
          },
        },
        {
          step: "updateUserMeta",
          meta: {
            show_welcome_panel: "0",
          },
          userId: 1,
        },
        {
          step: "installPlugin",
          pluginZipFile,
        },
      ],
    },
  });
}

/**
 *
 * @param {HTMLElement} el
 */
function render(el) {
  const iframe = document.createElement("iframe");
  iframe.title = "Playground Viewport";
  iframe.className = "playground__viewport--full-size";
  el.appendChild(iframe);
  return iframe;
}
