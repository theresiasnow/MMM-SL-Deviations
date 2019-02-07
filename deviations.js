const request = require("request-promise-native");
const moment = require("moment");

class Deviation {
  constructor(scope, created, updated, fromDate, toDate, header, details) {
    this.scope = scope;
    this.created = created;
    this.updated = updated;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.header = header;
    this.details = details;
  }
}

function getDeviations(url, apikey, transportMode, lineNumber, fromDate, toDate) {
  log("Getting trafic deviations");

  var options = {
    uri: url,
    qs: {
      key: apikey,
      transportMode: transportMode,
      lineNumber: lineNumber,
      fromDate: fromDate,
      toDate: toDate
    },
    json: true
  };

  return request(options)
    .then( (response) => {
      return  parseDeviations(response);
  })
  .catch( (err) => {
    console.log("Error: " + err);
  });
}

function parseDeviations(response) {
  var arr = [];
  for(var deviation of response.ResponseData) {
    arr.push(new Deviation(
      deviation.Scope,
      deviation.Created,
      deviation.Updated,
      deviation.FromDateTime,
      deviation.UpToDateTime,
      deviation.Header,
      deviation.Details
    ));
  }
  return arr;
}

// Logging
function logPrefix() {
  return moment().format("YYYY:mm:DD HH:mm:ss") + " MMM-SL-deviances: ";
}

function log(message) {
  console.log(logPrefix() + message);
}

function debug(message) {
  if (isDebug) {log(message);}
}

module.exports = {
  Deviation: Deviation,
  getDeviations: getDeviations
}
