const request = require("request-promise-native");
const moment = require("moment");
const Logging = require("./logging.js");

const dateformat = "YYYY-MM-DD HH:mm";

class Deviation {
  constructor(scope, created, updated, fromDate, toDate, header, details) {
    this.scope = scope;
    this.created = moment(created, dateformat).format(dateformat);
    this.updated = moment(updated, dateformat).format(dateformat);
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.header = header;
    this.details = details;
  }
}

function getDeviations(url, apikey, transportMode, lineNumber, fromDate, toDate) {
  Logging.log("Getting trafic deviations from " + fromDate + " to " + toDate);

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

module.exports = {
  Deviation: Deviation,
  getDeviations: getDeviations
};
