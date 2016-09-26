var isNode = require('detect-node');
if (isNode) var WS = require('ws');
var steemAuth = require('./steemauth.js');

var Steem = {
    url: 'wss://steemit.com/wspa',
    apiIds: {
        'database_api': 0,
        'login_api': 1,
        'follow_api': 2,
        'network_broadcast_api': 4
    },
    id: 0,
    reqs: [],
    isOpen: false,
    isReady: false
};

Steem.setWebSocket = function (url) {
    this.url = url;
};

Steem.init = function (callback) {
    if (!this.isReady) {
        if (isNode) {
            this.ws = new WS(this.url);
            this.ws.setMaxListeners(0);
        } else {
            this.ws = new WebSocket(this.url);
        }
        this.ws.addEventListener('close', function () {
            this.ws.close();
            this.isReady = false;
            this.isOpen = false;
        }.bind(this));
        this.isReady = true;
    }
    if (!this.isOpen) {
        this.ws.addEventListener('open', function () {
            this.isOpen = true;
            this.getApiByName('database_api', function () { });
            this.getApiByName('login_api', function () { });
            this.getApiByName('follow_api', function () { });
            this.getApiByName('network_broadcast_api', function () { });
            callback();
        }.bind(this));
    } else {
        callback();
    }
};

Steem.iterate = function () {
    this.id++;
    var id = this.id;
    this.reqs.push(id);
    return id;
};

Steem.getApi = function (api, callback) {
    if (this.apiIds[api] || this.apiIds[api] === 0) {
        callback('', this.apiIds[api]);
    } else {
        this.getApiByName(api, function (err, result) {
            this.apiIds[api] = result;
            callback('', result);
        }.bind(this));
    }
};

Steem.send = function (api, data, callback) {
    data.id = data.id || 0;
    data.params = data.params || [];
    this.init(function () {
        var call = {};
        call.id = data.id;
        call.method = 'call';
        call.params = [this.apiIds[api], data.method, data.params];
        this.ws.send(JSON.stringify(call));
    }.bind(this));

    this.ws.addEventListener('message', function (msg) {
        var data = JSON.parse(msg.data);
        var err = (data.error && data.error.data && data.error.data.stack) ? data.error.data.stack : '';
        callback(err, data);
    }.bind(this));

    this.ws.addEventListener('error', function (error) {
        callback(error, null);
    });
};


// [database_api]

// Subscriptions

