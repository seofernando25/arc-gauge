import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte({})],
    base: "/arc-gauge/",
    build: {
        // 98.css includes a media query syntax that Lightning CSS rejects.
        // Use esbuild minification to keep vendor CSS untouched and builds stable.
        cssMinify: "esbuild",
    },
    resolve: {
        alias: {
            // src/lib
            $lib: "/src/lib",
        },
    },
});
