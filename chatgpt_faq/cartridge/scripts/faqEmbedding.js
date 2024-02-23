'use strict';

function getFaqEmbedding() {
    var ContentMgr = require('dw/content/ContentMgr');
    var embeddingService = require('*/cartridge/scripts/services/embeddingService.js');
    var CacheMgr = require('dw/system/CacheMgr');
    var embedCache = CacheMgr.getCache('embeddingFile')

    // first get embedding from custom cache
    var cachedEmbedding = embedCache.get('faqEmbedding')
    if (cachedEmbedding) {
        return cachedEmbedding;
    }

    // read faq from content asset
    var faqContent = ContentMgr.getContent('faqContent');
    if (!faqContent && !faqContent.online) {
        return null;
    }
    faqContent = faqContent.custom.body.markup
    // create embeddings for faq
    var faqEmbedding = embeddingService.createEmbedding(faqContent)
    if (!faqEmbedding) {
        return null;
    }
    // save embedding to custom cache
    embedCache.put('faqEmbedding', faqEmbedding)
    return faqEmbedding;
}

module.exports = {
    getFaqEmbedding: getFaqEmbedding
}