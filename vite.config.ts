import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

console.log(`right`);
console.log(path.resolve(__dirname, "./src/"));

export default defineConfig({
  root: "src/client",
  // plugins: [tsconfigPaths()],
  resolve: { alias: [
    { find: "@debug", replacement: path.resolve(__dirname, "./src/debug") },
    { find: "@game", replacement: path.resolve(__dirname, "./src/game") },
    { find: "@sdk", replacement: path.resolve(__dirname, "./src/sdk") },
    { find: "@sdk-pixi", replacement: path.resolve(__dirname, "./src/sdk-pixi") },
  ] },
  // resolve: { alias: [{ find: /@(.+)/ig, replacement: path.resolve(__dirname, "./src/$1") }] },
});
