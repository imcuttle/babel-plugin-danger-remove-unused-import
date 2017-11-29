function match (rule, value) {
  if (typeof rule === 'string') {
    return rule === value
  }
  if (rule instanceof RegExp) {
    return rule.test(value)
  }
  if (typeof rule === 'function') {
    return rule(value)
  }
  if (Array.isArray(rule)) {
    return rule.some(r => match(r, value))
  }
}

module.exports = match