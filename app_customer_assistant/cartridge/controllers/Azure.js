'use strict';

var server = require('server');
var Site = require('dw/system/Site');

server.post('FAQResponse', function (req, res, next) {
    var embeddingService = require('*/cartridge/scripts/services/embeddingService.js');
    var chatCompletion = require('*/cartridge/scripts/services/chatCompletion.js');
    var Helper = require('*/cartridge/scripts/helper.js');
    var FAQEmbedding = require('*/cartridge/scripts/faqEmbedding.js');
    var HttpParameter = request.httpParameterMap

    // get faq embeddings data frame
    var embedDataFrame = FAQEmbedding.getFaqEmbedding();
    if (!embedDataFrame.length) {
        res.json({ error: true })
        return next()
    }
    
    var query = HttpParameter.parameterNames[0]
    query = JSON.parse(query).query

    // get query embeddings
    var queryEmbd = embeddingService.createEmbedding(query)
    if (!queryEmbd) {
        res.json({ error: true })
        return next()
    }

    // get top 3 matches from query embd and faq data embeddings chunks
    var top3Embeddingdata = Helper.getTop3Embeddingdata(embedDataFrame, queryEmbd)

    var chatResp = chatCompletion.createChatCompletion(query, top3Embeddingdata)
    res.json({
        success: true,
        responseMsg: chatResp
    })
    next()
})

module.exports = server.exports();
