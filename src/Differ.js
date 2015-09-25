/**
 * Created by mmitis on 31.08.15.
 */
var exec = require('child_process').exec,
    q = require('q'),
    jsdiff = require('diff'),
    fs = require('fs');

/**
 * Differ Class = use to get dumps of the database, manage them and look for differences
 * @param temproraryFolderName
 * @constructor
 */
var Differ = function (temproraryFolderName){
    this.temproraryFolderName = temproraryFolderName.toString();
    this.createTemporary();
};

/**
 * Creates temporary folder for the files
 * @returns {*|promise}
 */
Differ.prototype.createTemporary = function (){
    var deferred = q.defer(),
        that = this;
    fs.exists(that.temproraryFolderName, function(exists){
        if(exists){
            fs.rmdirSync(that.temproraryFolderName);
        }
        fs.mkdir(that.temproraryFolderName, function(){
            deferred.resolve(exists);
        });
    });
    return deferred.promise;
};

Differ.prototype.getyTemporaryFolder = function (){
    return this.temproraryFolderName;
};

/**
 * Make database dump to the selected file and call callback with the data dumped;
 * @param filename {String} file desctination for the dump with the filename
 * @param database {Object} settings for the database connection
 * @param database.user {String} name of the username
 * @param database.password {String} password for the user to db
 * @param database.location {String} url or IP address to the db
 * @param database.db {String} name of the db to dump
 * @return promise with result
 * @requires pg_dump library
 */
Differ.prototype.getDump = function(filename, database ){
    var deferred = q.defer();
    var isWin = /^win/.test(process.platform);
    var systemCommands = {
        'windows' : 'SET PGPASSWORD="'+ database.password +'"; pg_dump -h ' + database.location + ' -U ' +
                    database.user + ' -s -n '+ database.schema +' -f ' + filename + ' '+ database.db +';',
        'bash'    : 'export PGPASSWORD="'+ database.password +'"; pg_dump -h ' + database.location + ' -U ' +
                    database.user + ' -s -n '+ database.schema +' -f ' + filename + ' '+ database.db +'; unset PGPASSWORD;'
    };
    exec(isWin ? systemCommands.windows : systemCommands.bash,
        function (error , stdout, stderr) {
            if (error !== null || stderr !== '') {
                deferred.reject(stderr);
            } else {
                fs.readFile(filename, 'utf-8', function(err, fd) {
                    deferred.resolve(fd);
                });
            }
        });
    return deferred.promise;
};

/**
 * Removes folder with the temporary files (clean up)
 * @returns {promise}
 */
Differ.prototype.utilize = function () {
    var deferred = q.defer();
    fs.rmdirSync('/' + this.temproraryFolderName);
    return deferred.promise;
};

/**
 * Compares two input string streams and returns promise with
 * @param string_1 {string} first input string
 * @param string_2 {string} second input string
 * @return {promise} promise with data with changes
 */
Differ.prototype.checkDifference = function (string_1, string_2){
    var deferred = q.defer();
    deferred.resolve(jsdiff.diffChars(string_1, string_2));
    return deferred.promise;
};

/**
 * Make the rollback of the database changes
 * @param dbOld {string} old database file
 * @param dbNew {string} new database file
 * @param fileRollback {string} filename of the file to save backup rollback
 */
Differ.prototype.makeRollback = function (dbOld, dbNew, fileRollback){
    var deferred = q.defer();
    exec('java -jar ./externals/apgdiff-2.4.jar '+ dbNew +' '+ dbOld +' > '+ fileRollback +';',
        function (error , stdout, stderr) {
            if (error !== null || stderr !== '') {
                deferred.reject(stderr);
            } else {
                fs.readFile(fileRollback, 'utf-8', function(err, fd) {
                    deferred.resolve(fd);
                });
            }
    });
    return deferred.promise;
};
/**
 * Make the rollback of the database changes
 * @param dbOld {string} old database file
 * @param dbNew {string} new database file
 * @param fileDiff {string} filename of the file to save backup rollback
 */
Differ.prototype.makeDifferences = function (dbOld, dbNew, fileDiff){
    var deferred = q.defer();
    exec('java -jar ./externals/apgdiff-2.4.jar '+ dbOld +' '+ dbNew +' > '+ fileDiff +';',
        function (error , stdout, stderr) {
            if (error !== null || stderr !== '') {
                deferred.reject(stderr);
            } else {
                fs.readFile(fileDiff, 'utf-8', function(err, fd) {
                    deferred.resolve(fd);
                });
            }
        });
    return deferred.promise;
};
/**
 *
 * @param string_new {string} new database dump string
 * @param string_old {string} old database dump string
 *
 * @returns {*|promise}
 */
Differ.prototype.getFlowByStrings = function(string_new, string_old){
    var deferred = q.defer();
    return deferred.promise;
};

exports.Differ = Differ;