'use strict'

function getCosineSim(vecA, vecB) {
    var dotproduct = 0;
    var magA = 0;
    var magB = 0;

    for (var i = 0; i < vecA.length; i++) {
        dotproduct += vecA[i] * vecB[i];
        magA += vecA[i] * vecA[i];
        magB += vecB[i] * vecB[i];
    }

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);
    var similarity = dotproduct / (magA * magB);

    return similarity;
}

module.exports = {
    getCosineSim: getCosineSim
}