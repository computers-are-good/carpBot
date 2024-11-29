// https://stackoverflow.com/a/32922084
function deepEqual(x, y) {
    return (x && y && typeof x === 'object' && typeof y === 'object') ?
      (Object.keys(x).length === Object.keys(y).length) &&
        Object.keys(x).reduce(function(isEqual, key) {
          return isEqual && deepEqual(x[key], y[key]);
        }, true) : (x === y);
  }

module.exports = {
    deepEqual,
    choice: function(arr) {
      const index = Math.floor(Math.random() * arr.length);
      return arr[index];
    },
    randIntBetween: function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    generateSpaces: function(number) {
      let str = "";
      for (let i = 0; i < number; i++) {
        str += " ";
      }
      return str;
    },
    deepClone: function(input) {
      let output = {}
      for (let item in input) {
          if (typeof input[item] !== 'object') {
              output[item] = input[item]
          } else {
              if (Object.keys(input[item]).length > 0) {
                  output[item] = cloneDB(input[item])
              } else {
                  output[item] = input[item]
              }
          }
      }
      return output
    }, 
    wait: function(ms) {
      return new Promise(res => {
        setTimeout(res, ms);
      });
    }
}