import * as esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

const config = {
	entryPoints: ["src/index.ts"],
	bundle: true,
	platform: "node",
	target: "node16",
	outdir: "build",
	sourcemap: true,
	plugins: [nodeExternalsPlugin()],
	loader: {
		".ts": "ts",
	},
	resolveExtensions: [".ts", ".js", ".json"],
};

const run = async () => {
	if (process.argv.includes("--dev")) {
		const ctx = await esbuild.context(config);
		await ctx.watch();
		console.log("Watching for changes...");
	} else {
		await esbuild.build(config);
		console.log("Build complete");
	}
};

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
