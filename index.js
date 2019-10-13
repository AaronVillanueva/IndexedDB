/* Mini Proyecto 1: IndexedDB
 Aaron Tonatiuth Villanueva Guzmán
 Clément Barbié
 Diana Paulina Bravo
 Jaime Orlando López Ramos */

var dbName = 'Videogame Store';
function getDbSchema() {
    var tblPRODUCT = {
        name: 'PRODUCT',
        columns: {
            id: {primaryKey: true, autoIncrement: true}
        }
    };
    var tblVIDEOGAME={
        name:'VIDEOGAME',
        columns:{
            id:{primaryKey: true, autoIncrement: true},
            year:{dataType: "int"},
            publisher:{dataType: "string"},
            genre:{dataType: "string"}


        }
    };
    var db={
        name: dbName,
        tables: [tblVIDEOGAME]
    }
    return db;
}

var jsstoreCon = new JsStore.Instance(new Worker("scripts/jsstore.worker.js"));

async function initJsStore() {
    var database = getDbSchema();
    const isDbCreated = await connection.initDb(database);
    if(isDbCreated===true){
        console.log("db created");
        // here you can prefill database with some data
    }
    else {
        console.log("db opened");
    }
}


window.onload = function () {
    /*refreshTableData();*/
    registerEvents();
    initDb();
};

async function initDb() {
    var isDbCreated = await jsstoreCon.initDb(getDbSchema());
    if (isDbCreated) {
        console.log('db created');
    } else {
        console.log('db opened');
    }
}