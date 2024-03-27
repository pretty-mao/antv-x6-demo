import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [
    createVuePlugin(),
    basicSsl({
      /** name of certification */
      name: "test",
      /** custom trust domains */
      domains: ["*.custom.com"],
      /** custom certification directory */
      certDir: "./node_modules/.vite/ssl",
    }),
  ],
  server: {
    host: "0.0.0.0",
    https: true,
    port: 8080,
  },
});
