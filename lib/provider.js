/* jshint unused: false */

/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 *
 * @see {@link http://retsr.io/rets.js}
 */

'use strict';

/** log facility */
var log    = require('./logger');

/** core deps */
var path          = require('path');
var os            = require('os');
var fs            = require('fs');
var util          = require('util');
var extend        = require('extend');
var url           = require('url');
var EventEmitter  = require('events').EventEmitter;
var xml           = require('xml2js').parseString;

var Configuration = require('./configuration');
var Request       = require('./request');
var response      = require('./response');
var Session       = require('./session');

/**
 *
 */
function Provider(url) {

    /**
     * @todo Document this pattern.
     */
    if (!(this instanceof Provider)) {
        return new Provider(url);
    }

    this.url = url;
    this.version  = 'RETS/1.7.2';

}


Provider.prototype.settings = {
    "Broker": false,               // [deprecated] broker-code(::= 1*24ALPHANUM) [, broker-branch(::= 1*24ALPHANUM)] CRLF
    "MemberName": false,           // [deprecated] member-name(::= 1*48TEXT) CRLF
    "MetadataVersion": false,      // [deprecated] metadata-version(::= 1*2DIGITS . 1*2DIGITS [. 1*5DIGITS]) CRLF
    "MetadataTimestamp": false,    // [deprecated] RETSDATETIME CRLF
    "MinMetadataTimestamp": false, // [deprecated] RETSDATETIME CRLF
    "User": false,                 // [deprecated] user-id(::= 1*30ALPHANUM) , user-level(::= 1*30ALPHANUM) , user-class(::= 1*5DIGIT) , agent-code(::= 1*30ALPHANUM) CRLF
    "Balance": false,              // [deprecated] balance(::= 1*32ALPHANUM) CRLF
    "TimeoutSeconds": false,       // [deprecated] 1*5DIGIT CRLF
    "Expr": false,                 // [deprecated] pwd-expire-date(::= RETSDATETIME) , pwd-expire-warn(::= ["-"]1*3DIGIT) CRLF
    "OfficeList": false,           // [deprecated] broker-code(::= 1*24ALPHANUM) [; broker-branch(::= 1*24ALPHANUM) ] *( , broker-code(::= 1*24ALPHANUM) [; broker-branch(::= 1*24ALPHANUM) ]) CRLF

    /**
     * Note that the above are all being replaced by the Info token.
     */
    "Info": {                     // info-token-name(::= RETSNAME) [ ; info-token-type(::= TOKEN) ] ; info-token-value(::= TEXT) CRLF
        "USERID": false,
        "USERCLASS": false,
        "USERLEVEL": false,
        "AGENTCODE": false,
        "BROKERCODE": false,
        "BROKERBRANCH": false,
        "MEMBERNAME": false,
        "MetadataID": false,
        "MetadataVersion": false,
        "MetadataTimestamp": false,
        "MinMetadataTimestamp": false,
        "Balance": false,
        "TimeoutSeconds": false,
        "PasswordExpiration": false,
        "WarnPasswordExpirationDays": false,
        "OfficeList": false,
        "StandardNamesVersion": false,
        "VendorName": false,
        "ServerProductName": false,
        "ServerProductVersion": false,
        "OperatorName": false,
        "RoleName": false,
        "SupportContactInformation": false
    }
};

Provider.prototype.capabilities = {
    // Action: "/some/path",
    // ChangePassword: "/some/path",
    // GetMetadata: "/some/path",
    // GetObject: "/some/path",
    // GetPayloadList: "/some/path",
    Login: "/Login.asmx/Login",
    // Logout: "/some/path",
    // PostObject: "/some/path",
    // Search: "/some/path",
    // Update: "/some/path"
};

/**
 */
};

/**
 * Execute logout action/capability against RETS service.
 *
 * @this RETS
 */
