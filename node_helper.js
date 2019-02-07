/* node_helper.js
 *
 * Magic Mirror module - Display public transport deviances in Stockholm/Sweden.
 * This module use the API's provided by Trafiklab.
 *
 * Magic Mirror
 * Module: MMM-SL-deviances
 *
 * Magic Mirror By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * Module MMM-SL-deviances by Theresia Sofia Snow
 */
const moment = require("moment");
const NodeHelper = require("node_helper");
const Deviations = require("./deviations.js");

var isDebug = true;

module.exports = NodeHelper.create({

  start: function () {
    log("Starting helper: " + this.name);
    this.started = false;
  },

  scheduleUpdate: function () {
    var self = this;
    clearInterval(this.updatetimer);
    debug("scheduleUpdate=" + this.config.updateInterval);
    this.updatetimer = setInterval(function () {
        self.getDeviations();
    }, this.config.updateInterval);
  },

  getDeviations: function() {
    var self = this;

    debug("getDeviations");

    clearInterval(this.updatetimer);

    const url = "http://api.sl.se/api2/deviations.json";
    const apikey = this.config.apikey;
    const transportMode = this.config.transportMode;
    const line = this.config.line;
    // TODO: set dynamically
    const fromDate = "2019-02-07";
    const toDate = "2019-02-07";

    Deviations.getDeviations(url, apikey, transportMode, line, fromDate, toDate).then((deviations) => {
      console.log("sending update");
      self.sendSocketNotification("DEVIATIONS", deviations); // Send deviations to module
    });
    self.scheduleUpdate();
  },

  // Handle socketnotifications
  socketNotificationReceived: function (notification, payload) {
    const self = this;
    if (notification === "CONFIG") {
        this.config = payload;
        this.started = true;
        isDebug = this.config.debug;
        self.scheduleUpdate();
        self.getDeviations(); // First time
    };
  }

});

// Logging
function logPrefix() {
  return moment().format("YYYY:mm:DD HH:mm:ss") + ": MMM-SL-deviances: ";
}

function log(message) {
  console.log(logPrefix() + message);
}

function debug(message) {
  if (isDebug) {log(message);}
}
