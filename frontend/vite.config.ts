import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  // Set base to "/IdeaDelta/" for GitHub Pages deployment.
  // This ensures that built asset paths resolve correctly when served from
  // https://<username>.github.io/IdeaDelta/.
  //
  // If you rename the repository or deploy to a custom domain / a
  // <username>.github.io root repository, update this base path accordingly:
  // - Use "/" for a .github.io root repository or custom domain
  // - Use "/<repo-name>/" for project repositories
  base: "/IdeaDelta/",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
