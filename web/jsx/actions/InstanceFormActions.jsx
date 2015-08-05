'use strict';

var Reflux = require('reflux');

var InstanceFormActions = Reflux.createActions({
    "typeSubmitted": {asyncResult: false},
    "inputUpdated": {asyncResult: false},
    "instanceSubmitted": {asyncResult: true},
    "statusSubmitted": {asyncResult: true},
    "deleteSubmitted": {asyncResult: true}
});

module.exports = InstanceFormActions;