Provider.prototype.Logout = function () {
    log.info("Executing Provider.Logout request.");
    // var $this = this;
    //
    // return request(this.session, 'Logout', {}, function(err){
    //     $this.emit('logout',err);
    // })
    // .pipe(response())
    // .on('finish',function(){
    //     $this.emit('logout',null);
    // });
};

/**
 * Execute GetMetadata action/capability against RETS service.
 *
 * @see {@link http://www.reso.org/assets/RETS/Specifications/rets_1_8.pdf}
 *
 * @param  {Object} options   GetMetadata Request Options:
 * @param  {string} options.type   Metadata types can be:
 *                         METADATA-LOOKUP, METADATA-LOOKUP_TYPE, METADATA-FOREIGN_KEY, METADATA-FILTER,
 *                         METADATA-FILTER_TYPE, METADATA-RESOURCE, METADATA-CLASS, METADATA-OBJECT,
 *                         METADATA-TABLE, METADATA-SYSTEM, METADATA-UPDATE, METADATA-UPDATE_TYPE,
 *                         METADATA-SEARCH_HELP, etc.
 * @param  {string} options.id     Resource ID to lookup
 * @param  {string} options.format XML-Standard
 */
Provider.prototype.GetMetadata = function () {
    log.info("Executing Provider.GetMetadata request.");
    // var debug = require('debug')('rets.js:rets:Metadata Cache');
    // var $this = this;
    // var cache = null;
    // var MetadataTimeStamp = new Date(this.session.settings.MetadataTimeStamp).getTime();
    // var MetadataVersion = this.session.settings.MetadataVersion;
    // // debug("this.session: \n%s", util.inspect(this.session, {colors: true}));
    // var file = path.join(os.tmpdir(), this.session.url.host + '.metadata.json');
    // debug("Time Stamp: %o", MetadataTimeStamp);
    // debug("Version: %o", MetadataVersion);
    // debug("File: %o", file);
    // var exists = fs.existsSync(file);
    // debug("File already exists: %o", exists);
    // if ( exists ) {
    //     var CachedMetadataTimeStamp = null;
    //     var CachedMetadataVersion = null;
    //     cache = JSON.parse(fs.readFileSync(file));
    //     CachedMetadataTimeStamp = new Date(cache.timestamp).getTime();
    //     CachedMetadataVersion = cache.version;
    //     debug("Cache Time Stamp: %o", CachedMetadataTimeStamp);
    //     debug("Cache Version: %o", CachedMetadataVersion);
    //     var stale = (MetadataTimeStamp > CachedMetadataTimeStamp) && (MetadataVersion === CachedMetadataVersion);
    //     debug("Cache is stale?: %o", stale);
    //     if (!stale) {
    //         this.metadata = cache.payload;
    //         debug("Cache successfully loaded from file.");
    //         this.emit('metadata', null, this.metadata);
    //     }
    // } else {
    //     var xml2js = require('xml2js');
    //     var parser = new xml2js.Parser({
    //         explicitRoot: false,
    //         normalizeTags: true,
    //         normalize: true,
    //         mergeAttrs: true,
    //         explicitArray: false,
    //         tagNameProcessors: [function(name){return name.toLowerCase();}],
    //         attrNameProcessors: [function(name){return name.toLowerCase();}]
    //     });
    //
    //     var buffer = [];
    //
    //     return request(this.session, 'GetMetadata', { qs: {Type: 'METADATA-SYSTEM', ID: '*', Format: 'STANDARD-XML'} }, function(err){
    //         $this.emit('metadata', err);
    //     })
    //     .pipe(response({parse:false}))
    //     .on('data',function(chunk){
    //         buffer.push(chunk.toString());
    //     })
    //     .on('finish',function(){
    //         buffer = buffer.join('');
    //         parser.addListener('end', function(result) {
    //             var cache = {
    //                 version: $this.session.settings.MetadataVersion,
    //                 timestamp: $this.session.settings.MetadataTimeStamp,
    //                 payload: result
    //             };
    //             $this.metadata = cache.payload;
    //             fs.writeFile(file, JSON.stringify(cache, null, 4), function(err) {
    //                 if(err) {debug(err);}
    //                 debug("Cache successfully written to file.");
    //                 $this.emit('metadata', null, $this.metadata);
    //             });
    //         });
    //         parser.parseString(buffer);
    //     });
    // }
};

