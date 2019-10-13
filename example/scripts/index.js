/*Based on the example provided by JsStore https://github.com/ujjwalguptaofficial/JsStore/tree/master/examples/Simple%20Example*/

var jsstoreCon = new JsStore.Instance(new Worker("scripts/jsstore.worker.js"));

/* Starting the webpage */
window.onload = function () {
    refreshTableData();
    registerEvents();
    initDb();
};

/* initial database creation/load*/
async function initDb() {
    var isDbCreated = await jsstoreCon.initDb(getDbSchema());
    if (isDbCreated) {
        console.log('db created. welcome to the videogame database. based on the one provided as example by JsStore');
    }
    else {
        console.log('db opened. welcome back to the videogame database');
    }
}

/* start DB tables */
function getDbSchema() {
    var table = {
        name: 'Videogame',
        columns: {
            id: { autoIncrement: true, primaryKey: true },
            name: { dataType: 'string' },
            price: {},
            category: {}
        }
    }

    var db = {
        name: 'My-Db',
        tables: [table]
    }
    return db;
}

/* button actions as well as the setup of the grid */
function registerEvents() {
    $('#btnAddVideogame').click(function () {
        showFormAndHideGrid();
        console.log("btnaddVideogame has been pressed");
    });
    $('#tblGrid tbody').on('click', '.edit', function () {
        var row = $(this).parents().eq(1);
        var child = row.children();
        var videogame = {
            id: row.attr('itemid'),
            name: child.eq(0).text(),
            idreq: child.eq(1).text(),
            price: child.eq(2).text(),
            category: child.eq(3).text()
        }
        refreshFormData(videogame);
        showFormAndHideGrid();
    });
    $('#tblGrid tbody').on('click', '.delete', function () {
        var result = confirm('Are you sure, you want to delete?');
        if (result) {
            var videogameID = $(this).parents().eq(1).attr('itemid');
            deleteVideogame(Number(videogameID));
        }
    });
    $('#btnSubmit').click(function () {
        var videogameID = $('form').attr('data-student-id');
        if (videogameID) {
            updateVideogame();
        }
        else {
            addVideogame();
        }
    });
    $('#btnCancel').click(function () {
        console.log("btnCancel has been pressed");
        showGridAndHideForm();

    });
}


//This function refreshes the table
function refreshTableData() {
    var htmlString = "";
    jsstoreCon.select({
        from: 'Videogame'
    }).then(function (videogames) {
        videogames.forEach(function (videogame) {
            htmlString += "<tr ItemId=" + videogame.id + "><td>" +
                videogame.name + "</td><td>" +
                videogame.idreq + "</td><td>" +
                videogame.price + "</td><td>" +
                videogame.category + "</td><td>" +
                "<a href='#' class='edit'>Edit</a></td>" +
                "<td><a href='#' class='delete''>Delete</a></td>";
        })
        $('#tblGrid tbody').html(htmlString);
    }).catch(function (err) {
        console.error(err);
    })

}


// DB action
async function addVideogame() {
    var videogame = getVideogameFromForm();
    var noOfDataInserted = await jsstoreCon.insert({
        into: 'Videogame',
        values: [videogame]
    });
    if (noOfDataInserted === 1) {
        refreshTableData();
        showGridAndHideForm();
    }
}

// DB action
async function updateVideogame() {
    var videogame = getVideogameFromForm();
    var noOfDataUpdated = await jsstoreCon.update({
        in: 'Videogame',
        set: {
            name: videogame.name,
            idreq: videogame.idreq,
            price: videogame.price,
            category: videogame.category
        },
        where: {
            id: videogame.id
        }
    });
    console.log(`data updated ${noOfDataUpdated}`);
    showGridAndHideForm();
    $('form').attr('data-student-id', null);
    refreshTableData();
    refreshFormData({});
}

// DB action
async function deleteVideogame(id) {
    var noOfStudentRemoved = await jsstoreCon.remove({
        from: 'Videogame',
        where: {
            id: id
        }
    });
    console.log(`${noOfStudentRemoved} students removed`);
    refreshTableData();
}

// get the data from the Form
function getVideogameFromForm() {
    var videogame = {
        id: Number($('form').attr('data-student-id')),
        name: $('#txtName').val(),
        idreq: $("input[name='optradio']").val(),
        price: $('#txtCountry').val(),
        category: $('#txtCity').val()
    };
    return videogame;
}

function showFormAndHideGrid() {
    $('#formAddUpdate').show();
    $('#tblGrid').hide();
}

function showGridAndHideForm() {
    $('#formAddUpdate').hide();
    $('#tblGrid').show();
}

function refreshFormData(videogame) {
    $('form').attr('data-student-id', videogame.id);
    $('#txtName').val(videogame.name);
    $(`input[name='optradio'][value=${videogame.idreq}]`)/*.val(student.idreq);*/.prop('checked', true);
    $('#txtCountry').val(videogame.price);
    $('#txtCity').val(videogame.category);
}