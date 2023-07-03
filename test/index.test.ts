import pluginTester from 'babel-plugin-tester'
import path from 'path'
import plugin from '../src'

pluginTester({
  plugin,
  babelOptions: { parserOpts: { plugins: ['jsx'] } },
  snapshot: true,
  pluginName: 'babel-plugin-react-auto-unique-id',
  tests: [
    {
      title: 'Class Component',
      fixture: path.join(__dirname, '__fixtures__', 'classComponent.tsx'),
    },
    {
      title: 'Functional Component',
      fixture: path.join(__dirname, '__fixtures__', 'functionComponent.tsx'),
    },
    {
      title: 'Arrow Function Component',
      fixture: path.join(__dirname, '__fixtures__', 'arrowFunction.tsx'),
    },

    {
      title: 'Property exists',
      fixture: path.join(__dirname, '__fixtures__', 'propertyExists.tsx'),
    },
    {
      title: 'Same Siblings',
      fixture: path.join(__dirname, '__fixtures__', 'sameSiblings.tsx'),
    },
  ],
})
