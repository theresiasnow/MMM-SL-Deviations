const moment = require("moment");

function logPrefix() {
  return moment().format("YYYY:mm:DD HH:mm:ss") + ": MMM-SL-deviances: ";
}

function log(message) {
  console.log(logPrefix() + message);
}

module.exports = {
  log: log
};
