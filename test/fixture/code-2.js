import Message from '@befe/erp-comps/v2/components/Message/index'
import { extendObservable } from "mobx"
import * as t from 'utils/tools'

/**
 * @file: validate
 * @author: Cuttle Cong
 * @date: 2018/2/5
 * @description:
 */
import { symbol } from '../extendProps'


export default function (Model) {
  return class errorProps extends Model {
    unvalidate() {
      let propNames = Model[symbol]
      const state = {}
      propNames.forEach(name => {
        if (this.hasOwnProperty(name)) {
          state[name + 'Props'] = {}
        }
      })
      this.assign(state)
    }
    validate(options = {}) {
      const errors = super.validate
        ? super.validate.apply(this, arguments)
        : []
      const state = {}
      errors.forEach(({ key }) => {
        if (this[`${key}Props`]) {
          state[`${key}Props`] = { status: 'error' }
        }
      })
      // reset
      this.unvalidate()

      this.assign(state)
      return errors
    }
  }
}
