

var jsstoreCon = new JsStore.Instance(new Worker("scripts/jsstore.worker.js"));

window.onload = function () {
    refreshTableData();
    registerEvents();
    initDb();
};

async function initDb() {
    var isDbCreated = await jsstoreCon.initDb(getDbSchema());
    if (isDbCreated) {
        console.log('db created. welcome to the videogame database');
    }
    else {
        console.log('db opened. welcome back to the videogame database');
    }
}

function getDbSchema() {
    var table = {
        name: 'Student',
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
    $('#btnAddStudent').click(function () {
        showFormAndHideGrid();
        console.log("btnAddStudent has been pressed");
    });
    $('#tblGrid tbody').on('click', '.edit', function () {
        var row = $(this).parents().eq(1);
        var child = row.children();
        var student = {
            id: row.attr('itemid'),
            name: child.eq(0).text(),
            idreq: child.eq(1).text(),
            country: child.eq(2).text(),
            city: child.eq(3).text()
        }
        refreshFormData(student);
        showFormAndHideGrid();
    });
    $('#tblGrid tbody').on('click', '.delete', function () {
        var result = confirm('Are you sure, you want to delete?');
        if (result) {
            var studentId = $(this).parents().eq(1).attr('itemid');
            deleteStudent(Number(studentId));
        }
    });
    $('#btnSubmit').click(function () {
        var studentId = $('form').attr('data-student-id');
        if (studentId) {
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
        from: 'Student'
    }).then(function (students) {
        students.forEach(function (student) {
            htmlString += "<tr ItemId=" + student.id + "><td>" +
                student.name + "</td><td>" +
                student.idreq + "</td><td>" +
                student.country + "</td><td>" +
                student.city + "</td><td>" +
                "<a href='#' class='edit'>Edit</a></td>" +
                "<td><a href='#' class='delete''>Delete</a></td>";
        })
        $('#tblGrid tbody').html(htmlString);
    }).catch(function (err) {
        console.error(err);
    })

}



async function addStudent() {
    var student = getStudentFromForm();
    var noOfDataInserted = await jsstoreCon.insert({
        into: 'Student',
        values: [student]
    });
    if (noOfDataInserted === 1) {
        refreshTableData();
        showGridAndHideForm();
    }
}

async function updateStudent() {
    var student = getStudentFromForm();
    var noOfDataUpdated = await jsstoreCon.update({
        in: 'Student',
        set: {
            name: student.name,
            idreq: student.idreq,
            country: student.country,
            city: student.city
        },
        where: {
            id: student.id
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
        from: 'Student',
        where: {
            id: id
        }
    });
    console.log(`${noOfStudentRemoved} students removed`);
    refreshTableData();
}

function getStudentFromForm() {
    var student = {
        id: Number($('form').attr('data-student-id')),
        name: $('#txtName').val(),
        idreq: $("input[name='optradio']").val(),
        country: $('#txtCountry').val(),
        city: $('#txtCity').val()
    };
    return student;
}

function showFormAndHideGrid() {
    $('#formAddUpdate').show();
    $('#tblGrid').hide();
}

function showGridAndHideForm() {
    $('#formAddUpdate').hide();
    $('#tblGrid').show();
}

function refreshFormData(student) {
    $('form').attr('data-student-id', student.id);
    $('#txtName').val(student.name);
    $(`input[name='optradio'][value=${student.idreq}]`)/*.val(student.idreq);*/.prop('checked', true);
    $('#txtCountry').val(student.country);
    $('#txtCity').val(student.city);
}