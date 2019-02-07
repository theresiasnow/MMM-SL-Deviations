Module.register("MMM-SL-deviations",{
	// Default module config.
  defaults: {
    text: "MMM-SL-deviances",
    apikey: "PleaseProvideYourOwn",
    updateInterval: 5 * 60 * 1000,
    uiUpdateInterval: 1000,
    delayThreshhold: 60,
    line: "",
    fade: true,
    fadePoint: 0.2,
    displaycount: 10,
  },

	// Override dom generator.
	getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.className = "small bright";
    if(this.deviations !== undefined) {
      for (const deviation of this.deviations) {
        var div = document.createElement("div");
        header = document.createElement("div");
        header.innerHTML = deviation.header;
        details = document.createElement("div");
        details.className = "light small dimmed";
        details.innerHTML = deviation.details;
        div.appendChild(header);
        div.appendChild(details);
        wrapper.appendChild(div);
       }
    } else {
      Log.info("no deviations");
    }
    return wrapper;
  },

  getHeader: function() {
    return this.data.header;
  },

  start: function() {
    var self = this;
    Log.log(this.name + "is started!");

    this.uitimer = setInterval(function () { // This timer is saved in uitimer so that we can cancel it
      self.updateDom();
    }, self.config.uiUpdateInterval);

    this.sendSocketNotification("CONFIG", this.config); // Send config to helper and initiate an update
  },

  // Handle socketnotifications
  socketNotificationReceived: function (notification, payload) {
    if (notification === "DEVIATIONS") {
        Log.info("update received");
        this.loaded = true;
        this.failure = undefined;
        // Handle payload
        this.deviations = payload;
        this.deviations.obtained = new Date();
        this.updateDom();
    }
    if (notification == "SERVICE_FAILURE") {
        this.loaded = true;
        this.failure = payload;
        Log.info("Service failure: " + this.failure.resp.StatusCode + ":" + this.failure.resp.Message);
        this.updateDom();
    }
  }
});

// Utilities
function createRow(data) {
  var tr = document.createElement("tr");
  tr.className = "sup";
  var td = document.createElement("td");
  td.className = "align-left";
  td.innerHTML = data;
  tr.appendChild(td);
  return tr;
}

