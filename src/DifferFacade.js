/**
 * Created by mmitis on 31.08.15.
 */
var exec = require('child_process').exec,
    q = require('q'),
    jsdiff = require('diff'),
    fs = require('fs'),
    Differ = require('./Differ').Differ;

var DifferFacade = function(){
    this.differ = new Differ('tmp_' + new Date().getTime() + '/' );
    this.fileMappings = {
        new_dump :      this.differ.getyTemporaryFolder() + 'db_new.sql',
        old_dump :      this.differ.getyTemporaryFolder() + 'db_old.sql',
        rollback :      this.differ.getyTemporaryFolder() + 'db_roll.sql',
        differences :   this.differ.getyTemporaryFolder() + 'db_diff.sql'
    }
};

DifferFacade.prototype.makeWholeFlow = function(database_new, database_old){
    q.all([
        //Get dumps
        this.differ.getDump(this.fileMappings.new_dump, database_new),
        this.differ.getDump(this.fileMappings.old_dump, database_old)
    ])
    //Make js diff
    .all([
        //Get rollback and diffs
        this.differ.makeRollback(this.fileMappings.old_dump, this.fileMappings.new_dump, this.fileMappings.rollback),
        this.differ.makeDifferences(this.fileMappings.old_dump, this.fileMappings.new_dump, this.fileMappings.differences)
    ])
    .all([
        //Read difference and rollback
        this.readFileToVariable(this.fileMappings.rollback)
    ])
    //.finally(this.differ.utilize);
};


DifferFacade.prototype.readFileToVariable = function(filename){
    fs.readFile(filename, 'utf-8', function(err, fd) {

        console.log(err, fd);
    });
};

new DifferFacade().makeWholeFlow(
    {
        location: '10.177.71.159',
        user: 'liveblog_storedb_rw',
        password: 'f608823b-66bf-4d14-8766-0d2e8b48fbc0',
        schema : 'api',
        db: 'liveblog_storedb_dev'
    },
    {
        location: '10.177.71.67',
        user: 'liveblog_storedb_rw',
        password: 'f608823b-66bf-4d14-8766-0d2e8b48fbc0',
        schema : 'api',
        db: 'liveblog_storedb'
    }
);