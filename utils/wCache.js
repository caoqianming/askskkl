var postfix = '_deadtime';

function put(k, v, t) {
  // console.log(k);
  uni.setStorageSync(k, v)
  var seconds = parseInt(t);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    // console.log(timestamp);
    uni.setStorageSync(k + postfix, timestamp + "")
  } else {
    uni.removeStorageSync(k + postfix)
  }
}

function get(k, def) {
  var deadtime = parseInt(uni.getStorageSync(k + postfix))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) { return def; } else { return; }
    }
  }
  var res = uni.getStorageSync(k);
  if (res) {
    return res;
  } else {
    return def;
  }
}

function remove(k) {
  uni.removeStorageSync(k);
  uni.removeStorageSync(k + postfix);
}

function clear() {
  uni.clearStorageSync();
}

module.exports = {
  put: put,
  get: get,
  remove: remove,
  clear: clear,
}
