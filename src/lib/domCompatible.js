/*
 * @Description: 封装浏览器兼容性写法
 * @version: 
 * @Author: lxw
 * @Date: 2020-01-17 16:45:37
 * @LastEditors  : lxw
 * @LastEditTime : 2020-01-18 01:14:50
 */


/**
 * $lxw -- 命名空间 封装浏览器兼容方法，各自方法调用最终封装在一个对象，通过自调用函数返回给常量$lxw 
 * @kind namespace
 * @example
 * // 查找dom元素
 * $lxw.queryEle('#idname')
 * // dom节点绑定事件
 * $lxw.addDomEvent(eleObj,eventName,handler)
 * // dom节点删除事件
 * $lxw.removerEventHadler(eleObj,eventName,handler)
 * // 获取innerText兼容方法
 * $lxw.getInnerText()
 * // 设置innerText兼容写法
 * $lxw.setInnerText(eleObj,content)
 * // 获取标签属性兼容性方法
 * $lxw.getAtr(eleObj,atrName)
 * //设置标签属性兼容写法
 * $lxw.setAtr(eleObj,atrName,content)
 * // 删除标签属性兼容性写法
 * $lxw.removeAttribute(eleObj,atrName,content)
 */
const $lxw = (function () {

    // 根据id获取dom节点兼容写法--考虑到ie8以下存在一个bug--参考：MDN
    /**
     * 根据id、class、标签获取dom
     * @param  {string} nodeString - .class名 | #id名 | 标签名称
     */
    function getEle(nodeString) {
        // 正则表达式对象
        const regs = {
            id: /^#+/,
            class: /^\.+/,
            //TODO:可继续扩展
        }
        // 与正则表达式对象相互映射的处理函数对象
        const funs = {
            id: function getById(nStr) {
                // 调用对应的模块，暂时写在这里，感觉比独立出来写方便一些
                let ele = document.querySelector(nStr) || document.getElementById(nStr)
                // getElementById在ie8以下浏览器存在的一个bug
                if (isIE()) {
                    let eles = document.all[nStr]
                    let len = eles.length
                    for (let i = 0; i < len; i++) {
                        if (eles[i].id === nStr) {
                            return eles[i]
                        }

                    }
                } else {
                    return ele
                }
            },
            //TODO:可继续扩展
        }

        // 判断当前查询dom元素的字符串是id还是class还是元素
        for (const key in regs) {
            if (regs.hasOwnProperty(key)) {
                const element = regs[key];
                if (element.test(nodeString)) {
                    return funs[key](nodeString)
                }
            }
        }
    }

    // 判断是狗是ie浏览器
    function isIE() { //ie?
        if (!!window.ActiveXObject || "ActiveXObject" in window) { return true; }
        else { return false; }
    }


    //dom节点绑定事件兼容方法
    
    /**
     * @param  {HTMLElement} eleObj - dom节点对象
     * @param  {string} eventName - 事件名称
     * @param  {function} handler - 事件处理程序
     */
    function addEleEvent(eleObj, eventName, handler) {
        if (eleObj.addEventListener) { // chrome、ff、ie111
            eleObj.addEventListener(eventName, handler, false)
        } else {
            eleObj.attachEvent('on' + eventName, function () {
                handler.call(obj) // 在ie7、8、9、10下，this指向window，使用call使得this指向当前dom对象
            })
        }
    }

    // dom节点移除事件函数兼容方法
     /**
     * @param  {HTMLElement} eleObj - dom节点对象
     * @param  {string} eventName - 事件名称
     * @param  {function} handler - 事件处理程序
     */
    function removeHandler(eleObj, eventName, handler) {
        if (eleObj.removeEventListener) {
            eleObj.removeEventListener(eventName, handler, false)
        } else {
            eleObj.detachEvent('on' + eventName, function () {
                fn.call(eleObj)
            })
        }
    }

    // innerText兼容性写法
    
    /**
     * @param  {HTMLElement} eleObj - dom节点对象
     */
    function getInnerText(eleObj) {
        return (typeof eleObj.textContent === 'string') ? eleObj.textContent : eleObj.innerText
    }
    /**
     * @param  {HTMLElement} eleObj - dom节点对象
     *  @param {string} text - 赋值innerText的内容
     */
    function setInnerText(eleObj, text) {
        if (typeof eleObj.textContent === 'string') {
            eleObj.textContent = text
        } else {
            eleObj.innerText = text
        }
    }

    // 动态获取、设置、删除标签元素的属性的 兼容性写法——支持对象调用和不支持对象调用
    // 支持自定义属性，ie可以通过对象属性语法，chrome、firfox等需要通过getAttribute等方法
    // 特殊属性的处理：class的获取、设置和删除：ie6，7，8:如果使用setAttribute('class',xx)，那么通过obj.calssName无法正确获取
    
    /**
     * @param  {HTMLElement} eleObj
     * @param  {string} atrName
     */
    function getAtr(eleObj, atrName) {
        let value = /^class(Name)?/.test(atrName) ? eleObj['className'] : eleObj[atrName] || eleObj.getAttribute(atrName)
        return value
    }
    /**
     * @param  {HTMLElement} eleObj
     * @param  {string} atrName
     * @param  {string} content
     */
    function setAtr(eleObj, atrName, content) {
        if (eleObj[atrName]) {
            if (/^class(Name)?/.test(atrName)) {
                eleObj['className'] = content
            } else {
                eleObj[atrName] = content
            }
        } else {
            eleObj.setAttribute(atrName, content)
        }
    }
    /**
     * @param  {HTMLElement} eleObj
     * @param  {string} atrName
     */
    function removerAtr(eleObj, atrName) {
        if (eleObj.removeAttribute) {
            if (/^class(Name)?/.test(atrName)) {
                eleObj.removeAttribute('className')
            } else {
                eleObj.removeAttribute(atrName)
            }

        } else {
            console.log('error,该浏览器不支持removeAttribute方法')
        }
    }

    // 封装进对象里面，导出对象模块

    const domCompatible = {
        //获取dom元素
        queryEle(nString) {
            return getEle(nString)
        },
        addDomEvent(eleObj, eventName, handler) {
            addEleEvent(eleObj, eventName, handler)
        },
        removerEventHadler(eleObj, eventName, handler) {
            removeHandler(eleObj, eventName, handler)
        },
        getInnerText(eleObj) {
            return getInnerText(eleObj)
        },
        setInnerText(eleObj, text) {
            setInnerText(eleObj, text)
        },
        getAtr(eleObj, atrName) {
            return getAtr(eleObj, atrName)
        },
        setAtr(eleObj, atrName, content) {
            setAtr(eleObj, atrName, content)
        },
        removerAtr(eleObj, atrName) {
            removerAtr(eleObj, atrName)
        }
    }

    // 返回模块--对象类型
    return domCompatible
})()
