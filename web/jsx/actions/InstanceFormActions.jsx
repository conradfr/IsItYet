'use strict';

var Reflux = require('reflux');

var InstanceFormActions = Reflux.createActions({
    "stepSubmitted": {asyncResult: false},
    "inputUpdated": {asyncResult: false},
    "instanceSubmitted": {asyncResult: true}
});

module.exports = InstanceFormActions;