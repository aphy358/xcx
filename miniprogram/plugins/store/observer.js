const events = Symbol('events');
class Observer {
    constructor() {
        this[events] = {};
    }
    on(eventName, callback) {
        this[events][eventName] = this[events][eventName] || [];
        this[events][eventName].push(callback);
    }
    emit(eventName, param) {
        if (this[events][eventName]) {
            this[events][eventName].forEach((value, index) => {
                value(param);
            })
        }
    }

    clear(eventName) {
        this[events][eventName] = [];
    }

    off(eventName, callback) {
        this[events][eventName] = this[events][eventName] || [];
        this[events][eventName].forEach((item, index) => {
            if (item === callback) {
                this[events][eventName].splice(index, 1);
            }
        })
    }

    one(eventName, callback) {
        this[events][eventName] = [callback];
    }
}

const observer = new Observer();



// 实现数据监听
function observe(obj, key, watchFun, deep, page) {
  let val = obj[key];

  if (val != null && typeof val === "object" && deep) {
    Object.keys(val).forEach((item) => {
      observe(val, item, watchFun, deep, page);
    });
  }

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    set: function (value) {
      watchFun.call(page, value, val);
      val = value;

      if (deep) {
        observe(obj, key, watchFun, deep, page);
      }
    },
    get: function () {
      return val;
    }
  });
}

function setWatcher(page, watchhh) {
  let data = page.data;
  let watch = watchhh || page.data.watch;

  Object.keys(watch).forEach((item) => {
    let targetData = data;
    let keys = item.split(".");

    for (let i = 0; i < keys.length - 1; i++) {
      targetData = targetData[keys[i]];
    }

    let targetKey = keys[keys.length - 1];

    let watchFun = watch[item].handler || watch[item];

    let deep = watch[item].deep;
    observe(targetData, targetKey, watchFun, deep, page);
  });
}


function resetWatch(watch, globalData){
  var tmpWatch = {}
  for (let key in watch){
    if (!!~globalData.indexOf(key)){
      // 什么都不做
    }else{
      tmpWatch[key] = watch[key]
    }
  }

  return tmpWatch
}


export {
    Observer,
    observer,
  setWatcher,
  resetWatch
}
