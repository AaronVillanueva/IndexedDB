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
    }


    window.onload = function () {
        refreshTableData();
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
}