/**
 * Inspect RETS provider for this instance.
 *
 */
Provider.prototype.inspect = function () {
    log.info("Executing Provider.inspect request.");
    //
    // var Table = require('cli-table');
    //
    // debug("SETTINGS:");
    // var settings = new Table({
    //     head: ['key', 'value']
    // });
    // for (var setting in this.session.settings) {
    //     if (this.session.settings.hasOwnProperty(setting)) {
    //         settings.push([setting, this.session.settings[setting]]);
    //     }
    // }
    // settings.toString().split("\n").forEach(function(line){
    //     debug(line);
    // });
    //
    // debug("CAPABILITIES:");
    // var capabilities = new Table({
    //     head: ['key', 'value']
    // });
    // for (var capability in this.session.capabilities) {
    //     if (this.session.capabilities.hasOwnProperty(capability)) {
    //         capabilities.push([capability, this.session.capabilities[capability]]);
    //     }
    // }
    // capabilities.toString().split("\n").forEach(function(line){
    //     debug(line);
    // });
    //
    // var resources = this.metadata.metadata['metadata-system'].system['metadata-resource'].resource;//[1]['metadata-class'].class;
    // // debug("resources: \n%s", util.inspect(resources, { colors: true, depth: 2 }));// resources[i].resourceid, "\n" + util.inspect(resources[i], { depth: 0 }) + "\n");
    // var classes = [];
    // var table = new Table({
    //     head: ['resourceid', 'standardname', 'visiblename', 'description', 'keyfield', 'classcount']
    // });
    // resources.forEach(function(resource){
    //     if (parseInt(resource.classcount) === 1) {
    //         classes.push(resource['metadata-class'].class);
    //     } else {
    //         resource['metadata-class'].class.forEach(function(cls){
    //             classes.push(cls);
    //         });
    //     }
    //     table.push([
    //         resource.resourceid,
    //         resource.standardname,
    //         resource.visiblename,
    //         resource.description,
    //         resource.keyfield,
    //         resource.classcount
    //     ]);
    // });
    // debug("RESOURCES:");
    // table.toString().split("\n").forEach(function(line){
    //     debug(line);
    // });
    //
    // table = new Table({
    //     head: ['classname', 'standardname', 'visiblename', 'description']
    // });
    // classes.forEach(function(cls){
    //     table.push([
    //         cls.classname,
    //         cls.standardname,
    //         cls.visiblename,
    //         cls.description
    //     ]);
    // });
    //
    // debug("CLASSES:");
    // table.toString().split("\n").forEach(function(line){
    //     debug(line);
    // });
    //
};

/**
 * Execute GetObject action/capability against RETS service.
 *
 * @see Section 5 {@link http://www.reso.org/assets/RETS/Specifications/rets_1_8.pdf}
 *
 * @param  {Object} options GetObject Request Options
 * @param  {string} options.resource Resource identifier
 * @param  {string} options.type     Object type
 * @param  {string} options.id       Related record id
 * @param  {bool} options.location Return binary or as URL
 */
