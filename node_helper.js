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
const Logging = require("./logging.js");

var isDebug = false;

module.exports = NodeHelper.create({

  start: function () {
    Logging.log("Starting helper: " + this.name);
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
    const url = "http://api.sl.se/api2/deviations.json";
    const apikey = this.config.apikey;
    const transportMode = this.config.transportMode;
    const line = this.config.line;
    const now = moment().format("YYYY-MM-DD");
    const fromDate = now;
    const toDate = now;

    clearInterval(this.updatetimer);
    Deviations.getDeviations(url, apikey, transportMode, line, fromDate, toDate).then((deviations) => {
      Logging.log("sending update");
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

function debug(message) {
  if (isDebug) { Logging.log(message); }
}
