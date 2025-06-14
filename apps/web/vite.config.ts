import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  ssr: {
    noExternal: ["class-variance-authority"],
  },
  server: {
    fs: {
      allow: ["..", "../public"],
    },
  },
  publicDir: path.resolve(__dirname, "../../public"),
});
