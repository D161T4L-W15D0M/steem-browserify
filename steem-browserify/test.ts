var steem = require('./lib/api.js');

steem.streamOperations(function (err, result) {
    if (err == null) {
        if (result[0] == "vote") { console.log("VOTE: " + JSON.stringify(result[1])); }
        if (result[0] == "transfer") { console.log("TRANSFER: " + JSON.stringify(result[1])); }
        // console.log(JSON.stringify(result));
    }
    else console.log("ERROR! " + JSON.stringify(err));
});

// Steem.vote = function (wif, voter, author, permlink, weight, callback) {
steem.vote("postingKey", ["your name"], "herpetologyguy", "these-are-not-beginner-pets-think-twice-before-adopting-a-turtle-tortoise", 10000, function (err, result) {
    console.log("VOTE: error = " + JSON.stringify(err) + "; result = " + JSON.stringify(result));
})

// Steem.transfer = function (wif, from, to, amount, memo, callback) {
steem.transfer("activeKey", ["your-name"], ["digital-wisdom"], "1.000 SBD", "steem-browserify ROCKS!", function (err, result) {
    console.log("TRANSFER: error = " + JSON.stringify(err) + "; result = " + JSON.stringify(result));
})
