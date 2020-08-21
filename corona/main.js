var loadedData = "";
var count = 0;
//after initial side loading Data will be loaded
loadData();

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
        var labels = [];
        var data = [];


        //Iteration for Dataset Times
        for (var i = 0; i < Object.keys(loadedData).length; i++) {
            labels.push(loadedData[i].time);
            data.push(loadedData[i].AktuellInfizierte);
        }

        console.log(loadedData[Object.keys(loadedData).length -1]);

        addDataToDiv(loadedData[Object.keys(loadedData).length -1]);

        var myChartObject = $("#myChart");
        var chart = new Chart(myChartObject, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "CoronaZahlen in Österreich",
                    backgroundColor: "Blue",
                    data: data,
                    pointRadius: 0,
                }],
                options: {
                    legend: {
                        display: false
                    },
                    responsive: false,
                    maintainAspectRatio: false,
                    
                }
            }
        });
    }


    //Create Chart with the last Data inserted
    function addDataToDiv(data) {
        var str = "";
        str +="<div class='data_wrap'>"
        str += "<div class='data1'><div class='div_header'>Letztes Datum</div>"+data.time+"</div>"
        str += "<div class='data2'><div class='div_header'>Gesamtinfiziert</div>"+data.GesamtInfizierte+"</div>"
        str += "<div class='data3'><div class='div_header'>Genesen</div>"+data.Genesen+"</div>"
        str += "<div class='data4'><div class='div_header'>Todesfälle</div>"+data.Todesfälle+"</div>"
        str += "<div class='data5'><div class='div_header'>Aktuell Infiziert</div>"+data.AktuellInfizierte+"</div>"
        str +="</div>"
        $('#canvasdiv').prepend(str);
    }


}


