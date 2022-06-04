import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
const { resolve } = require("path");

const getDirectories = (source: string) => {
  const rd = fs.readdirSync(source, { withFileTypes: true });
  return rd.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
};

const alias = getDirectories("./src").map(dir => {
  return {
    find: `@${dir}`,
    replacement: path.resolve(__dirname, `./src/${dir}`),
  };
});

export default defineConfig({
  root: "src/client",
  resolve: { alias },
  base: "/www/dunty/",
  build: {
    outDir: "/www/public/www/dunty",
    emptyOutDir: true,
    // rollupOptions: {
    //   input: {
    //     // client: resolve(__dirname, "src/client/index.ts"),
    //     // mainjs: resolve(__dirname, "src/surface/index.ts"),
    //     // main: resolve(__dirname, "src/surface/index.html"),
    //     // nested: resolve(__dirname, "src/surface/nested/index.html"),
    //     // client: fileURLToPath(new URL("./src/client/index.html", import.meta.url)),
    //     // surface: fileURLToPath(new URL("./src/surface/index.html", import.meta.url)),
    //   },
    // },
  },
});
