import { AppUiProvider } from "@canva/app-ui-kit";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import "@canva/app-ui-kit/styles.css";

const convex = new ConvexReactClient("https://famous-chipmunk-425.convex.cloud");
const root = createRoot(document.getElementById("root")!);
function render() {
  root.render(
    <ConvexProvider client={convex}>
      <AppUiProvider>
        <App />
      </AppUiProvider>
    </ConvexProvider>
  );
}

render();

if (module.hot) {
  module.hot.accept("./app", render);
}
