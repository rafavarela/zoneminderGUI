// var dominio = "http://zm.app/";
var dominio = "http://192.168.1.66/";

window.onload = function () 
{    
    var url = window.location.href;    
    var idMonitor = "";
    if (url.indexOf("formularioMonitor") > -1) {
        
        listarServidores();  // llenado del combo de servidores

        if (hayParametros(url)) {
            // Editar registro
            idMonitor = obtenerIdMonitor(url);
            obtenerMonitor(idMonitor);
            document.getElementById("btnGuardarMonitor").onclick = function () {  
                // Editar registro
                // alert('editar');
                idMonitor = obtenerIdMonitor(url);
                editarMonitor(idMonitor);
            }
        } else {
            // Adicionar registro
            actualizarMetodos(); // llenado del combo de metodos remotos
            
            document.getElementById("btnGuardarMonitor").onclick = function () {  
                // Adicionar registro
                // alert('adicionar');                
                if (validarEntradas()) agregarMonitor();
            }
        }
    } else {
        // es el index (Se deben listar los monitores)
        var url = dominio + "zm/api/monitors.json";
        requestServer(url, "get", mostrarMonitores);
    }

    // Código para controlar los tabs //
    var menuItems = document.querySelectorAll('#menuTabs>li');
    for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener("click", function(){
            // occulting divs - removing .active class
            var tabs = document.querySelectorAll('.tab-content>.tab-pane');
            for (var k = 0; k < tabs.length; k++) {
                tabs[k].className = "tab-pane";
            }
            // removing .active from menu itens
            for (var j = 0; j < menuItems.length; j++) {
                menuItems[j].className = "";
            }
            // setting .active in clicked item
            this.className = "active";
            // getting target id
            var linkTab = this.getElementsByTagName("A")[0].id;
            // showing the selected tab div
            var tab = document.querySelectorAll('.tab-content>#'+linkTab)[0];
            tab.className = "tab-pane active";
        });
    };
}

function hayParametros(url) 
{
    return (url.indexOf("?id=") > -1)
}

function obtenerIdMonitor(url) 
{
    var posId = url.indexOf("?id=") + 4;
    var id = url.substring(posId);

    if (id.indexOf("#") >-1) {
        id = id.substring(0, id.indexOf("#"));
    }
    
    return id;
}

function requestServer(url, metodo, funcionCallBack, texto) 
{
    var xhr = new XMLHttpRequest();

    // Según el depurador de Firefox, primero hay que abrir la conexion y 
    // después configurar el content-type
    xhr.open(metodo, url);

    // 05/abril/2017. Si el metodo es POST, establecer  
    // Content-Type en application/x-www-form-urlencoded 
    // || metodo == "put"
    if (metodo == "post")  {
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8;');
    }
    if (metodo == "put")  {
        xhr.setRequestHeader('Content-Type','text/plain; charset=UTF-8;');
        texto = "Monitor[Name]=test1";
    }
    
    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            funcionCallBack(xhr.responseText);
        }
    }
    if (metodo == "get") xhr.send();
    else {
        // post o cualquier otro verbo
        console.log(texto);
        if (texto != null && texto != "") xhr.send(texto);
    }
}

function mostrarMonitores(respuestaTexto) 
{
    var objMonitores = JSON.parse(respuestaTexto);

    // Encabezado de la tabla
    var html = "";
    html += "<div class='panel panel-primary'>";
    html += "<div class='panel-heading'>Monitores</div>";
    html += "<div class='panel-body'>";
    html += "<div id='divContenido'>";    
    html += "<table class='table table-hover table-condensed table-bordered'><thead><tr><thead>";
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

    // Registros
    for(var i = 0; i < objMonitores.monitors.length; i++) {        
        html += "<tr>";
        html += "<td>" + objMonitores.monitors[i].Monitor.Name + "</td>";
        html += "<td>" + objMonitores.monitors[i].Monitor.Function + "</td>";
        html += "<td>" ;
        html += "<a href='formularioMonitor.html?id=";
        html += objMonitores.monitors[i].Monitor.Id;
        html += "'>";
        html += objMonitores.monitors[i].Monitor.Host + "</a></td>";
        html += "</tr>";
    }
    html += "</tbody></table>";

    html += "</div>"; // divContenido
    html += "</div>"; // div class='panel-body'
    html += "<div class='panel-footer'>";
    // El espacio al final de la siguiente linea se coloca para que no se peguen los botones
    html += "<button type='button' class='btn btn-primary' onclick='location.reload(true);'>Refrescar</button> "; 
    html += "<a href='formularioMonitor.html' class='btn btn-primary'>Agregar monitor</a>";
    html += "</div>"; // div class='panel-footer'
    html += "</div>"; // div class='panel panel-primary

    // console.log(html);
    document.getElementById("contenidoModulo").innerHTML = html;
}

