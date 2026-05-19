module.exports = {
  // 一行最多 100 字符
  printWidth: 100,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: false,
  // 使用单引号
  singleQuote: true,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // 换行符使用 lf 结尾是 \n \r \n\r auto
  endOfLine: 'auto',
  // 不格式化vue、JavaScript文件，vue、JavaScript文件、的格式化单独设置
  disableLanguages: ['vue', 'javascript'],
  eslintIntegration: true,
  // 忽略'>'下落问题
  htmlWhitespaceSensitivity: 'ignore',
  // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
  ignorePath: '.prettierignore',
  // 在jsx中把'>' 是否单独放一行
  jsxBracketSameLine: false,
  jsxSingleQuote: false,
  // Require a 'prettierconfig' to format prettier
  requireConfig: false,
  // 不让prettier使用stylelint的代码格式进行校验
  stylelintIntegration: false,
  // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  trailingComma: 'none',
  // 不让prettier使用tslint的代码格式进行校验
  tslintIntegration: false,
  camelcase: 'off',
  '@typescript-eslint/camelcase': 0,
}
