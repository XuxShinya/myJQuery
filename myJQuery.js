(function(window, undefined) {
    var myJQuery = function(selector) {
        return new myJQuery.prototype.init(selector);
        //2-14 NO.01 入口代码片段实现
    };
    myJQuery.prototype = {
        constructor: myJQuery,
        //2-14 NO.01 入口代码片段实现
        //固有的方法通常写在原型上，需要传参的写在构造函数内
        init: function(selector) {
            /*入口函数规则
               1.传入 '',' ',undefined,null,false,NaN,0       返回一个空的jQuery对象
               2.传入字符串
                  2.1传入代码片段        将创建好的DOM元素存储在jQuery对象中返回
                  2.2传入选择器          讲匹配到的DOM元素存储在jQuery对象中返回
               3.传入数组
                  3.1传入真数组       将数组内的元素存储在jquery对象中返回
                  3.2传入伪数组       将数组中的元素存储在jQuery对象中返回
               4.传入其他类型的值（比如普通变量 true等）      将传入的值存储在jquery对象中返回
              */

            selector = myJQuery.trim(selector)
                //1
            if (!selector) {
                return this;
            } else if (myJQuery.isFunction(selector)) {
                myJQuery.ready(selector)
            } else if (myJQuery.isString(selector)) {
                //2
                //2.1判断是否为代码片段
                if (
                    myJQuery.isHTML(selector)
                ) {
                    let temp = document.createElement("div");
                    temp.innerHTML = selector;
                    // console.log(temp.children)
                    // for (let i = 0; i < temp.children.length; i++) {
                    //     const element = temp.children[i];
                    //     this[i] = element;
                    // }
                    // this.length = temp.children.length;
                    [].push.apply(this, temp.children)
                } else {
                    //2.2判断是为选择器
                    let temp = document.querySelectorAll(selector);
                    [].push.apply(this, temp)
                }
                //3
            } else if (myJQuery.isArray(selector)) {
                // 3.1真数组
                if (myJQuery.isRealArray(selector)) {
                    // console.log('真数组')
                    [].push.apply(this, selector)
                } else {
                    //3.2假数组
                    // console.log('假数组')
                    let arr = [].slice.call(selector);
                    [].push.apply(this, arr)
                }
                //4 
            } else {
                this[0] = selector;
                this.length = 1;
            }
            return this
        },
        /*
        jQ原型上的核心方法和属性：
        1. jqurey 获取版本号
        2. selector 实例的默认选择器取值
        3. length 实例默认长度
        4. push 给实例添加新元素
        5. sort 对实例中的元素进行排序
        6. splice 按照指定下标指定数量指定元素删除或替换元素

        1.toArray 把实例转换为数组返回
        2.get 获取指定下标的元素，获取的是原生DOM
        3.eq 获取指定下标的元素，获取的是jQuery对象
        4.first 获取实例中的第一个元素，返回的是jQuery对象
        5.last 获取实例中的最后一个元素，返回的是jQuery对象
        6.each 遍历实例，把遍历到的数据传给回调使用，返回值为遍历的实例本身
        7.map 遍历实例，把遍历到的数据传给回调使用，
             然后把回调函数的返回值收集成一个新的数组返回，
             回调没有返回值则返回空数组
        */
        myJQuery: '1.1.0',
        length: 0,
        selector: '',
        push: Array.prototype.push,
        splice: [].splice,
        sort: [].sort,
        toArray: function() {
            return [].slice.apply(this)
        },
        get: function(num) {
            if (arguments.length === 0) {
                return this.toArray()
            } else if (num >= 0) {
                return this[num]
            } else {
                return this[this.length + num]
            }
        },
        eq: function(num) {
            if (arguments.length === 0) {
                return new myJQuery()
            } else {
                return myJQuery(this.get(num)) //此处this代表的是调用eq函数的对象实例
                    //相当于对象实例调用get
            }
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        each: function(fn) {
            return myJQuery.each(this, fn)
                //此处为什么要传this？
                // 是因为调用此函数一般为实例对象调用（$('div').each()），
                //此时要将myJQuery中的要遍历的对象指向调用这个方法的实例对象，也就是this
        }
    };


    myJQuery.extend = myJQuery.prototype.extend = function(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                this[key] = obj[key];
            }
        }
    }

    //可以这么理解，extend中的方法是给myJQuery内部调用的，
    // 而prototype上的方法是给构造函数（myJQuery.prototype.push）
    // 以及实例化的对象(myj.push=>myj.__proto__.push)调用的。

    myJQuery.extend({
        isString: function(selector) {
            return typeof selector == "string"
        },
        isHTML: function(selector) {
            return selector.charAt(0) == "<" &&
                selector.charAt(selector.length - 1) == ">" &&
                selector.length >= 3
        },
        trim: function(str) {
            if (myJQuery.isString(str)) {
                if (str.trim) {
                    return str.trim()
                } else {
                    return str.replace(/^\s+|\s+$/g, '')
                }
            }
            return str
        },
        isObject: function(ele) {
            return typeof ele === 'object'
        },
        //是不是数组
        isArray: function(selector) {
            if (typeof selector === 'object' && 'length' in selector && selector !== window) {
                return true
            } else {
                return false
            }
        },
        // 是不是真数组
        isRealArray: function(selector) {
            return Object.prototype.toString.call(selector) == '[object Array]' ? true : false
        },
        isFunction: function(selector) {
            return typeof selector === 'function'
        },
        ready: function(fn) {
            if (document.readyState == 'complete') {
                fn()
            } else if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', function() {
                    fn()
                })
            } else {
                document.attachEvent('onreadystatechange', function() {
                    if (document.readyState == 'complete') {
                        fn()
                    }
                })
            }
        },
        each: function(obj, fn) {
            if (myJQuery.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    //   let  res =   fn(i, obj[i]) 
                    //通过对比jQuery中调用each方法后打印的this(为obj[i]的值)修改myJQuery中打印的this指向
                    let res = fn.call(obj[i], i, obj[i])
                    if (res === 'true') {
                        continue
                    } else if (res === 'false') {
                        break;
                    }
                }
            } else if (myJQuery.isObject(obj)) {
                for (const key in obj) {
                    // if (obj.hasOwnProperty(key)) {
                    //     const element = obj[key];
                    // }
                    fn.call(obj[key], key, obj[key])
                }
            }
            return obj
        },
        map: function(obj, fn) {
            let temp = []
            if (myJQuery.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    let res = fn(obj[i], i)
                    if (res) {
                        temp.push(res)
                    }
                }
            } else if (myJQuery.isObject(obj)) {
                for (const key in obj) {
                    let res = fn(obj[key], key)
                    if (res) {
                        temp.push(res)
                    }
                }
            }
            return temp
        }
    })
    myJQuery.prototype.extend({
        empty: function() {
            this.each(function(index, item) {
                item.innerHTML = ''
            })
            return this
                //return this的原因是
                //1.与jQuery的empty方法返回值一致
                //2.为了方便链式编程
        }
    })

    myJQuery.prototype.init.prototype = myJQuery.prototype;
    window.myJQuery = window.$ = myJQuery;
})(window);