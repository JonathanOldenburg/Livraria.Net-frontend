function request(method, url, data, fnSucess, fnError) {
    return $.ajax({
        url: appConfig.backendContextPath+"/api"+url,
        type: method,
        data,
        success: data => {
            if (fnSucess)
                fnSucess(data);
        },
        error: data => {
            if (fnError)
                fnError(data);
        }
    });
}

function fillTable(data) {
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            $("#dataTable tbody").append(toTableRow(row));
        }
    } else {
        $("#dataTable tbody").append(toTableRow(data));
    }
}

function editRecord(data) {
    $("#hdnId").val(data.Id);
    $("#edtName").val(data.Name);
    $("#dlgCadastro").modal("show");
}

function toTableRow(data) {
    if (data.Id && data.Name) {
        return  "<tr>"+
        "    <td>"+data.Id+"</td>"+
        "    <td>"+data.Name+"</td>"+
        "    <td><button class='btn' onclick='editRecord("+JSON.stringify(data)+")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button></td>"+
        "    <td><button class='btn btn-danger' onclick='deleteRecord("+data.Id+")'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></button></td>"+
        "</tr>";
    }
    return "";
}

function formToData(selector) {
    let obj = {};

    $(selector).serializeArray().forEach(element => {
        obj[element.name] = element.value;
    });

    return obj;
}

function refresh() {
    $("#dataTable tbody").empty();
    request(
        "GET",
        "/Book",
        undefined,
        data => fillTable(data),
        data => console.log(data)
    );
}

function deleteRecord(id) {
    request("DELETE", "/Book/"+id, null, () => refresh());
}

$(document).ready(() => {
    refresh();

    $("#btnNew").click(e => { 
        e.preventDefault();
        editRecord({
            Id: null,
            Name: null
        });
    });

    $("#frmRecord").submit(e => {
        e.preventDefault();
        let method = $("#hdnId").val() ? "PUT" : "POST";
        let data = formToData("#frmRecord");
        request(method,
            "/Book",
            data,
            () => refresh());
        $("#dlgCadastro").modal("hide");
    });
});