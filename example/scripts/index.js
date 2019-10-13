/*Based on the example provided by JsStore https://github.com/ujjwalguptaofficial/JsStore/tree/master/examples/Simple%20Example*/

var jsstoreCon = new JsStore.Instance(new Worker("scripts/jsstore.worker.js"));

window.onload = function () {
    refreshTableData();
    registerEvents();
    initDb();
};

async function initDb() {
    var isDbCreated = await jsstoreCon.initDb(getDbSchema());
    if (isDbCreated) {
        console.log('db created. welcome to the videogame database. based on the one provided as example by JsStore');
    }
    else {
        console.log('db opened. welcome back to the videogame database');
    }
}

function getDbSchema() {
    var table = {
        name: 'Videogame',
        columns: {
            id: { autoIncrement: true, primaryKey: true },
            name: { dataType: 'string' },
            country: {},
            city: {}
        }
    }

    var db = {
        name: 'My-Db',
        tables: [table]
    }
    return db;
}

function registerEvents() {
    $('#btnAddVideogame').click(function () {
        showFormAndHideGrid();
        console.log("btnAddStudent has been pressed");
    });
    $('#tblGrid tbody').on('click', '.edit', function () {
        var row = $(this).parents().eq(1);
        var child = row.children();
        var videogame = {
            id: row.attr('itemid'),
            name: child.eq(0).text(),
            idreq: child.eq(1).text(),
            country: child.eq(2).text(),
            city: child.eq(3).text()
        }
        refreshFormData(videogame);
        showFormAndHideGrid();
    });
    $('#tblGrid tbody').on('click', '.delete', function () {
        var result = confirm('Are you sure, you want to delete?');
        if (result) {
            var videogameID = $(this).parents().eq(1).attr('itemid');
            deleteStudent(Number(videogameID));
        }
    });
    $('#btnSubmit').click(function () {
        var videogameID = $('form').attr('data-student-id');
        if (videogameID) {
            updateStudent();
        }
        else {
            addStudent();
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
                videogame.country + "</td><td>" +
                videogame.city + "</td><td>" +
                "<a href='#' class='edit'>Edit</a></td>" +
                "<td><a href='#' class='delete''>Delete</a></td>";
        })
        $('#tblGrid tbody').html(htmlString);
    }).catch(function (err) {
        console.error(err);
    })

}



async function addStudent() {
    var videogame = getStudentFromForm();
    var noOfDataInserted = await jsstoreCon.insert({
        into: 'Videogame',
        values: [videogame]
    });
    if (noOfDataInserted === 1) {
        refreshTableData();
        showGridAndHideForm();
    }
}

async function updateStudent() {
    var videogame = getStudentFromForm();
    var noOfDataUpdated = await jsstoreCon.update({
        in: 'Videogame',
        set: {
            name: videogame.name,
            idreq: videogame.idreq,
            country: videogame.country,
            city: videogame.city
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

async function deleteStudent(id) {
    var noOfStudentRemoved = await jsstoreCon.remove({
        from: 'Videogame',
        where: {
            id: id
        }
    });
    console.log(`${noOfStudentRemoved} students removed`);
    refreshTableData();
}

function getStudentFromForm() {
    var videogame = {
        id: Number($('form').attr('data-student-id')),
        name: $('#txtName').val(),
        idreq: $("input[name='optradio']").val(),
        country: $('#txtCountry').val(),
        city: $('#txtCity').val()
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
    $('#txtCountry').val(videogame.country);
    $('#txtCity').val(videogame.city);
}