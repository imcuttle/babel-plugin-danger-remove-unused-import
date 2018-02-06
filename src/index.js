/**
 * @file: index
 * @author: Cuttle Cong
 * @date: 2017/11/29
 * @description:
 */
const getSpecImport = require('./utils/getSpecImport');
const {name: symbol} = require('../package.json')

function warn(...args) {
  console.warn.apply(console, [`${symbol} Warn: \n    `].concat(args))
}
function log(...args) {
  console.log.apply(console, [`${symbol} Log: \n    `].concat(args))
}

const idTraverseObject = {
  JSXIdentifier(path, {runtimeData}) {
    const { parentPath } = path
    const { name } = path.node

    if (
      parentPath.isJSXOpeningElement() && parentPath.get('name') === path
      || parentPath.isJSXMemberExpression() && parentPath.get('object') === path
    ) {
      if (runtimeData[name]) {
        delete runtimeData[name]
      }
    }
  },
  Identifier(path, {runtimeData}) {
    const { parentPath } = path
    const { name } = path.node
    // const ID = 'value';
    if (parentPath.isVariableDeclarator() && parentPath.get('id') === path) {}
    // { Tabs: 'value' }
    else if (parentPath.isLabeledStatement() && parentPath.get('label') === path) {}
    // ref.ID
    else if (
      parentPath.isMemberExpression()
      && parentPath.get('property') === path
      && parentPath.node.computed === false
    ) {}
    // class A { ID() {} }
    else if (
      (parentPath.isClassProperty() || parentPath.isClassMethod())
      && parentPath.get('key') === path
    ) {}
    else {
      // used
      if (runtimeData[name]) {
        delete runtimeData[name]
      }
    }
  }
}

const importTraverseObject = {
  ImportDeclaration(path, data) {
    const { opts = {}, runtimeData } = data

    const locals = getSpecImport(path, { withPath: true, ignore: opts.ignore });
    if (locals) {
      locals.forEach((pathData, index, all) => {
        const {name} = pathData
        // already existed
        if (runtimeData[name]) {
          warn('the declare of ', `\`${name}\``, 'is already existed')
          return
        }
        runtimeData[name] = {
          parent: path,
          children: all,
          data: pathData
        }
      })

      path.skip()
    }
  },
  ...idTraverseObject
}

function handleRemovePath(runtimeData, opts = {}) {
  const { verbose = false } = opts
  /*
   {
   parent: path,
   children: [ { path, name } ],
   data: { path, name }
   }
   */
  const allNames = Object.keys(runtimeData)
  verbose && log('unused-import-list', allNames)
  allNames.forEach(name => {
    const {children, data, parent} = runtimeData[name]
    const childNames = children.map(x => x.name)
    // every imported identifier is unused
    if (childNames.every(cName => allNames.includes(cName))) {
      !parent.__removed && parent.remove();
      parent.__removed = true
    }
    else {
      const path = data.path
      !path.__removed && path.remove();
      path.__removed = true
    }
  })

}

module.exports = function (babel) {
  return {
    pre(path) {
      this.runtimeData = {}
    },
    visitor: {
      Program(path, data) {
        path.traverse(importTraverseObject, {
          opts: data.opts,
          runtimeData: this.runtimeData
        });
        handleRemovePath(this.runtimeData, data.opts)
      }
    },
    post() {
      delete this.runtimeData
    }
  };
};

// expose internals for use in other plugins
module.exports.importTraverseObject = importTraverseObject;
module.exports.handleRemovePath = handleRemovePath;