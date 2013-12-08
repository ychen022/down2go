//This file defines some utility functions.

var utils = {};

//Cited from 6.170 Course Note
utils.from_to = function (from, to, f) {
    if (from > to) return;
    f(from); utils.from_to(from+1, to, f);
};

//Cited from 6.170 Course Note
utils.each = function (a, f) {
    utils.from_to(0, a.length-1, function (i) {f(a[i]);});
};