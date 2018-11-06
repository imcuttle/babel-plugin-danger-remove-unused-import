/**
 * @file main
 * @author Cuttle Cong
 * @date 2018/11/5
 * @description
 */
const nps = require('path')
const fs = require('fs')
const { transform } = require('babel-core')

function fixture(name) {
  return nps.join(__dirname, 'fixture', name)
}

function read(name) {
  return fs.readFileSync(fixture(name), { encoding: 'utf8' })
}

function transformTest(name, opts, { plugins = [], ...rest } = {}) {
  return transform(read(name), {
    plugins: [[require('../src'), opts]].concat(plugins),
    babelrc: false,
    ...rest
  })
}

describe('main', function() {
  describe('unused', () => {
    it('JSX', () => {
      expect(
        transformTest(
          'unused/JSX.js',
          {},
          { presets: [require.resolve('babel-preset-react')] }
        ).code
      ).toMatchSnapshot()
    })

    it('VariableDeclarator', () => {
      expect(
        transformTest('unused/VariableDeclarator.js', {}).code
      ).toMatchSnapshot()
    })

    it('LabeledStatement', () => {
      expect(transformTest('unused/LabeledStatement.js').code).toMatchSnapshot()
    })

    it('ObjectProperty', () => {
      expect(
        transformTest(
          'unused/ObjectProperty.js',
          {},
          { presets: ['babel-preset-stage-0'] }
        ).code
      ).toMatchSnapshot()
    })

    it('MemberExpression', () => {
      expect(transformTest('unused/MemberExpression.js').code)
        .toMatchInlineSnapshot(`
"

const ref = {};
const x = ref.Tab;"
`)
    })

    it('MemberExpression-2', () => {
      expect(transformTest('unused/MemberExpression-2.js').code)
        .toMatchInlineSnapshot(`
"

const ref = {};
const x = ref['Tab'];"
`)
    })

    it('class', function() {
      expect(transformTest('unused/class.js').code).toMatchInlineSnapshot(`
"

class A {
  Tab() {}

  static Tab() {}
}"
`)
    })

    it('multi-import', function() {
      expect(transformTest('unused/multi-import.js').code)
        .toMatchInlineSnapshot(`
"import { a, b } from 'lodash';
import _ from 'lodash';

_.a;
_.b;

const sum = a + b;"
`)
    })
  })

  describe('used', () => {
    it('JSX', function() {
      expect(transformTest('used/JSX.js', {}, { presets: ['react'] }).code)
        .toMatchInlineSnapshot(`
"import Tab from 'tab';

const comp = React.createElement(Tab, null);"
`)
    })

    it('ObjectProperty-computed', function() {
      expect(
        transformTest(
          'used/ObjectProperty-computed.js',
          {},
          { presets: ['babel-preset-stage-0'] }
        ).code
      ).toMatchInlineSnapshot(`
"var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Tab from 'tab';

export const x = _extends({ [Tab]: 'abc' }, { a: '2' });"
`)
    })

    it('class-computed-method', function() {
      expect(
        transformTest(
          'used/class-computed-method.js',
          {},
          { presets: ['babel-preset-stage-0'] }
        ).code
      ).toMatchInlineSnapshot(`
"import Tab from 'tab';

export class A {
  [Tab]() {}
}"
`)
    })

    it('class-static-computed', function() {
      expect(
        transformTest(
          'used/class-static-computed.js',
          {},
          { presets: ['react'] }
        ).code
      ).toMatchInlineSnapshot(`
"import Tab from 'tab';

export class A {
  static [Tab]() {}
}"
`)
    })

    it('MemberExpression', function() {
      expect(transformTest('used/MemberExpression.js').code)
        .toMatchInlineSnapshot(`
"import * as t from './a';

const obj = {
  [t.abc]: () => ({}),
  [t.abcd]: () => ({})
};"
`)
    })

    it('string-template', function() {
      expect(transformTest('used/string-template.js').code)
        .toMatchInlineSnapshot(`
"import * as sty from 'style';

const css = \`
 \${sty} {}
\`;"
`)
    })
  })

  describe('options', () => {
    it('options `ignore = [react]`', function() {
      expect(
        transformTest(
          'options/ignore.js',
          { ignore: ['react'] },
          { presets: ['react'] }
        ).code
      ).toMatchInlineSnapshot(`
"import * as React from 'react';

export default (() => React.createElement(
  'div',
  null,
  'hah'
));"
`)
    })

    it('options `ignore = []`', function() {
      expect(
        transformTest(
          'options/ignore.js',
          { ignore: [] },
          { presets: ['react'] }
        ).code
      ).toMatchInlineSnapshot(`
"

export default (() => React.createElement(
  'div',
  null,
  'hah'
));"
`)
    })
  })
})
