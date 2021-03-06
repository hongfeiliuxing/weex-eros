/**
* @Author: songqi
* @Date:   2017-02-27
* @Last modified by:   songqi
* @Last modified time: 2017-04-10
*/

import _isArray from 'lodash/isArray'
import { distribute } from 'Utils/message'

var events = weex.requireModule('bmEvents'),
    globalEvent = weex.requireModule('globalEvent')

const GlobalEvent = Object.create(null)
const GLOBALEVENT = Object.create(null)

// 消息推送
globalEvent.addEventListener("pushMessage", function(options) {
    distribute(options, GLOBALEVENT)
})

// app 被放到后台
globalEvent.addEventListener("appWillResignActive", function(options) {
    _isArray(GLOBALEVENT['appDeActive']) && GLOBALEVENT['appDeActive'].map((item) => {
        item(options)
    })
})

// app 从后台唤起
globalEvent.addEventListener("appDidBecomeActive", function(options) {
    _isArray(GLOBALEVENT['appActive']) && GLOBALEVENT['appActive'].map((item) => {
        item(options)
    })
})

GlobalEvent.install = (Vue, options) => {
    Vue.mixin({
        beforeCreate() {
            if(this.$options.bmGlobalEvent){
                var ev = this.$options.bmGlobalEvent
                for(var i in ev){
                    if(!GLOBALEVENT[i]){
                        GLOBALEVENT[i] = []
                    }
                    GLOBALEVENT[i].push(ev[i].bind(this))
                }
            }
        }
    })
    Vue.prototype.$bus = events
}

Vue.use(GlobalEvent)
