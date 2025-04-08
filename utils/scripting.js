// https://stackoverflow.com/a/32922084
function deepEqual(x, y) {
  return (x && y && typeof x === 'object' && typeof y === 'object') ?
    (Object.keys(x).length === Object.keys(y).length) &&
    Object.keys(x).reduce(function (isEqual, key) {
      return isEqual && deepEqual(x[key], y[key]);
    }, true) : (x === y);
}

module.exports = {
  deepEqual,
  choice: function (arr) {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  },
  randIntBetween: function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  generateSpaces: function (number) {
    let str = "";
    for (let i = 0; i < number; i++) {
      str += " ";
    }
    return str;
  },
  deepClone: function (input) {
    let output = {}
    for (let item in input) {
      if (typeof input[item] !== 'object') {
        output[item] = input[item]
      } else {
        if (Object.keys(input[item]).length > 0) {
          output[item] = this.deepClone(input[item])
        } else {
          output[item] = input[item]
        }
      }
    }
    return output
  },
  wait: function (ms) {
    return new Promise(res => setTimeout(res, ms));
  },
  formatMoney: function (val) {
    a = val / 100;
    a = a.toString().split('');
    let output = [];
    let tempSliced = [];
    if (a.includes('.')) {
        let index = a.indexOf('.');
        let spliceCount = a.length - index;
        tempSliced = a.splice(index, spliceCount);
        a.splice(index, spliceCount);
    }
    for (let i = a.length - 1; i >= 0; i--) {
        if (Math.abs(a.length - 1 - i) % 3 == 0) {
            output.unshift(`,`);
            output.unshift(a[i]);
        } else {
            output.unshift(a[i]);
        }
    }
    output.pop();
    return `$${output.join('').concat(tempSliced.join(''))}`;
},
  getCurrentDay: function () {
    var a = new Date();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var date = date + ' ' + month + ' ' + year;
    return date;
  },
  getTimestamp: function() {
    var a = new Date();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes()
    var date = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
    return date;
  },
  getTimeUntilNextDay: function () {
    var a = new Date();
    let hours = a.getHours();
    let minutes = a.getMinutes();
    let totalMinutesRemaining = 1440 - hours * 60 - minutes;
    let hoursToDisplay = Math.floor(totalMinutesRemaining / 60);
    let minutesToDisplay = totalMinutesRemaining % 60;
    return `${hoursToDisplay}H ${minutesToDisplay}M`
  },
  fancyText: function (input) {
    const dictionary = {
      a: "𝓪",
      b: "𝓫",
      c: "𝓬",
      d: "𝓭",
      e: "𝓮",
      f: "𝓯",
      g: "𝓰",
      h: "𝓱",
      i: "𝓲",
      j: "𝓳",
      k: "𝓴",
      l: "𝓵",
      m: "𝓶",
      n: "𝓷",
      o: "𝓸",
      p: "𝓹",
      q: "𝓺",
      r: "𝓻",
      s: "𝓼",
      t: "𝓽",
      u: "𝓾",
      v: "𝓿",
      w: "𝔀",
      x: "𝔁",
      y: "𝔂",
      z: "𝔃",
      A: "𝓐",
      B: "𝓑",
      C: "𝓒",
      D: "𝓓",
      E: "𝓔",
      F: "𝓕",
      G: "𝓖",
      H: "𝓗",
      I: "𝓘",
      J: "𝓙",
      K: "𝓚",
      L: "𝓛",
      M: "𝓜",
      N: "𝓝",
      O: "𝓞",
      P: "𝓟",
      Q: "𝓠",
      R: "𝓡",
      S: "𝓢",
      T: "𝓣",
      U: "𝓤",
      V: "𝓥",
      W: "𝓦",
      X: "𝓧",
      Y: "𝓨",
      Z: "𝓩",
    }
    for (let i in dictionary) {
      input = input.replaceAll(i, dictionary[i]);
    }
    return input;
  },
  capitaliseFirst(string) {
    string = string.split('');
    string[0] = string[0].toUpperCase();
    return string.join('');
  } 
}