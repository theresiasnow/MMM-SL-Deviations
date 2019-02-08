Module.register("MMM-SL-deviations",{
	// Default module config.
  defaults: {
    text: "MMM-SL-deviances",
    apikey: "PleaseProvideYourOwn",
    updateInterval: 5 * 60 * 1000,
    uiUpdateInterval: 1000,
    line: "",
    divClass: "small bright",
    headerClass: "",
    createdClass: "light small dimmed",
    detailsClass: "light small dimmed"
  },

  start: function() {
    var self = this;
    Log.log(this.name + "is started!");

    this.loaded = false;
    this.deviations = [];

    this.uitimer = setInterval(function () {
      self.updateDom();
    }, self.config.uiUpdateInterval);

    // Send config to helper and initiate an update
    this.sendSocketNotification("CONFIG", this.config);
  },

  getHeader: function() {
    return this.data.header;
  },

  getStyles: function() {
    return ["MMM-SL-Deviations.css"];
  },

	getTemplate: function () {
		return "MMM-SL-Deviations.njk";
	},

	// Add all the data to the template.
	getTemplateData: function () {
		return {
      loaded: this.loaded,
			config: this.config,
			deviations: this.deviations
		}
	},

  // Handle socketnotifications
  socketNotificationReceived: function (notification, payload) {
    if (notification === "DEVIATIONS") {
        Log.info("update received");
        this.loaded = true;
        this.failure = undefined;
        this.deviations = payload;
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
