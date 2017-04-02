window.onload = function () {

    var url = "http://zm.app/zm/api/monitors.json";
    var campos = ["Name", "Function", "Host"];
    get(url, campos);
}

function get(url, campos) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            mostrarLista(xhr.responseText, campos);
        }
    }
    xhr.send();
}

function mostrarLista(rpta, campos) {
    // var contenido = "";
    // console.log(rpta);
    var objMonitores = JSON.parse(rpta);
    // console.log(objMonitores);

    // Encabezado de la tabla
    var html = "";
    html =  "<table class='table table-hover table-condensed table-bordered'><thead><tr><thead>";
    html += "<th>Nombre</th>";
    html += "<th>Función</th>";
    html += "<th>Origen</th>";
    /*
    html += "<th>Eventos</th>";
    html += "<th>Hora</th>";
    html += "<th>Día</th>";
    html += "<th>Semana</th>";
    html += "<th>Mes</th>";
    html += "<th>Archivado</th>";
    html += "<th>Zonas</th>";
    html += "</tr></thead><tbody>";
    */
    html += "</tr></thead><tbody>";

    var nCampos = campos.length;
    // Registros
    for(var i = 0; i < objMonitores.monitors.length; i++) {
        // console.log(objMonitores.monitors[i].Monitor.Id);
        html += "<tr>";
        html += "<td>" + objMonitores.monitors[i].Monitor.Name + "</td>";
        html += "<td>" + objMonitores.monitors[i].Monitor.Function + "</td>";
        html += "<td>" + objMonitores.monitors[i].Monitor.Host + "</td>";
        html += "</tr>";
    }
    html += "</tbody></table>";

/*
    var valor;
    //var a = ["a", "b", "c"];
    for (valor of objMonitores) {
        console.log(valor);
    }
*/
    document.getElementById("divContenido").innerHTML = html;
}

