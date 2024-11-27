module.exports = {
    formatMoney: function (val) {
        if (val == 0) return `$0.00`;
        if (val <= 9) return `$0.0${val}`;
        if (val <= 99) return `$0.${val}`;
        let arr = val.toString().split('');
        arr.splice(arr.length - 2, 0, ".");
        return `$${arr.join("")}`
    }
};