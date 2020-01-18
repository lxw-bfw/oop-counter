/*
 * @Description: 简易计时器开发——js面向对象:开始、停止、重新开始（从当前的初始值重新开始）、设置开始值、设置结束值
 * @version: 
 * @Author: lxw
 * @Date: 2019-12-31 14:02:37
 * @LastEditors  : lxw
 * @LastEditTime : 2020-01-18 01:46:18
 */


 
/**
 * Counter，计数器构造函数，用于创建一个计数器实例
 * @constructor
 * @param  {Object} opt - 构造函数参数，计数器配置参数，属于Objec类型
 * @param {number} opt.startNum - 计数起始值
 * @param {number} opt.endNum - 计数结束值
 * @example
 * 01 创建一个实例 
 * const cou = new Counter({startNum:10,endNum:90})
 * 
 * 02 开始计数
 * cou.start(function(result,isEnd){
 *   //回调函数u--其他业务处理
 * })
 * 
 * 03 中断计数
 * cou.stop()
 * 
 * 04 重新开始计数
 * cou.restart()
 * 
 * 05 设置计数开始值
 * cou.setStartNum(num)
 * 
 * 06 设置计数结束值
 * cou.setEndNum(num)
 * 
 */
function Counter(opt) {
    let optObj = {
        startNum: 0,
        endNum: 100
    }
    opt = Object.assign(optObj, opt)
    this.startNum = opt.startNum
    this.endNum = opt.endNum
    this.currentNum = opt.startNum
    this.timer = null

    // 上面的属性需要是每一个实例各自维护一份
    // 下面的方法，本质都是操作、设置各自实例对象的属性，所以都设置为静态方法即可
    // 为了实现权责分明，每一个函数只负责一个功能，如果有功能依赖，通过调用对应的功能函数
    
    if (typeof this.start != "function") {

        
        /**计数开始方法 -start
         * 
         * @static
         * @param  {function} cabll - 回调函数，通过回调参数获取计数返回的数值
         */
        arguments.callee.prototype.start = (cabll) => {
            this.timer = setInterval(() => {
                //开始计数，调用计数功能模块,如果isCount等于true表示还在计数，如果等于false，表示计数结束
                let isCount = this.count()
                cabll(this.currentNum, isCount)
            }, 1000);
        }
        
        /**处理计数模块：如果当前值处于计数的范围之内返回true，表示计数还在继续，当等于结束值，表示计数立即停止———返回false表示计数结束
         * 
         * @static
         * @returns {boolean}
         * 
         */
        arguments.callee.prototype.count = () => {
            this.currentNum++
            if (this.currentNum === this.endNum) {
                clearInterval(this.timer)
                return false
            } else {
                return true
            }
        }
         /**中断计数方法-stop
         * @static
         * 
         */
        arguments.callee.prototype.stop = () => {
            clearInterval(this.timer)
        }
         /**重新开始计数，基于最后一次设置的初始值-restart
         * @static
         */
        arguments.callee.prototype.restart = () => {
            this.stop()
            this.currentNum = this.startNum
        }
         /**设置初始值-setStartNum
         * @static
         */
        arguments.callee.prototype.setStartNum = (num)=>{
            this.startNum = num
            this.currentNum = num
        }
         /**设置结束值-setEndNum
         * @static
         */
        arguments.callee.prototype.setEndNum = (num)=>{
            this.endNum = num
        }
    }

}

