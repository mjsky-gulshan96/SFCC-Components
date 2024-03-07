'use strict';
var CustomObjectMgr = require('dw/object/CustomObjectMgr');

function getFaqEmbedding() {
    var ContentMgr = require('dw/content/ContentMgr');
    var Site = require('dw/system/Site');
    var customPref = Site.current.preferences.custom;
    var embeddingService = require('*/cartridge/scripts/services/embeddingService.js');
    var Transaction = require('dw/system/Transaction');

    var embedDataFrame = [];
    // check if custom object is saved for each asset
    var faqContentIDS = customPref.faqContentID ? customPref.faqContentID.split(',') : [];
    faqContentIDS = faqContentIDS.filter(faqID => {
        var faqEmbdngCustomObj = CustomObjectMgr.getCustomObject('faqEmbeddingObj', faqID);
        if (faqEmbdngCustomObj && 'faqEmbeddingData' in faqEmbdngCustomObj.custom) {
            var embdData = faqEmbdngCustomObj.custom.faqEmbeddingData;
            embedDataFrame = embedDataFrame.concat(JSON.parse(embdData))
        } else {
            return faqID;
        }
    })

    // create the embeddings for those asset which are not saved
    if (faqContentIDS.length) {
        faqContentIDS.forEach(faqID => {
            var contentArr = [];
            var result = [];

            var faqEmbdngCustomObj = CustomObjectMgr.getCustomObject('faqEmbeddingObj', faqID);
            // create custom object for each content asset
            if (!faqEmbdngCustomObj) {
                Transaction.wrap(function () {
                    faqEmbdngCustomObj = CustomObjectMgr.createCustomObject('faqEmbeddingObj', faqID);
                });
            }

            var content = faqID ? ContentMgr.getContent(faqID.trim()) : null;
            // split content querywise and generate embeddings
            if (content && content.custom.body.markup) {
                var splitCOntent = content.custom.body.markup.split('\n');
                var joinCOnt = ''
                splitCOntent.forEach(content => {
                    if (content && content.trim().length > 0) {
                        joinCOnt += content
                    } else {
                        contentArr.push(joinCOnt)
                        joinCOnt = '';
                    }
                })
                if (joinCOnt.length) {
                    contentArr.push(joinCOnt)
                }
            }
            // get embeddings for asset
            contentArr.forEach(content => {
                if (content && content.trim().length > 0) {
                    var ContEmbedding = embeddingService.createEmbedding(content);
                    result.push({ embedding: ContEmbedding, content: content })
                }
            });
            embedDataFrame = embedDataFrame.concat(result);

            // store this embedding in custom object
            Transaction.wrap(function () {
                faqEmbdngCustomObj.custom.faqEmbeddingData = JSON.stringify(result);
            });
        });
    }

    return embedDataFrame;
}


module.exports = {
    getFaqEmbedding: getFaqEmbedding
}