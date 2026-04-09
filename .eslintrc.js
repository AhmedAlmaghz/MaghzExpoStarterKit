/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ['expo'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'no-unused-vars': 'warn',
        'no-console': 'warn',
    },
    ignorePatterns: ['dist/', 'node_modules/', '.expo/'],
};