/* set_subscribe_callback */
Steem.setSubscribeCallback = function (cb, clearFilter, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'set_subscribe_callback',
        'params': [callback, clearFilter]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* set_pending_transaction_callback */
Steem.setPendingTransactionCallback = function (cb, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'set_pending_transaction_callback',
        'params': [cb]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* set_block_applied_callback */
Steem.setBlockAppliedCallback = function (cb, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'set_block_applied_callback',
        'params': [cb]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* cancel_all_subscriptions */
Steem.cancelAllSubscriptions = function (callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'cancel_all_subscriptions'
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};


// tags

/* get_trending_tags */
Steem.getTrendingTags = function (afterTag, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_trending_tags',
        'params': [afterTag, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_discussions_by_trending */
Steem.getDiscussionsByTrending = function (query, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_discussions_by_trending',
        'params': [query]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_discussions_by_created */
Steem.getDiscussionsByCreated = function (query, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_discussions_by_created',
        'params': [query]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_discussions_by_active */
Steem.getDiscussionsByActive = function (query, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_discussions_by_active',
        'params': [query]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_discussions_by_cashout */
Steem.getDiscussionsByCashout = function (query, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_discussions_by_cashout',
        'params': [query]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_discussions_by_payout */
Steem.getDiscussionsByPayout = function (query, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_discussions_by_payout',
        'params': [query]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_discussions_by_votes */
Steem.getDiscussionsByVotes = function (query, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_discussions_by_votes',
        'params': [query]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_discussions_by_children */
Steem.getDiscussionsByChildren = function (query, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_discussions_by_children',
        'params': [query]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_discussions_by_hot */
Steem.getDiscussionsByHot = function (query, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_discussions_by_hot',
        'params': [query]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_discussions_by_feed */
Steem.getDiscussionsByFeed = function (query, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_discussions_by_feed',
        'params': [query]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

// Blocks and transactions

/* get_block_header */
Steem.getBlockHeader = function (blockNum, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_block_header',
        'params': [blockNum]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_block */
Steem.getBlock = function (blockNum, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_block',
        'params': [blockNum]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_state */
Steem.getState = function (path, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_state',
        'params': [path]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_trending_categories */
Steem.getTrendingCategories = function (after, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_trending_categories',
        'params': [after, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_best_categories */
Steem.getBestCategories = function (after, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_best_categories',
        'params': [after, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_active_categories */
Steem.getActiveCategories = function (after, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_active_categories',
        'params': [after, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_recent_categories */
Steem.getRecentCategories = function (after, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_recent_categories',
        'params': [after, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};


// Globals

/* get_config */
Steem.getConfig = function (callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_config',
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_dynamic_global_properties */
Steem.getDynamicGlobalProperties = function (callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_dynamic_global_properties'
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_chain_properties */
Steem.getChainProperties = function (after, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_chain_properties'
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_feed_history */
Steem.getFeedHistory = function (callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_feed_history'
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_current_median_history_price */
Steem.getCurrentMedianHistoryPrice = function (callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_current_median_history_price'
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_witness_schedule */
Steem.getWitnessSchedule = function (callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_recent_categories',
        'params': [after, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_hardfork_version */
Steem.getHardforkVersion = function (callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_hardfork_version'
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_next_scheduled_hardfork */
Steem.getNextScheduledHardfork = function (callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_next_scheduled_hardfork'
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};


// Keys

/* get_key_references */
Steem.getKeyReferences = function (key, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_key_references',
        'params': [key]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};


// Accounts

/* get_accounts */
Steem.getAccounts = function (names, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_accounts',
        'params': [names]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_account_references */
Steem.getAccountReferences = function (accountId, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_account_references',
        'params': [accountId]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* lookup_account_names */
Steem.lookupAccountNames = function (accountNames, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'lookup_account_names',
        'params': [accountNames]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* lookup_accounts */
Steem.lookupAccounts = function (lowerBoundName, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'lookup_accounts',
        'params': [lowerBoundName, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_account_count */
Steem.getAccountCount = function (callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_account_count'
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_conversion_requests */
Steem.getConversionRequests = function (accountName, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_conversion_requests',
        'params': [accountName]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_account_history */
Steem.getAccountHistory = function (account, from, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_account_history',
        'params': [account, from, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_owner_history */
Steem.getOwnerHistory = function (account, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_owner_history',
        'params': [account]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_recovery_request */
Steem.getRecoveryRequest = function (account, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_recovery_request',
        'params': [account]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};


// Market

/* get_order_book */
Steem.getOrderBook = function (limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'getOrderBook',
        'params': [limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_open_orders */
Steem.getOpenOrders = function (owner, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_open_orders',
        'params': [owner]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_liquidity_queue */
Steem.getLiquidityQueue = function (startAccount, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_liquidity_queue',
        'params': [startAccount, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};


// Authority / validation

/* get_transaction_hex */
Steem.getTransactionHex = function (trx, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_transaction_hex',
        'params': [trx]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_transaction */
Steem.getTransaction = function (trxId, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_transaction',
        'params': [trxId]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_required_signatures */
Steem.getRequiredSignatures = function (trx, availableKeys, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_required_signatures',
        'params': [trx, availableKeys]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_potential_signatures */
Steem.getPotentialSignatures = function (trx, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_potential_signatures',
        'params': [trx]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* verify_authority */
Steem.verifyAuthority = function (trx, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'verify_authority',
        'params': [trx]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* verify_account_authority */
Steem.verifyAccountAuthority = function (nameOrId, signers, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'verify_account_authority',
        'params': [nameOrId, signers]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};


// votes

/* get_active_votes */
Steem.getActiveVotes = function (author, permlink, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_active_votes',
        'params': [author, permlink]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_account_votes */
Steem.getAccountVotes = function (voter, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_account_votes',
        'params': [voter]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};


// content

/* get_content */
Steem.getContent = function (author, permlink, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_content',
        'params': [author, permlink]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_content_replies */
Steem.getContentReplies = function (parent, parentPermlink, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_content_replies',
        'params': [parent, parentPermlink]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_discussions_by_author_before_date */
Steem.getDiscussionsByAuthorBeforeDate = function (author, startPermlink, beforeDate, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_discussions_by_author_before_date',
        'params': [author, startPermlink, beforeDate, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_replies_by_last_update */
Steem.getRepliesByLastUpdate = function (startAuthor, startPermlink, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_replies_by_last_update',
        'params': [startAuthor, startPermlink, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};


// Witnesses

/* get_witnesses */
Steem.getWitnesses = function (witnessIds, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_witnesses',
        'params': [witnessIds]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_witness_by_account */
Steem.getWitnessByAccount = function (accountName, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_witness_by_account',
        'params': [accountName]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_witnesses_by_vote */
Steem.getWitnessesByVote = function (from, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_witnesses_by_vote',
        'params': [from, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* lookup_witness_accounts */
Steem.lookupWitnessAccounts = function (lowerBoundName, limit, callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'lookup_witness_accounts',
        'params': [lowerBoundName, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_witness_count */
Steem.getWitnessCount = function (callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_witness_count'
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_active_witnesses */
Steem.getActiveWitnesses = function (callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_active_witnesses'
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_miner_queue */
Steem.getMinerQueue = function (callback) {
    var iterator = this.iterate();
    this.send('database_api', {
        'id': iterator,
        'method': 'get_miner_queue'
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};


// [login_api]

/* login */
Steem.login = function (username, password, callback) {
    var iterator = this.iterate();
    this.send('login_api', {
        'id': iterator,
        'method': 'login',
        'params': [username, password]
    }, function (err, data) {
        if (iterator == data.id) {
            this.getApiByName('network_broadcast_api', function () { });
            callback(err, data.result);
        }
    }.bind(this));
};

/* get_api_by_name */
Steem.getApiByName = function (apiName, callback) {
    var iterator = this.iterate();
    this.send('login_api', {
        'id': iterator,
        'method': 'get_api_by_name',
        'params': [apiName]
    }, function (err, data) {
        if (iterator == data.id) {
            this.apiIds[apiName] = data.result;
            callback(err, data.result);
        }
    }.bind(this));
};


// [follow_api]

/* get_followers */
Steem.getFollowers = function (following, startFollower, followType, limit, callback) {
    var iterator = this.iterate();
    this.send('follow_api', {
        'id': iterator,
        'method': 'get_followers',
        'params': [following, startFollower, followType, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* get_following */
Steem.getFollowing = function (follower, startFollowing, followType, limit, callback) {
    var iterator = this.iterate();
    this.send('follow_api', {
        'id': iterator,
        'method': 'get_following',
        'params': [follower, startFollowing, followType, limit]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};


// [network_broadcast_api]

/* broadcast_transaction */
Steem.broadcastTransaction = function (trx, callback) {
    var iterator = this.iterate();
    this.send('network_broadcast_api', {
        'id': iterator,
        'method': 'broadcast_transaction',
        'params': [trx]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* broadcast_transaction_synchronous */
Steem.broadcastTransactionSynchronous = function (trx, callback) {
    var iterator = this.iterate();
    this.send('network_broadcast_api', {
        'id': iterator,
        'method': 'broadcast_transaction_synchronous',
        'params': [trx]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* broadcast_block */
Steem.broadcastBlock = function (b, callback) {
    var iterator = this.iterate();
    this.send('network_broadcast_api', {
        'id': iterator,
        'method': 'broadcast_block',
        'params': [b]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};

/* broadcast_transaction_with_callback */
Steem.broadcastTransactionWithCallback = function (confirmationCallback, trx, callback) {
    var iterator = this.iterate();
    this.send('network_broadcast_api', {
        'id': iterator,
        'method': 'broadcast_transaction_with_callback',
        'params': [confirmationCallback, trx]
    }, function (err, data) {
        if (iterator == data.id) callback(err, data.result);
    });
};


// [Stream]

Steem.streamBlockNumber = function (callback) {
    var current = '';
    var self = this;
    setInterval(function () {
        self.getDynamicGlobalProperties(function (err, result) {
            var blockId = result.head_block_number;
            if (blockId != current) {
                current = blockId;
                callback(null, current);
            }
        });
    }, 200);
};

Steem.streamBlock = function (callback) {
    var current = '';
    var last = '';
    var self = this;
    this.streamBlockNumber(function (err, id) {
        current = id;
        if (current != last) {
            last = current;
            self.getBlock(current, function (err, result) {
                callback(null, result);
            });
        }
    });
};

Steem.streamTransactions = function (callback) {
    this.streamBlock(function (err, result) {
        if (!!result) {
            result.transactions.forEach(function (transaction) {
                callback(null, transaction);
            });
        }
    })
};

Steem.streamOperations = function (callback) {
    this.streamBlock(function (err, result) {
        if (!!result) {
            result.transactions.forEach(function (transaction) {
                transaction.operations.forEach(function (operation) {
                    callback(null, operation);
                });
            });
        }
    })
};


Steem.txSend = function (tx, privKeys, callback) {
    var self = this;
    this.login('', '', function () {
        self.getDynamicGlobalProperties(function (err, result) {
            var seconds = 1000;
            result.timestamp = result.timestamp || Date.now()
            var expiration = new Date(result.timestamp + 15 * seconds);
            tx.expiration = expiration.toISOString().replace('Z', '');
            tx.ref_block_num = result.head_block_number & 0xFFFF;
            tx.ref_block_prefix = new Buffer(result.head_block_id, 'hex').readUInt32LE(4);
            try {
                var signedTransaction = steemAuth.signTransaction(tx, privKeys);
                //console.log(JSON.stringify(signedTransaction));
                self.broadcastTransactionWithCallback(function () { }, signedTransaction, function (err, result) {
                    callback(err, result);
                });
            } catch (e) {
                callback(e.toString(), "");
            }
        });
    });
};

Steem.vote = function (wif, voter, author, permlink, weight, callback) {
    var tx = {
        extensions: [],
        operations: [['vote', {
            voter: voter,
            author: author,
            permlink: permlink,
            weight: weight
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result);
    })
};

Steem.upvote = function (wif, voter, author, permlink, weight, callback) {
    weight = weight || 10000;
    vote(wif, author, permlink, weight, function (err, result) {
        callback(err, result);
    })
};

Steem.downvote = function (wif, voter, author, permlink, weight, callback) {
    weight = weight || 10000;
    vote(wif, author, permlink, -Math.abs(weight), function (err, result) {
        callback(err, result);
    })
};

Steem.comment = function (wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, callback) {
    permlink = permlink || formatter.commentPermlink(parentAuthor, parentPermlink);
    var tx = {
        extensions: [],
        operations: [['comment', {
            parent_author: parentAuthor,
            parent_permlink: parentPermlink,
            author: author,
            permlink: permlink,
            title: title,
            body: body,
            json_metadata: JSON.stringify(jsonMetadata)
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result);
    })
};
Steem.transfer = function (wif, from, to, amount, memo, callback) {
    var tx = {
        extensions: [],
        operations: [['transfer', {
            from: from,
            to: to,
            amount: amount,
            memo: memo
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result);
    })
};
Steem.transferToVesting = function (wif, from, to, amount, callback) {
    var tx = {
        extensions: [],
        operations: [['transfer_to_vesting', {
            from: from,
            to: to,
            amount: amount
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result);
    })
};
Steem.withdrawVesting = function (wif, account, vestingShares, callback) {
    var tx = {
        extensions: [],
        operations: [['withdraw_vesting', {
            account: account,
            vesting_shares: vestingShares
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result);
    })
};
Steem.limitOrderCreate = function (wif, owner, orderid, amountToSell, minToReceive, fillOrKill, expiration, callback) {
    var tx = {
        extensions: [],
        operations: [['limit_order_create', {
            owner: owner,
            orderid: orderid,
            amount_to_sell: amountToSell,
            min_to_receive: minToReceive,
            fill_or_kill: fillOrKill,
            expiration: expiration
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.limitOrderCancel = function (wif, owner, orderid, callback) {
    var tx = {
        extensions: [],
        operations: [['limit_order_cancel', {
            owner: owner,
            orderid: orderid
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.feedPublish = function (wif, publisher, exchangeRate, callback) {
    var tx = {
        extensions: [],
        operations: [['feed_publish', {
            publisher: publisher,
            exchange_rate: exchangeRate
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.convert = function (wif, owner, requestid, amount, callback) {
    var tx = {
        extensions: [],
        operations: [['convert', {
            owner: owner,
            requestid: requestid,
            amount: amount
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.accountCreate = function (wif, fee, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata, callback) {
    var tx = {
        extensions: [],
        operations: [['account_create', {
            fee: fee,
            creator: creator,
            new_account_name: newAccountName,
            owner: owner,
            active: active,
            posting: posting,
            memo_key: memoKey,
            json_metadata: JSON.stringify(jsonMetadata)
        }]]
    };
    this.txSend(tx, { owner: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.accountUpdate = function (wif, account, owner, active, posting, memoKey, jsonMetadata, callback) {
    var tx = {
        extensions: [],
        operations: [['account_update', {
            account: account,
            owner: owner,
            active: active,
            posting: posting,
            memo_key: memoKey,
            json_metadata: JSON.stringify(jsonMetadata)
        }]]
    };
    this.txSend(tx, { owner: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.witnessUpdate = function (wif, owner, url, blockSigningKey, props, fee, callback) {
    var tx = {
        extensions: [],
        operations: [['witness_update', {
            owner: owner,
            url: url,
            block_signing_key: blockSigningKey,
            props: props,
            fee: fee
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.accountWitnessVote = function (wif, account, witness, approve, callback) {
    var tx = {
        extensions: [],
        operations: [['account_witness_vote', {
            account: account,
            witness: witness,
            approve: approve
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.accountWitnessProxy = function (wif, account, proxy, callback) {
    var tx = {
        extensions: [],
        operations: [['account_witness_proxy', {
            account: account,
            proxy: proxy
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.pow = function (wif, worker, input, signature, work, callback) {
    var tx = {
        extensions: [],
        operations: [['pow', {
            worker: worker,
            input: input,
            signature: signature,
            work: work
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.custom = function (wif, requiredAuths, id, data, callback) {
    var tx = {
        extensions: [],
        operations: [['custom', {
            required_auths: requiredAuths,
            id: id,
            data: data
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.reportOverProduction = function (wif, reporter, firstBlock, secondBlock, callback) {
    var tx = {
        extensions: [],
        operations: [['report_over_production', {
            reporter: reporter,
            first_block: firstBlock,
            second_block: secondBlock
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.deleteComment = function (wif, author, permlink, callback) {
    var tx = {
        extensions: [],
        operations: [['delete_comment', {
            author: author,
            permlink: permlink
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.customJson = function (wif, requiredAuths, requiredPostingAuths, id, json, callback) {
    var tx = {
        extensions: [],
        operations: [['custom_json', {
            required_auths: requiredAuths,
            required_posting_auths: requiredPostingAuths,
            id: id,
            json: json
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.commentOptions = function (wif, author, permlink, maxAcceptedPayout, percentSteemDollars, allowVotes, allowCurationRewards, extensions, callback) {
    var tx = {
        extensions: [],
        operations: [['comment_options', {
            author: author,
            permlink: permlink,
            max_accepted_payout: maxAcceptedPayout,
            percent_steem_dollars: percentSteemDollars,
            allow_votes: allowVotes,
            allow_curation_rewards: allowCurationRewards,
            extensions: extensions
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.setWithdrawVestingRoute = function (wif, fromAccount, toAccount, percent, autoVest, callback) {
    var tx = {
        extensions: [],
        operations: [['set_withdraw_vesting_route', {
            from_account: fromAccount,
            to_account: toAccount,
            percent: percent,
            auto_vest: autoVest
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.limitOrderCreate2 = function (wif, owner, orderid, amountToSell, exchangeRate, fillOrKill, expiration, callback) {
    var tx = {
        extensions: [],
        operations: [['limit_order_create2', {
            owner: owner,
            orderid: orderid,
            amount_to_sell: amountToSell,
            exchange_rate: exchangeRate,
            fill_or_kill: fillOrKill,
            expiration: expiration
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.challengeAuthority = function (wif, challenger, challenged, requireOwner, callback) {
    var tx = {
        extensions: [],
        operations: [['challenge_authority', {
            challenger: challenger,
            challenged: challenged,
            require_owner: requireOwner
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.proveAuthority = function (wif, challenged, requireOwner, callback) {
    var tx = {
        extensions: [],
        operations: [['prove_authority', {
            challenged: challenged,
            require_owner: requireOwner
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.requestAccountRecovery = function (wif, recoveryAccount, accountToRecover, newOwnerAuthority, extensions, callback) {
    var tx = {
        extensions: [],
        operations: [['request_account_recovery', {
            recovery_account: recoveryAccount,
            account_to_recover: accountToRecover,
            new_owner_authority: newOwnerAuthority,
            extensions: extensions
        }]]
    };
    this.txSend(tx, { owner: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.recoverAccount = function (wif, accountToRecover, newOwnerAuthority, recentOwnerAuthority, extensions, callback) {
    var tx = {
        extensions: [],
        operations: [['recover_account', {
            account_to_recover: accountToRecover,
            new_owner_authority: newOwnerAuthority,
            recent_owner_authority: recentOwnerAuthority,
            extensions: extensions
        }]]
    };
    this.txSend(tx, { owner: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.changeRecoveryAccount = function (wif, accountToRecover, newRecoveryAccount, extensions, callback) {
    var tx = {
        extensions: [],
        operations: [['change_recovery_account', {
            account_to_recover: accountToRecover,
            new_recovery_account: newRecoveryAccount,
            extensions: extensions
        }]]
    };
    this.txSend(tx, { owner: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.escrowTransfer = function (wif, from, to, amount, memo, escrowId, agent, fee, jsonMeta, expiration, callback) {
    var tx = {
        extensions: [],
        operations: [['escrow_transfer', {
            from: from,
            to: to,
            amount: amount,
            memo: memo,
            escrow_id: escrowId,
            agent: agent,
            fee: fee,
            json_meta: jsonMeta,
            expiration: expiration
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.escrowDispute = function (wif, from, to, escrowId, who, callback) {
    var tx = {
        extensions: [],
        operations: [['escrow_dispute', {
            from: from,
            to: to,
            escrow_id: escrowId,
            who: who
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.escrowRelease = function (wif, from, to, escrowId, who, amount, callback) {
    var tx = {
        extensions: [],
        operations: [['escrow_release', {
            from: from,
            to: to,
            escrow_id: escrowId,
            who: who,
            amount: amount
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.fillConvertRequest = function (wif, owner, requestid, amountIn, amountOut, callback) {
    var tx = {
        extensions: [],
        operations: [['fill_convert_request', {
            owner: owner,
            requestid: requestid,
            amount_in: amountIn,
            amount_out: amountOut
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.commentReward = function (wif, author, permlink, sbdPayout, vestingPayout, callback) {
    var tx = {
        extensions: [],
        operations: [['comment_reward', {
            author: author,
            permlink: permlink,
            sbd_payout: sbdPayout,
            vesting_payout: vestingPayout
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.curateReward = function (wif, curator, reward, commentAuthor, commentPermlink, callback) {
    var tx = {
        extensions: [],
        operations: [['curate_reward', {
            curator: curator,
            reward: reward,
            comment_author: commentAuthor,
            comment_permlink: commentPermlink
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.liquidityReward = function (wif, owner, payout, callback) {
    var tx = {
        extensions: [],
        operations: [['liquidity_reward', {
            owner: owner,
            payout: payout
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.interest = function (wif, owner, interest, callback) {
    var tx = {
        extensions: [],
        operations: [['interest', {
            owner: owner,
            interest: interest
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.fillVestingWithdraw = function (wif, fromAccount, toAccount, withdrawn, deposited, callback) {
    var tx = {
        extensions: [],
        operations: [['fill_vesting_withdraw', {
            from_account: fromAccount,
            to_account: toAccount,
            withdrawn: withdrawn,
            deposited: deposited
        }]]
    };
    this.txSend(tx, { active: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.fillOrder = function (wif, currentOwner, currentOrderid, currentPays, openOwner, openOrderid, openPays, callback) {
    var tx = {
        extensions: [],
        operations: [['fill_order', {
            current_owner: currentOwner,
            current_orderid: currentOrderid,
            current_pays: currentPays,
            open_owner: openOwner,
            open_orderid: openOrderid,
            open_pays: openPays
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
};
Steem.commentPayout = function (wif, author, permlink, payout, callback) {
    var tx = {
        extensions: [],
        operations: [['comment_payout', {
            author: author,
            permlink: permlink,
            payout: payout
        }]]
    };
    this.txSend(tx, { posting: wif }, function (err, result) {
        callback(err, result)
    })
}

module.exports = Steem;
