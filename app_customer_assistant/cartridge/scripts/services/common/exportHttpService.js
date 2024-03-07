var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Site = require('dw/system/Site');
var customPref = Site.current.preferences.custom;

function ServiceExport(serviceName, url) {
    var service = LocalServiceRegistry.createService(serviceName, {
        createRequest: function (svc, payload) {
            svc.setURL(url);
            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('x-service-line', customPref.XSERVICELINE);
            svc.addHeader('x-brand', customPref.XBRAND);
            svc.addHeader('x-project', customPref.XPROJECT);
            svc.addHeader('Ocp-Apim-Subscription-Key', customPref.APIKEY);
            svc.addHeader('api-version', 'v6');
            svc.addHeader('Cache-Control', 'no-cache');
            return payload;
        },
        parseResponse: function (svc, response) {
            return response;
        },
        filterLogMessage: function (msg) {
            return msg;
        },
    });
    return service;
}

module.exports = {
    ServiceExport: ServiceExport
}
