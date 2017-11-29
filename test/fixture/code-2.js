/**
 * @file react mobx 的初始化文件
 * @author Liang
 */

import React from 'react'
import {render} from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import {useStrict} from 'mobx'
import AppCreator from './AppCreator'
import {isDevMode} from 'utils/consts'
import {detectBrowser} from '@befe/utils/lib/browser'
import i18n from '@befe/utils/i18n/easy-i18n'
import urlUtils from 'utils/url-utils'
import {setLocale as setErpCompsLocale, injectLocaleMap as injectErpCompsLocaleMap} from '@befe/erp-comps/v2'
import {errorRoutes} from 'frontend/Error/routes'

export {isDevMode} from 'utils/consts'

// todo: 临时处理，prod环境下使用非严格模式
if (isDevMode) {
  useStrict(true)
}
else {
  useStrict(false)
}

let counter = 0

function renderApp(routes, appState) {
  if (routes.childRoutes && typeof routes.childRoutes.concat === 'function') {
    routes.childRoutes = routes.childRoutes.concat(errorRoutes)
  }
  const MainApp = AppCreator(routes)
  counter++
  render(
    h(AppContainer, {},
    ),
    document.getElementById('root')
  )
}

// @todo 优化，做到html中，先检测再加载js并启动
function checkBrowser() {
  const browser = window.BROWSER = detectBrowser()
  let isSupported = true
  document.body.setAttribute('browser-type', browser.name)
  document.body.setAttribute('browser-version', browser.version)

  if (!browser.name) {
    isSupported = false
    // @todo 引导提示
  }

  return isSupported
}

function initLocale() {
  const lang = i18n.getLang().lang
  // erp-comps-v2 全局locale
  setErpCompsLocale(lang)
  // setErpCompsLocale('tw')
  // injectErpCompsLocaleMap({
  //     tw: {
  //         Modal: {
  //             okText: 'tw确定'
  //         }
  //     }
  // })
  if (['candidate', 'approval-mobile'].indexOf(COMPONENT_KEY) === -1) {
    // document.title = {
    //     'zh-CN': 'Offer 入职系统',
    //     'en-US': 'Baidu Onboarding System'
    // }[lang] || 'Offer入职系统'
    document.title = _i('offer_system_name')
  }
}

export default {
  initApp(routes, appState) {
    initLocale()

    if (isDevMode) {
      // for debug
      global.app = appState.app
    }
    if (checkBrowser())  {
      renderApp(routes, appState)
    }
  }
}
