import { AppUiProvider } from "@canva/app-ui-kit";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import "@canva/app-ui-kit/styles.css";

const convexUrl = process.env.CONVEX_URL;
if (convexUrl === undefined) {
  throw new Error("Convex URL not specified");
}
const convex = new ConvexReactClient(convexUrl);
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
