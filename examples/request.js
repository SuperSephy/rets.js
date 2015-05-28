var log    = require('../lib/logger');
var RETSJS = require('../');
// var util = require('util');
// var url = require('url');
// var mixin    = require('merge-descriptors');
// var through = require('through2');

// var mixin    = require('merge-descriptors');
var username = process.env.RETS_USERNAME;
var password = process.env.RETS_USERPASSWORD;
var host = 'sef.rets.interealty.com';
var endpoint = '/Login.asmx/Login';
var _url = "http://" + host + endpoint;
var _url_with_user = "http://" + username + ":" + password + "@" + host + endpoint;
var rets = null;
var bunyan = require('bunyan');


var rets = new RETSJS({ url: _url_with_user, user: { name: username, password: password }, client: { name: username, password: password } });

log.debug({rets: rets}, "Instance created");

var capabilities = [];
    capabilities.push("Login");
    // capabilities.push("Action");
    // capabilities.push("ChangePassword");
    // capabilities.push("GetMetadata");
    // capabilities.push("GetObject");
    // capabilities.push("GetPayloadList");
    // capabilities.push("Logout");
    // capabilities.push("PostObject");
    capabilities.push("Search");
    // capabilities.push("Update");

log.info("Testing: %s", capabilities);

function runner(caps) {
    if (caps.length > 0) {
        var cap = caps.shift();
        log.info(">>>>>>>> Calling: %s", cap);
            if (typeof rets[cap] === 'function') {
                var req = rets[cap]();
                if (typeof req !== 'undefined') {
                    req = req.on("error", function(err){
                        log.info("error:", err);
                    });
                    var buffered = [];
                    req = req.on("data", function(chunk){
                        var data = chunk.toString();
                            buffered.push(data);
                    });
                    req = req.on("end", function(){
                        log.debug("%s", buffered.join(''));
                        log.info(">>>>>>>> %s Ended", cap);
                        runner(caps);
                    });
                } else {
                    runner(caps);
                }
            } else {
                runner(caps);
            }
    }
}
runner(capabilities);
