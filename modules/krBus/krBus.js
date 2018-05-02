/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("krBus",{

	// Default module config.
	defaults: {
		text: "Hello World!",
        apiUrl: '',
        stationId: '',
        header: '',
        animationSpeed: 2000,
        updateInterval: 5 * 60 * 1000


    },

    // Define required scripts.
    getStyles: function() {
        return ["bus.css", "font-awesome.css"];
    },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    //Define header for module.
    getHeader: function() {
        return this.header;
    },
    start: function() {
        this.buseJson = {};
        this.loaded = false;

        // Set locale.
        moment.locale(config.language);

        this.url = encodeURI(this.config.apiUrl + this.getParams());

        this.updateBusInfo(this);
        this.scheduleUpdate(this.config.initialLoadDelay);

    },
    getParams: function() {
        var params = "?";
        params += "stationId=" + this.config.stationId;

        //Log.info(params);
        return params;
    },
    // updateBusInfo IF module is visible (allows saving credits when using MMM-ModuleScheduler to hide the module)
    updateBusInfo: function(self) {
            self.sendSocketNotification('GET_BUSINFO', { 'url': self.url });
    },
    /* processBuses(data)
   	 * Uses the received data to set the various values into a new array.
   	 */
    processBuses: function(data) {
        this.buseJson = {};

        // this.buses.data.push({station:'hi'})
        this.buseJson = data;
        this.loaded = true;
        this.updateDom(this.config.animationSpeed);

    },

    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(function() {
            self.updateBusInfo(self);
        }, nextLoad);
    },

        // Process data returned
    socketNotificationReceived: function(notification, payload) {

        if (notification === 'BUS_DATA') {
            this.processBuses(payload.data);
            this.scheduleUpdate(this.config.updateInterval);

        }
    },
    getDom: function() {
        var wrapper = document.createElement("div");

        this.header = this.buseJson.stationNm + "("+this.buseJson.StationId+")";

        if (!this.loaded) {
            wrapper.innerHTML = "Loading bus Info ...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }else {

            // wrapper.innerHTML = this.buseJson.stationNm

            // *** Start Building Table
            var bustable = document.createElement("table");
            bustable.className = "busData";

            if (this.buseJson != null) {
                for (var t in this.buseJson.busList) {
                    var bus =  this.buseJson.busList[t];

                    var row = document.createElement("tr");
                    bustable.appendChild(row);


                    //symbol
                    var symbolWrapper = document.createElement("td");
                    symbolWrapper.className = "symbol align-right";
                    var symbol = document.createElement("span");
                    symbol.className = "fa fa-fw fa-" + 'bus';
                    symbol.style.paddingLeft = "5px";

                    // symbol.style.fontSize = '90%';

                    symbolWrapper.appendChild(symbol);
                    row.appendChild(symbolWrapper);


                    //Route name/Number
                    var routeCell = document.createElement("td");
                    routeCell.className = "경로";
                    routeCell.style.paddingLeft = "5px";
                    routeCell.style.paddingRight = "5px";
                    // routeCell.style.fontSize = '60%';

                    routeCell.innerHTML = " " + bus.routeNum + "번 ("+bus.plateNo+") ";
                    row.appendChild(routeCell);

                    //Time Tabled Departure
                    var timeTabledCell = document.createElement("td");
                    var destTime = document.createElement("span");
                    var publicMsg = document.createElement("span");

                    timeTabledCell.className = "timeTabled";

                    if(bus.predictTime < 5){
                        destTime.style.cssText = "color:rgb(255,0,0)";
                        destTime.style.fontSize = '100%';
                        destTime.innerHTML = bus.predictTime;
                    }else {
                        destTime.innerHTML = bus.predictTime
                        // destTime.style.fontSize = '60%';

                    }
                    // publicMsg.style.fontSize = '60%';
                    publicMsg.innerHTML += ' 분후 도착 예정';

                    timeTabledCell.appendChild(destTime);
                    timeTabledCell.appendChild(publicMsg);

                    row.appendChild(timeTabledCell);

                }
            }
            wrapper.appendChild(bustable);

            return wrapper;
		}


    }
});
