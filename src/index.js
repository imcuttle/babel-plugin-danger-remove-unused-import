/**
 * @file: index
 * @author: Cuttle Cong
 * @date: 2017/11/29
 * @description:
 */
const match = require('./utils/matchRule')

module.exports = function(babel) {
  const t = babel.types
  return {
    visitor: {
      Program: {
        enter: (path, { opts } = {}) => {
          for (const [name, binding] of Object.entries(path.scope.bindings)) {
            if (binding.kind === 'module') {
              if (!binding.referenced) {
                const source = binding.path.parentPath.get('source')
                if (
                  t.isStringLiteral(source) &&
                  (!opts.ignore || !match(opts.ignore, source.node.value))
                ) {
                  if (binding.path.node.type === 'ImportSpecifier') {
                    binding.path.remove()
                  } else if (binding.path.parentPath) {
                    binding.path.parentPath.remove()
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
