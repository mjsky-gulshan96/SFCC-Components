'use strict'

function getCosineSim(vecA, vecB) {
    var dotproduct = 0;
    var magA = 0;
    var magB = 0;

    for (var i = 0; i < vecA.length; i++) {
        dotproduct += Number(vecA[i]) * Number(vecB[i]);
        magA += Number(vecA[i]) * Number(vecA[i]);
        magB += Number(vecB[i]) * Number(vecB[i]);
    }

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);
    var similarity = dotproduct / (magA * magB);

    return similarity;
}

function getTop3Embeddingdata(embedDataFrame, queryEmbd) {

    embedDataFrame.forEach(embdObj => {
        embdObj['similarityScore'] = getCosineSim(embdObj.embedding, queryEmbd)
    })
    embedDataFrame.sort((a, b) => {
        return b.similarityScore - a.similarityScore
    })
    return embedDataFrame.slice(0, 3);
}

module.exports = {
    getCosineSim: getCosineSim,
    getTop3Embeddingdata: getTop3Embeddingdata
}