Provider.prototype.GetObject = function (options) {
    log.info({options: options}, "Executing Provider.GetObject request.");
    // var $this = this;
    //
    // var defaults = {
    //     Resource: 'Property',
    //     Type: 'PHOTO',
    //     ID: '*',
    //     Location: 0
    // };
    //
    // var qs = util._extend(defaults, options);
    // this.emit('object', new Error('Not implemented'));

/**
 * Execute Login capability against RETS service.
 */
Provider.prototype.Login = function (options) {
    log.info({options: options}, "Executing Provider.Login request. [%s]", this.capabilities.Login);
    var $this = this;
    var request = new Request(this);
    var req = request.request({url: this.capabilities.Login});
        req = req.pipe(response());
        req = req.on('error',function(err){
            $this.emit('login', err);
        });
        req = req.on('capability',function(key, value){
            $this.capabilities[key] = value;
        });
        req = req.on('setting',function(key, value){
            $this.session.settings[key] = value;
        });
        req = req.on('finish',function(){
            $this.emit('login',null);
            log.info({settings: $this.session.settings}, "Session settings:");
            log.info({capabilities: $this.capabilities}, "Provider capabilities:");
        });
    return req;
};

/**
 * Execute Logout capability against RETS service.
 */
Provider.prototype.Logout = function () {
    log.info("Executing Provider.Logout request. [%s]", this.capabilities.Logout);
    var $this = this;
    var request = new Request(this);
    var req = request.request({url: this.capabilities.Logout});
        req = req.pipe(response());
        req = req.on('error',function(err){
            $this.emit('logout', err);
        });
        req = req.on('finish',function(){
            $this.emit('logout',null);
        });
    return req;
};

/**
 * Execute PostObject capability against RETS service.
 */
Provider.prototype.PostObject = function(options){
   log.info({options: options}, "Executing Provider.PostObject request.");
   var err = new Error('Not implemented');
   log.error(err);

   // var Request = new Request(this);
   // var req = Request.request({url: this.capabilities.PostObject});
   // return req;
};

/**
 * Execute search action/capability against RETS service.
 *
 * @param {Object} options - A compliant URL string or URL module compatible url object.
 * @param {string} options.SearchType - Resource to search against
 * @param {string} options.Class - Class to search against
 * @param {string} options.Query - DMQL(2) query
 * @param {string} options.QueryType - Specify DMQL or DMQL2 query
 * @param {Number} options.Count - Boolean; should the server return a record count
 * @param {string} options.Offset - Offset record to start with
 * @param {string} options.Select - Fields to return
 * @param {String} options.Format - Data format type COMPACT, COMPACT-DECODED or STANDARD-XML
 * @param {Number} options.Limit - Record limit to fetch
 * @param {Number} options.StandardNames - Boolean to return fields as StandardNames
 */
Provider.prototype.Search = function (options) {
    log.info({options: options}, "Executing Provider.Search request.");
    var $this = this;
    options || (options = {});
    var objectMode = options.objectMode || false;
    var format = options.format || 'objects'; // arrays
    var headers = options.headers || true; // arrays
    delete options.objectMode;
    delete options.format;
    delete options.headers;
    var defaults = {
        SearchType: 'Property',
        Class: 'ResidentialProperty',
        Query: '(Status=|A)',
        QueryType: 'DMQL2', // 'DMQL'
        Count: 1,
        // Offset: 1, // Don't set offset by default
        // Select: '*',
        Format: 'COMPACT-DECODED',//'STANDARD-XML',
        // Limit: 0, // Disable default setting of limit
        StandardNames: 1
    };
    var qs = util._extend(defaults, options);
    var Request = new Request(this);
    var req = Request.request({url: this.capabilities.Search});
        req = req.pipe(response({format:format, objectMode: objectMode, headers: headers}));
        req = req.on('error',function(err){
            $this.emit('search', err);
        });
        req = req.on('finish',function(){
            $this.emit('search',null);
        });
    return req;
};

/**
 * Execute Update capability against RETS service.
 */
Provider.prototype.Update = function(options){
   log.info("Executing Provider.Update request.");
   var err = new Error('Not implemented');
   log.error(err);

   // var Request = new Request(this);
   // var req = Request.request({url: this.capabilities.Update});
   // return req;
};

module.exports = Provider;
