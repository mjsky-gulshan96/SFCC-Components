'use strict'
var Site = require('dw/system/Site');
var customPref = Site.current.preferences.custom;

function createEmbedding(textToEmbd) {
    var exportHttpService = require('*/cartridge/scripts/services/common/exportHttpService');
    var serviceName = 'azure_embedding'
    var apiKey = customPref.APIKEY;
    var apiBase = customPref.APIBASE;
    var apiVersion = customPref.APIVERSION;
    var embeddingDeployment = customPref.EMBEDDINGDEPLOYMENT;
    var chatDeployment = customPref.CHATDEPLOYMENT;

    var svcUrl = `${apiBase}/openai/deployments/${embeddingDeployment}/embeddings?api-version=${apiVersion}`;

    // get the service def
    var service = exportHttpService.ServiceExport(serviceName, svcUrl)
    var body = {
        input: textToEmbd,
        model: customPref.EMBEDDINGMODEL,
    }
    var payload = JSON.stringify(body)
    var embedding;
    try {
        // calls the embdng service
        var svcResponse = service.call(payload)
        if (svcResponse.ok) {
            var text = svcResponse.object.text
            var embedding = JSON.parse(text).data[0].embedding
        }
    } catch (err) {
        return embedding;
    }
    return embedding;
}

module.exports = {
    createEmbedding: createEmbedding
}
