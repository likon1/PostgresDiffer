/**
 * Created by mmitis on 31.08.15.
 */
var exec = require('child_process').exec;

var Differ = function (){};

    /**
     * Make database dump to the selected file and call callback with the data dumped;
     * @param location {String} file desctination for the dump with the filename
     * @param database {Object} settings for the database connection
     * @param database.user {String} name of the username
     * @param database.password {String} password for the user to db
     * @param database.location {String} url or IP address to the db
     * @param database.db {String} name of the db to dump
     * @param database.file {String} file location where dump will be saved
     * @param callback {function} executes with the data param when finished
     * @requires pg_dump library
     */
Differ.prototype.getDump = function(location , database , callback){

    var isWin = /^win/.test(process.platform);

    var systemCommands = {

        'windows' : 'SET PGPASSWORD="'+ database.password +'" | pg_dump -h ' + database.location + ' -U ' +
                    database.user + ' -s -n '+ database.schema +' -f ' + location + ' '+ database.db +';',
        'bash'    : 'EXPORT PGPASSWORD="'+ database.password +'" | pg_dump -h ' + database.location + ' -U ' +
                    database.user + ' -s -n '+ database.schema +' -f ' + location + ' '+ database.db +'; unset PGPASSWORD;'
    };

    exec(isWin ? systemCommands.windows : systemCommands.bash,
        function (error , stdout, stderr) {
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }

        });
};
//var link = 'postgres://lik0n_knpiapi:knpiapi@95.211.178.6/lik0n_knpiapi';


new Differ().getDump( 'file.sql', {
    location: '10.177.71.53',
    user: 'jes_rdbs_rw',
    password: '1a885eec-e0a3-4dd1-a779-571f48a1de4d',
    schema : 'api',
    db: 'social_jesdb_dev'

});