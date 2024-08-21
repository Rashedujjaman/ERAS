//import globals from "globals";
//import pluginJs from "@eslint/js";
//import tseslint from "typescript-eslint";


//export default [
//  {files: ["**/*.{js,mjs,cjs,ts}"]},
//  {files: ["**/*.js"], languageOptions: {sourceType: "script"}},
//  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
//  pluginJs.configs.recommended,
//  ...tseslint.configs.recommended,
//];

import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";

const jsConfig = pluginJs.configs.recommended;
const tsConfig = tseslint.configs.recommended;

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      ...jsConfig.rules,
      ...tsConfig.rules,
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "script",
    },
    rules: {
      ...jsConfig.rules,
      ...tsConfig.rules,
    },
  },
];
