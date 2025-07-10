import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"types": path.resolve(__dirname, "src/types"),
			"components": path.resolve(__dirname, "src/components"),
			"hooks": path.resolve(__dirname, "src/hooks"),
			"pages": path.resolve(__dirname, "src/pages"),
			"api": path.resolve(__dirname, "src/api"),
			"store": path.resolve(__dirname, "src/store"),
			"utils": path.resolve(__dirname, "src/utils"),
			"server": path.resolve(__dirname, "src/server"),
			"reducers": path.resolve(__dirname, "src/reducers")
		},
	},
});
