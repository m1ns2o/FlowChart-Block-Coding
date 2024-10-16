module.exports = {
    root: true,
    env: {
      node: true
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended'
    ],
    parserOptions: {
      parser: '@babel/eslint-parser'
    },
    rules: {
      // 여기에 커스텀 규칙을 추가할 수 있습니다
    }
  }