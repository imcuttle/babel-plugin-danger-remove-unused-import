/**
 * @file: getSpecImport
 * @author: Cuttle Cong
 * @date: 2017/11/29
 * @description: 
 *  check Identifier `id` is in {} or []
 *    `[id]`
 *    `{id}`
 */

const t = require('babel-core').types;

/**
 * get identifiers from the code, as follows
 *
 *  input:  `import { b, c } from 'a'`
 *  output: ['b', 'c']
 *
 *  input:  `import a from 'a'`
 *  output: ['a']
 */
function pureObjectHandle(path) {

}

/**
 * input: `import a, {b, c as d} from 'where'`
 * output: [a, b, d]
 *
 * input: `import 'where'`
 * output: undefined
 */
function getSpecImport(path, opts = {}) {
  const { withNode = false } = opts
  const { source, specifiers } = path.node;

  if (t.isImportDeclaration(path)) {
    if (t.isStringLiteral(source)) {
      if (specifiers && specifiers.length > 0) {
        return getSpecifierIdentifiers(specifiers, withNode);
      }
    }
  }
}

module.exports = getSpecImport;