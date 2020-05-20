module.exports = {
  extends: ['eslint:recommended', 'prettier'], // extending recommended config and config derived from eslint-config-prettier
  plugins: ['prettier'], // activating esling-plugin-prettier (--fix stuff)
  env: { es6: true, node: true },
  rules: {
    'prettier/prettier': [
      // customizing prettier rules (unfortunately not many of them are customizable)
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
    eqeqeq: ['error', 'always'],
    indent: ['error', 2],
  },
};
