import js from '@eslint/js'
import globals from 'globals'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import prettierConfig from 'eslint-config-prettier'

void js

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: ['dist'],
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node
      },
      sourceType: 'module'
    },
    plugins: {
      react: reactRecommended.plugins.react
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off'
    }
  },
  prettierConfig
]
