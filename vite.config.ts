import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import { tamaguiPlugin, tamaguiExtractPlugin } from "@tamagui/vite-plugin";

const tamaguiConfig = {
  config: "./tamagui.config.ts",
  components: ["tamagui"],
  useReactNativeWebLite: true,
};

// https://vitejs.dev/config/
export default defineConfig({
  // TODO: This doesn't seem to work from within the Tamagui Vite Plugin
  ssr: {
    noExternal: ["@tamagui/*", "tamagui"],
  },
  plugins: [
    react(),

    tamaguiPlugin(tamaguiConfig),
    tamaguiExtractPlugin(tamaguiConfig),
  ],
});