function validarEntradas() 
{
    var mensaje = "";
    var MonitorName = document.getElementById("Monitor[Name]").value;     

    if (MonitorName == "") {
        mensaje += "<li>Falta digitar el monitor</li>";
    } else {
        if (MonitorName.search( /[^\w-]/ ) >= 0) {
            mensaje += "<li>Los nombres sólo pueden contener carácteres alfanuméricos además de guiones y guiones bajos</li>";
        }
    }  
    if (mensaje != "") {
        document.getElementById("spnMensaje").innerHTML = "<ol>" + mensaje + "</ol>";
    }

    return (mensaje == "");    
}

/* Los campos y los valores de los campos deben ser codificados
   y tambien delimitados por el simbolo & */
function agregarParametro(sParams, sParamName, sParamValue) 
{
    if (sParams.length > 0) {
        sParams += "&";
    }
    return sParams  + encodeURIComponent(sParamName) + "=" 
                    + encodeURIComponent(sParamValue);
}

function agregarMonitor () 
{
    var url = dominio + "zm/api/monitors.json";
    var parametros = "";
    
    var MonitorName     = document.getElementById("Monitor[Name]").value;
    var MonitorServerId = document.getElementById("Monitor[ServerId]").value;
    var MonitorType     = document.getElementById("Monitor[Type]").value;
    var MonitorFunction = document.getElementById("Monitor[Function]").value;
    var MonitorEnabled  = document.getElementById("Monitor[Enabled]").checked * 1;
    var MonitorProtocol = document.getElementById("Monitor[Protocol]").value;
    var MonitorMethod   = document.getElementById("Monitor[Method]").value;
    var MonitorHost     = document.getElementById("Monitor[Host]").value;
    var MonitorPort     = document.getElementById("Monitor[Port]").value;
    var MonitorPath     = document.getElementById("Monitor[Path]").value;
    var MonitorColours  = document.getElementById("Monitor[Colours]").value;
    var MonitorWidth   = document.getElementById("Monitor[Width]").value;
    var MonitorHeight   = document.getElementById("Monitor[Height]").value;

    parametros = agregarParametro(parametros, "Monitor[Name]", MonitorName);
    parametros = agregarParametro(parametros, "Monitor[ServerId]", MonitorServerId);
    parametros = agregarParametro(parametros, "Monitor[Type]", MonitorType);
    parametros = agregarParametro(parametros, "Monitor[Function]", MonitorFunction);
    parametros = agregarParametro(parametros, "Monitor[Enabled]", MonitorEnabled);
    parametros = agregarParametro(parametros, "Monitor[Protocol]", MonitorProtocol);
    parametros = agregarParametro(parametros, "Monitor[Method]", MonitorMethod);
    parametros = agregarParametro(parametros, "Monitor[Host]", MonitorHost); // "admin:admin@192.168.220.120"
    parametros = agregarParametro(parametros, "Monitor[Port]", MonitorPort);
    parametros = agregarParametro(parametros, "Monitor[Path]", MonitorPath);
    parametros = agregarParametro(parametros, "Monitor[Colours]", MonitorColours);
    parametros = agregarParametro(parametros, "Monitor[Width]", MonitorWidth);
    parametros = agregarParametro(parametros, "Monitor[Height]", MonitorHeight);

    requestServer(url, "post", mostrarResultadoGrabar, parametros);
}

function mostrarResultadoGrabar(rpta) 
{
    if (rpta.indexOf("Undefined index: Type") > -1) rpta = "";

    if (rpta == "") {
        // document.getElementById("spnMensaje").innerHTML = "Registro guardado en la base de datos!";
        window.location.replace("index.html");
    } else  {
        document.getElementById("spnMensaje").innerHTML = rpta;
    }
}

