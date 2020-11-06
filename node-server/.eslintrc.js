module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true
  },
  extends: ['airbnb-base', 'plugin:node/recommended', 'prettier'], // must be last for it to override other configs
  parserOptions: {
    ecmaVersion: 12
  },
  // Ignore specific files and directories
  ignorePatterns: ['.eslintrc.js'],
  rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
    // add your custom rules and overrides for node files here
    'prefer-object-spread': 0,
    'camelcase': 0,

    // Possible Errors
    // https://github.com/eslint/eslint/tree/master/docs/rules#possible-errors
    'comma-dangle': [1, 'only-multiline'],
    'no-control-regex': 1,
    'no-debugger': 1,
    'no-dupe-args': 1,
    'no-dupe-keys': 1,
    'no-duplicate-case': 1,
    'no-empty-character-class': 1,
    'no-ex-assign': 1,
    'no-extra-boolean-cast': 1,
    'no-extra-parens': [1, 'functions'],
    'no-extra-semi': 1,
    'no-func-assign': 1,
    'no-invalid-regexp': 1,
    'no-irregular-whitespace': 1,
    'no-obj-calls': 1,
    'no-proto': 1,
    'no-template-curly-in-string': 1,
    'no-unexpected-multiline': 1,
    'no-unreachable': 1,
    'no-unsafe-negation': 1,
    'use-isnan': 1,
    'valid-typeof': 1,

    // Best Practices
    // https://github.com/eslint/eslint/tree/master/docs/rules#best-practices
    'no-global-assign': 1,
    'no-multi-spaces': 1,
    'no-octal': 1,
    'no-redeclare': 1,
    'no-self-assign': 1,
    'no-unused-labels': 1,
    'no-useless-call': 1,
    'no-useless-escape': 1,
    'no-void': 1,
    'no-with': 1,

    // Variables
    // http://eslint.org/docs/rules/#variables
    'no-delete-var': 1,
    'no-undef': 1,
    'no-unused-vars': [1, { args: 'none' }],

    // this can be removed once the following is fixed
    // https://github.com/mysticatea/eslint-plugin-node/issues/77
    'node/no-unpublished-require': 'off'
  })
};
