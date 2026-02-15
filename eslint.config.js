/**
 * @fileoverview ESLint configuration for Expo React Native project.
 * Extends the default Expo ESLint configuration with custom rules.
 * 
 * @see {@link https://docs.expo.dev/guides/using-eslint/ Expo ESLint Guide}
 */

const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
