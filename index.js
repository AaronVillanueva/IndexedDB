/* Mini Proyecto 1: IndexedDB
 Aaron Tonatiuth Villanueva Guzmán
 Clément Barbié
 Diana Paulina Bravo
 Jaime Orlando López Ramos */

var dbName = 'Videogame Store';

window.onload = function () {
    refreshTableData();
    registerEvents();
    initDb();
};

async function initDb() {
    var isDbCreated = await jsstoreCon.initDb(getDbSchema());
    if (isDbCreated) {
        console.log('db created');
    }
    else {
        console.log('db opened');
    }
}