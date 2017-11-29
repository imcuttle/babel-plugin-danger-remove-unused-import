/**
 * @file: index
 * @author: Cuttle Cong
 * @date: 2017/11/29
 * @description:
 */
const getSpecImport = require('./utils/getSpecImport');
const matchRule = require('./utils/matchRule');
const {name: symbol} = require('../package.json')

function warn(...args) {
  console.warn.apply(console, [`${symbol} Warn...\n`].concat(args))
}

module.exports = function (babel) {
  return {
    pre(path) {
      this.runtimeData = {}
    },
    visitor: {
      ImportDeclaration(path, data) {
        data.opts.ignores = []
        const locals = getSpecImport(path, { withPath: true, ignore: data.opts.ignore });
        if (locals) {
          locals.forEach((pathData, index, all) => {
            const {name} = pathData
            // already existed
            if (this.runtimeData[name]) {
              warn('the declare of ', `\`${name}\``, 'is already existed')
              return
            }

            this.runtimeData[name] = {
              parent: path,
              children: all,
              data: pathData
            }
          })

          path.skip()
        }
      },

      Identifier(path, data) {
        const { parentPath } = path
        const { name } = path.node
        // const ID = 'value';
        if (parentPath.isVariableDeclarator() && parentPath.get('id') === path) {

        }
        // { Tabs: 'value' }
        else if (parentPath.isLabeledStatement() && parentPath.get('label') === path) {
        }
        // ref.ID
        else if (parentPath.isMemberExpression() && parentPath.get('property') === path) {

        }
        // class A { ID() {} }
        else if (
          (parentPath.isClassProperty() || parentPath.isClassMethod())
          && parentPath.get('key') === path
        ) {

        }
        else {
          // used
          if (this.runtimeData[name]) {
            delete this.runtimeData[name]
          }
        }
      }

    },
    post(path) {
      /*
       {
         parent: path,
         children: [ { path, name } ],
         data: { path, name }
       }
       */
      const allNames = Object.keys(this.runtimeData)
      // warn(allNames)
      allNames.forEach(name => {
        const {children, data, parent} = this.runtimeData[name]
        const childNames = children.map(x => x.name)
        // every imported identifier is unused
        if (childNames.every(cName => allNames.includes(cName))) {
          parent.__removed = true
          !parent.__removed && parent.remove()
        }
        else {
          data.path.__removed = true
          !data.path.__removed && data.path.remove();
        }
      })

      delete this.runtimeData
    }
  };
};