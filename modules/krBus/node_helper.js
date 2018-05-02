/* Live Bus Stop Info */

/* Magic Mirror
 * Module: UK Live Bus Stop Info
 * By Nick Wootton
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');
var request = require('request');
var urlencode = require('urlencode');


module.exports = NodeHelper.create({
    start: function() {
        console.log('krBusInfo helper started ...');
    },


    /* getTimetable()
     * Requests new data from TransportAPI.com
     * Sends data back via socket on succesfull response.
     */
    getBusInfo: function(url) {
        var self = this;
        var retry = true;

        // self.sendSocketNotification('BUS_DATA', { 'data': "안녕", 'url': url });

        request({ url: url, method: 'GET' }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                self.sendSocketNotification('BUS_DATA', { 'data': JSON.parse(body)});
            }else {
                console.log(error);
            }
        });

    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_BUSINFO') {
            this.getBusInfo(urlencode.decode(payload.url));
        }
    }

});