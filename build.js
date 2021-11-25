const { build } = require("esbuild");
const { dependencies, peerDependencies } = require("./package.json");

const opts = {
  entryPoints: ["src/useTransition.ts"],
  bundle: true,
  sourcemap: true,
  external: Object.keys(peerDependencies),
};

build({
  ...opts,
  format: "cjs",
  outfile: "dist/useTransition.cjs.js",
});

build({
  ...opts,
  format: "esm",
  outdir: "dist",
  splitting: true,
});