function listarServidores() 
{
    var url = dominio + "zm/index.php?view=options&tab=servers";
    requestServer(url, "get", obtenerServidores);    
}

function obtenerServidores(respuestaTexto) 
{
    var html = '<option value="" selected="selected">Ninguno</option>';

    var longitud_tag_tbody_inicio = 7;
    var longitud_tag_tbody_fin = 8;
    var posIni = respuestaTexto.indexOf("<tbody>") + longitud_tag_tbody_inicio;
    var posFin = respuestaTexto.indexOf("</tbody>") - longitud_tag_tbody_fin;

    var tbody = respuestaTexto.substring(posIni, posFin);

    var filas = tbody.split("<tr>");
    var columnas = "";
    var posIniId, posFinId, idServidor, posIniNombre, posFinNombre, nombreServidor;

    for (i = 1; i < filas.length; i++) {       
        columnas = filas[i].split("<td ");
        
        posIniId = columnas[1].indexOf('id=') +  3; // longitud de 'id='
        posFinId = columnas[1].indexOf('" onclick');
        idServidor = columnas[1].substring(posIniId, posFinId);

        posIniNombre = columnas[1].indexOf(';">') +  3; // longitud de ';">'
        posFinNombre = columnas[1].indexOf('</a>');
        nombreServidor = columnas[1].substring(posIniNombre, posFinNombre);        
 
        html += '<option value="';
        html += idServidor;
        html += '">';
        html += nombreServidor;
        html += '</option>';

    }   
    
    document.getElementById("Monitor[ServerId]").innerHTML = html;
}


function actualizarMetodos()
{
    var html = '';
    var MonitorProtocol = document.getElementById("Monitor[Protocol]").value;

    if (MonitorProtocol == 'http') {
        html += '<option value="simple">Simple</option>';
        html += '<option value="regexp">Regexp</option>';
    } else {
        html += '<option value="rtpUni">RTP/Unicast</option>';
        html += '<option value="rtpMulti">RTP/Multicast</option>';
        html += '<option value="rtpRtsp">RTP/RTSP</option>';
        html += '<option value="rtpRtspHttp">RTP/RTSP/HTTP</option>';
    }
    document.getElementById("Monitor[Method]").innerHTML = html;
}

function obtenerMonitor(idMonitor) 
{
    var url = dominio + "zm/api/monitors/" + idMonitor + ".json";
    requestServer(url, "get", llenarValoresMonitor);
}

function llenarValoresMonitor(respuestaTexto) 
{
    var objMonitor = JSON.parse(respuestaTexto);
        
    var Monitor = objMonitor.monitor.Monitor;
    document.getElementById("Monitor[Name]").value = Monitor.Name;
    document.getElementById("Monitor[ServerId]").value = Monitor.ServerId;
    document.getElementById("Monitor[Type]").value = Monitor.Type;
    document.getElementById("Monitor[Function]").value = Monitor.Function;
    document.getElementById("Monitor[Enabled]").checked = Monitor.Enabled * 1; // Para que el valor se vuelva numerico
    document.getElementById("Monitor[Protocol]").value = Monitor.Protocol;
    actualizarMetodos(); // Actualizar los valores del combo de metodos en base al protocolo
    document.getElementById("Monitor[Method]").value = Monitor.Method;
    document.getElementById("Monitor[Host]").value = Monitor.Host;
    document.getElementById("Monitor[Port]").value = Monitor.Port;
    document.getElementById("Monitor[Path]").value = Monitor.Path;
    document.getElementById("Monitor[Colours]").value = Monitor.Colours;
    document.getElementById("Monitor[Width]").value = Monitor.Width;
    document.getElementById("Monitor[Height]").value = Monitor.Height;
}

function editarMonitor(idMonitor) 
{
    
    var url = dominio + "zm/api/monitors/" + idMonitor + ".json";
    
    // alert("url: "+url);
    // document.getElementById("spnMensaje").innerHTML = "url: "+url;

    var parametros = "";
    parametros = agregarParametro(parametros, "Monitor[Name]", document.getElementById("Monitor[Name]").value);

    // document.getElementById("spnMensaje").innerHTML = "parametros: "+parametros;

    requestServer(url, "put", mostrarResultadoGrabar, parametros);    
}

/*
function actualizarMonitor(respuestaTexto)
{

}
*/