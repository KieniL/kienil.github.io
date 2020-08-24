var loadedData = "";
var count = 0;
//after initial side loading Data will be loaded
loadData();

dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

datePattern = /(\d{2})\.(\d{2})\.(\d{4})/;


/*
Returns 1 (nur infiziert),2 (nur genesen),3(nur gestorben) or 4 (7 Tage Trend) or Alles */
$('.box').on('change', function() {
    //Draw the new chart
    drawChart();
});


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
            addDataToDiv(loadedData[Object.keys(loadedData).length -1]);
            createTableFromData(loadedData);
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
        createChart(loadedData, $('.box').find(":selected").val());
        
    }


    function createChart(jsonData, chartSelect) {

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        
        title = "";
        function drawChart() {

            //Returns Data for different selections 1 (nur infiziert),2 (nur genesen),3(nur gestorben) or 4 (7 Tage Trend) or Alles */
            switch(chartSelect.toString()) {
                case "1":
                    // code block
                    var data = new google.visualization.DataTable();
                    data.addColumn('date', 'time');
                    data.addColumn('number', 'Infizierte');
                    //Convert to a value array
                    jsonData = Object.values(jsonData);
                    jsonData.forEach(function (row) {
                        //Add Annotation for 0 or 6 Month
                        var date = new Date(row.time.replace(datePattern,'$3-$2-$1'))
                        data.addRow([
                            date,
                            row.AktuellInfizierte        
                        ]);
                        
                    });
                    title = "Täglich Infizierte"
                    break;
                case "2":
                    var data = new google.visualization.DataTable();
                    data.addColumn('date', 'time');
                    data.addColumn('number', 'Genesen');

                    //Convert to a value array
                    jsonData = Object.values(jsonData);
                    jsonData.forEach(function (row) {
                        data.addRow([
                            new Date(row.time.replace(datePattern,'$3-$2-$1')),
                            row.Genesen
                        ]);
                    });
                    title = "Genesene";
                    break;
                case "3":
                    var data = new google.visualization.DataTable();
                    data.addColumn('date', 'time');
                    data.addColumn('number', 'Gestorben');

                    //Convert to a value array
                    jsonData = Object.values(jsonData);
                    jsonData.forEach(function (row) {
                        data.addRow([
                            new Date(row.time.replace(datePattern,'$3-$2-$1')),
                            row.Todesfälle
                        ]);
                    });
                    title = "Gestorben";
                    break;
                case "4":
                    var data = new google.visualization.DataTable();
                    data.addColumn('date', 'time');
                    data.addColumn('number', '7 Tage Trend Neu Infiziert');

                    //Convert to a value array
                    jsonData = Object.values(jsonData);
                    jsonData.forEach(function (row, i) {
                        row.GesamtInfizierte
                        var average = 0;
                        for(var j = 6; j >= 0; j--){
                            if( i - j >= 0){
                                average += jsonData[i -j]["tägliche Erkrankungen"]
                            }
                        }
                        data.addRow([
                            new Date(row.time.replace(datePattern,'$3-$2-$1')),
                            average / 7
                        ]);
                    });
                    title = "7 Tage Trend";
                    break;
                default:
                    var data = new google.visualization.DataTable();
                    data.addColumn('date', 'time');
                    data.addColumn('number', 'Infizierte');
                    data.addColumn('number', 'Genesen');
                    data.addColumn('number', 'Gestorben');

                    //Convert to a value array
                    jsonData = Object.values(jsonData);
                    jsonData.forEach(function (row) {
                        data.addRow([
                            new Date(row.time.replace(datePattern,'$3-$2-$1')),
                            row.AktuellInfizierte,
                            row.Genesen,
                            row.Todesfälle
                        ]);
                    });
                    title = "Alles";
                    break;
            }

            function selectHandler() {
                var selectedItem = chart.getSelection()[0];
                if (selectedItem) {
                    highlight_row_from_chart(Object.keys(loadedData).length - selectedItem.row);
                }
            }
            
            var options = {
                isStacked: true,
                legend: { position: 'bottom' },
                width: '100%',
                vAxis: {
                    title: title,
                    textPosition: 'in'
                },
                hAxis: {
                    title: 'Datum',
                    textPosition: 'in'
                },
                chartArea: {
                    top: 15,
                    left: 10,
                    right:10, 
                    bottom:20
                },
                colors: ['blue', '#3fc26b', '#f36daa']
            };
            chart = new google.visualization.AreaChart(document.getElementById('canvasdiv'));
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
        var date = new Date(data[i].time.replace(datePattern,'$3-$2-$1'));
        var month = parseInt(date.getMonth())+1
        str += "<tr><td>"+dayNames[date.getDay()].substring(0,3)+","+date.getDate()+"."+ month +"</td>"
        str += "<td>"+data[i]["tägliche Erkrankungen"]+"</td><td>"+data[i].Genesen+"</td><td>"+data[i]["Todesfälle"]+"</td><td>"+data[i]["GesamtInfizierte"]+"</td><td>"+data[i]["AktuellInfizierte"]+"</td></tr>";
      } 
    str +="</tbody></table>";
    $('#tablediv').append(str);

    highlight_row();
}
