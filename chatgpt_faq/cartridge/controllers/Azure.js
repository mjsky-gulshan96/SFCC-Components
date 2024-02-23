'use strict';

var server = require('server');
var Site = require('dw/system/Site');

server.post('FAQResponse', function (req, res, next) {
    var embeddingService = require('*/cartridge/scripts/services/embeddingService.js');
    var chatCompletion = require('*/cartridge/scripts/services/chatCompletion.js');
    var Helper = require('*/cartridge/scripts/helper.js');
    var FAQEmbedding = require('*/cartridge/scripts/faqEmbedding.js');
    var HttpParameter = request.httpParameterMap
    // get faq embeddings
    var faqEmbdng = FAQEmbedding.getFaqEmbedding()
    if (!faqEmbdng) {
        res.json({ error: true })
        return next()
    }
    // query, will get from frontend
    var query = JSON.parse(HttpParameter.parameterNames[0]).query

    // get query embeddings
    var queryEmbd = embeddingService.createEmbedding(query)
    if (!queryEmbd) {
        res.json({ error: true })
        return next()
    }
    // get cosine similarity for boh embedding
    var getCosineSim = Helper.getCosineSim(faqEmbdng, queryEmbd)
    var chatResp = chatCompletion.createChatCompletion(query, getCosineSim)
    res.json({
        success: true,
        responseMsg: chatResp
    })
    next()
})

module.exports = server.exports();
