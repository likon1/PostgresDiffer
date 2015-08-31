/**
 * Created by mmitis on 31.08.15.
 */
import exec from 'child_process';

class Differ {

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
     getDump(location , database , callback){
        let child = child_process.exec('cat *.js bad_file | wc -l',
            function (error , stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    }
}
var link = 'postgres://lik0n_knpiapi:knpiapi@95.211.178.6/lik0n_knpiapi';