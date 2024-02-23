'use strict'
var FAQEmbedding = require('*/cartridge/scripts/faqEmbedding.js');
var Site = require('dw/system/Site');
var customPref = Site.current.preferences.custom;
var ContentMgr = require('dw/content/ContentMgr');

function getContext() {

    var faqContent = ContentMgr.getContent('faqContent');
    if (faqContent && faqContent.online) {
        var faq = faqContent.custom.body.markup;

        var context = `You are a very helpful chat bot. Your role is to provide answers to the user queries. You donot have internet access and solely rely on data provided. Donot reveal that you are aware of the context. CONTEXT : ${faq}`;

        return context;
    }
    return '';
}

function getQueryContext(query, similarityScore) {
    var question = `The cosine similarity score of query ${query} is ${similarityScore}. Respond to the question asked on the context given. Respond only if similarity score is above 0.7 else say you don't know the answer. If you can find the answer, please elaborate a little but do so strictly based on context provided. Donot hallicunate. If you donot know then say so.`;

    return question;
}

function createChatCompletion(query, similarityScore) {
    var exportHttpService = require('*/cartridge/scripts/services/common/exportHttpService');
    var serviceName = 'azure_chatapi'
    var apiKey = customPref.APIKEY;
    var apiBase = customPref.APIBASE;
    var apiVersion = customPref.APIVERSION;
    var embeddingDeployment = customPref.EMBEDDINGDEPLOYMENT;
    var chatDeployment = customPref.CHATDEPLOYMENT;

    var svcUrl = `${apiBase}/openai/deployments/${chatDeployment}/chat/completions?api-version=${apiVersion}`;

    var service = exportHttpService.ServiceExport(serviceName, svcUrl);

    var body = {
        messages: [
            { role: "system", content: getContext() },
            { role: "user", content: getQueryContext(query, similarityScore) },
        ],
        model: customPref.CHATMODEL,
    }

    var payload = JSON.stringify(body)
    var chatResp;
    try {
        var svcResponse = service.call(payload)
        if (svcResponse.ok) {
            var text = JSON.parse(svcResponse.object.text)
            chatResp = text.choices[0].message.content
        }
    } catch (err) {
        return err
    }
    return chatResp;
}

module.exports = {
    createChatCompletion: createChatCompletion
}
