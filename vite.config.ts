import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte({})],
    base: "/arc-gauge/",
    resolve: {
        alias: {
            // src/lib
            $lib: "/src/lib",
        },
    },
});
