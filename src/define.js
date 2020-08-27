/**
 * This file is used by webpack to output the live build of the widget
 *
 * DO NOT CHANGE THIS
 */
var Widget = require('./widget');

var modules = {};
modules[WIDGET_NAME] = function(exports, require, module) {
  module.exports = Widget.default;
};

window.require.define(modules);
