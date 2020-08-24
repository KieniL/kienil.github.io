var loadedData = "";
var count = 0;
//after initial side loading Data will be loaded
loadData();


function highlight_row() {
    var table = document.getElementsByClassName('content-table')[0];
    var cells = table.getElementsByTagName('td');

    for (var i = 0; i < cells.length; i++) {
        // Take each cell
        var cell = cells[i];
        // do something on onclick event for cell
        cell.onclick = function () {
            // Get the row id where the cell exists
            var rowId = this.parentNode.rowIndex;

            var rowsNotSelected = table.getElementsByTagName('tr');
            for (var row = 0; row < rowsNotSelected.length; row++) {
                rowsNotSelected[row].style.backgroundColor = "";
                rowsNotSelected[row].classList.remove('selected');
            }
            var rowSelected = table.getElementsByTagName('tr')[rowId];
            rowSelected.style.backgroundColor = "#ffff99";
            rowSelected.className += " selected";
            var id = parseInt(rowsNotSelected.length) -1 - rowId;
            chart.setSelection([{row: id, column: 1}]);
        }
    }

}

function highlight_row_from_chart(id){
    var table = document.getElementsByClassName('content-table')[0];
    var rowId = id;

    var rowsNotSelected = table.getElementsByTagName('tr');
    for (var row = 0; row < rowsNotSelected.length; row++) {
        rowsNotSelected[row].style.backgroundColor = "";
        rowsNotSelected[row].classList.remove('selected');
    }
    var rowSelected = table.getElementsByTagName('tr')[rowId];
    rowSelected.style.backgroundColor = "#ffff99";
    rowSelected.className += " selected";

    rowSelected.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}


function loadData() {
    //URL for Request
    var URL = "https://corona-vso6dwhtwa-ew.a.run.app/data";
    //var URL = "http://localhost:8080/data";

    $.getJSON({
        url: URL,
        success: function (data) {
            loadedData = data;
            drawChart();
        },
        error: function (err) {
            var str = "Daten konnten nicht geladen werden";
            alert(str);
            console.log(err);
            loadedData = null;
        }

    });

}

function drawChart() {
    //createDivAndCanvas();
    if (loadedData == null) {
        var str = "Daten sind leer und müssen neu geladen werden";
        alert(str);
        console.log(str);
    }else{
        
        addDataToDiv(loadedData[Object.keys(loadedData).length -1]);
        createTableFromData(loadedData);

        createChart(loadedData);
        
    }
    function createChart(jsonData) {
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;

        function drawChart() {

            function selectHandler() {
                var selectedItem = chart.getSelection()[0];
                if (selectedItem) {
                    highlight_row_from_chart(Object.keys(loadedData).length - selectedItem.row);
                }
              }
      
            var data = new google.visualization.DataTable();
            data.addColumn('date', 'time');
            data.addColumn('number', 'Infizierte');

            //Convert to a value array
            jsonData = Object.values(jsonData);
            jsonData.forEach(function (row) {
                data.addRow([
                    new Date(row.time.replace(pattern,'$3-$2-$1')),
                    row.AktuellInfizierte
                ]);
            });

            var options = {
                title: 'Coronainfiziert in Österreich',
                curveType: 'function',
                legend: { position: 'bottom' },
                width: '100%',
                vAxis: {
                    title: 'Infiziert'
                },
                hAxis: {
                    title: 'Datum'
                },
                chartArea: {
                    // leave room for y-axis labels
                    width: '94%'
                }
            };
            chart = new google.visualization.LineChart(document.getElementById('canvasdiv'));

            google.visualization.events.addListener(chart, 'select', selectHandler);

            chart.draw(data, options);
      }
    }
}



//Create Div with the last Data inserted
function addDataToDiv(data) {
    var str = "";
    str += "<div class='data1'><div class='div_header'>Letztes Datum</div>"+data.time+"</div>"
    str += "<div class='data2'><div class='div_header'>Gesamtinfiziert</div>"+data.GesamtInfizierte+"</div>"
    str += "<div class='data3'><div class='div_header'>Genesen</div>"+data.Genesen+"</div>"
    str += "<div class='data4'><div class='div_header'>Todesfälle</div>"+data.Todesfälle+"</div>"
    str += "<div class='data5'><div class='div_header'>Aktuell Infiziert</div>"+data.AktuellInfizierte+"</div>"
    $('#last_data_wrap').prepend(str);
}

function createTableFromData(data){
    var str = "";
    str +="<table class='content-table'><thead>";
    str +="<tr><td>Datum</td><td>Täglich Neu</td><td>Genesen</td><td>Gestorben</td><td>Gesamt Infiziert</td><td>Aktuell Infiziert</td></tr></thead><tbody>";
    for (i = Object.keys(data).length - 1; i >= 0 ; i--) {
        str += "<tr><td>"+data[i].time+"</td><td>"+data[i]["tägliche Erkrankungen"]+"</td><td>"+data[i].Genesen+"</td><td>"+data[i]["Todesfälle"]+"</td><td>"+data[i]["GesamtInfizierte"]+"</td><td>"+data[i]["AktuellInfizierte"]+"</td></tr>";
      } 
    str +="</tbody></table>";
    $('#tablediv').append(str);

    highlight_row();
}
