function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200 || httpRequest.status === 0) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}
var colorMap = {'black_coal': "#121212", 'distillate': '#F35020', 'gas_ccgt': '#FDB462', 'hydro': '#4582B4', 'wind': '#437607',
'rooftop_solar': 'yellow', 'pumps': '#88AFD0', 'exports': '#977AB1'}
var pieTotal;

let donutChartConfig = {
    title:{
        text: " ",
        y :210
    },
    legend:{
        enabled:false
    },
    labels: {
        enabled: false
    },
    chart: {
        //style:{filter:'alpha(opacity=10)',opacity:10,background:'transparent'},
        backgroundColor:"transparent",
        type: 'pie'
    },
    plotOptions: {
        pie: {
            shadow: false,
            animation: false,
            dataLabels:{
                enabled:false,
            },
            colors: [colorMap["black_coal"], colorMap["distillate"], colorMap['gas_ccgt'], colorMap['hydro'], colorMap['pumps'], colorMap['wind'], colorMap['exports']],
        }
    },
    tooltip: {
        enabled: false
    },
    series: [{
        name: 'category',
        size: '80%',
        innerSize: '50%',
        showInLegend:true,
        dataLabels: {
            enabled: false
        }
    }]
};


function plotDonut(x) {
    fetchJSONFile('springfield.json', function(data){
        dataAtX = new Array()
        for(i = 0; i < 7; i++) {
            elm = data[i];
            var newList = [];
            
            value = elm['history']['data'][1+x*6];

            newList.push(elm['fuel_tech']);
            newList.push(value);
            dataAtX.push(newList);
        }
        donutChartConfig['title']['text'] = pieTotal+"MW"
        donutChartConfig['series'][0]['data'] = dataAtX;
        Highcharts.chart("donut_chart", donutChartConfig);
    });
};



// editing over here !!!
function fillInTable(x) {
    fetchJSONFile('springfield.json', function(data) {
        var values = new Array();
        var categories = new Array();
        var prices = data[8];

        for(i = 0; i < 7; i++) {
            elm = data[i];
            value = elm['history']['data'][1+x*6];
            if (i == 4 || i == 6) {
                values.push(-value);
            } else {
                values.push(value);
            }
            categories.push(elm['fuel_tech']);
        }


        function sum(total, num) {
            return total + num;
        }
        //headlines
        table = document.getElementById("table_chart");

        var first_row = table.rows[0].cells;
        first_row[0].innerHTML = "Default";
        first_row[1].innerHTML = "Power (MW)";
        first_row[2].innerHTML = "Contribution (to demand)";
        first_row[3].innerHTML = "Av.Value ($/MWh)";
        //sources
        table.rows[1].cells[0].innerHTML = "Sources";
        pieTotal = Math.round(values.reduce(sum,0)-values[4]-values[6]);
        table.rows[1].cells[1].innerHTML = Math.round(values.reduce(sum,0)-values[4]-values[6]);
        table.rows[1].cells[2].innerHTML = "";
        table.rows[1].cells[3].innerHTML = "$" + parseFloat(prices['history']['data'][x]).toFixed(2);
        //net
        table.rows[10].cells[0].innerHTML = "Net";
        table.rows[10].cells[1].innerHTML = Math.round(values.reduce(sum,0));
        table.rows[10].cells[2].innerHTML = "";
        table.rows[10].cells[3].innerHTML = "";
        //wind
        //console.log(table.rows[2].cells[0]);
        //table.rows[2].cells[0][0].innerHTML = "";
        //console.log(table.rows[2]);
        //table.rows[2].cells[0].innerHTML = "Wind";
        table.rows[2].cells[1].innerHTML = Math.round(values[5]);
        table.rows[2].cells[2].innerHTML = parseFloat(values[5]/table.rows[10].cells[1].innerHTML*100).toFixed(1)+"%";
        table.rows[2].cells[3].innerHTML = "-";
        //hydro
        //table.rows[3].cells[0].innerHTML = "Hydro";
        table.rows[3].cells[1].innerHTML = Math.round(values[3]);
        table.rows[3].cells[2].innerHTML = parseFloat(values[3]/table.rows[10].cells[1].innerHTML*100).toFixed(1)+"%";
        table.rows[3].cells[3].innerHTML = "-";
        //gas
        //table.rows[4].cells[0].innerHTML = "Gas(CCGT)";
        table.rows[4].cells[1].innerHTML = Math.round(values[2]);
        table.rows[4].cells[2].innerHTML = parseFloat(values[2]/table.rows[10].cells[1].innerHTML*100).toFixed(1)+"%";
        table.rows[4].cells[3].innerHTML = "-";
        //distillate
        //table.rows[5].cells[0].innerHTML = "Distillate";
        table.rows[5].cells[1].innerHTML = parseFloat(values[1]).toFixed(2);
        table.rows[5].cells[2].innerHTML = parseFloat(values[1]/table.rows[10].cells[1].innerHTML*100).toFixed(4)+"%";
        table.rows[5].cells[3].innerHTML = "-";
        //black coal
        //table.rows[6].cells[0].innerHTML = "Black Coal";
        table.rows[6].cells[1].innerHTML = Math.round(values[0]);
        table.rows[6].cells[2].innerHTML = parseFloat(values[0]/table.rows[10].cells[1].innerHTML*100).toFixed(1)+"%";
        table.rows[6].cells[3].innerHTML = "-";

        //loads
        table.rows[7].cells[0].innerHTML = "Loads";
        if (values[4]==0 && values[6]==0){
            table.rows[7].cells[1].innerHTML  = "-";
        } else {
            table.rows[7].cells[1].innerHTML  = Math.round(values[4]) + Math.round(values[6]);
        };
        table.rows[7].cells[2].innerHTML = "";
        table.rows[7].cells[3].innerHTML = "";

        //exports
        //table.rows[8].cells[0].innerHTML = "Exports";
        if(values[6]==0) {
            table.rows[8].cells[1].innerHTML = "-";
            table.rows[8].cells[2].innerHTML = "-";
        } else {
            table.rows[8].cells[1].innerHTML = Math.round(values[6]);
            table.rows[8].cells[2].innerHTML = parseFloat(values[6]/table.rows[10].cells[1].innerHTML*100).toFixed(1)+"%";
        }
        table.rows[8].cells[3].innerHTML = "-";
        //pumps
        //table.rows[9].cells[0].innerHTML = "Pumps";
        if(values[4]==0) {
            table.rows[9].cells[1].innerHTML = "-";
            table.rows[9].cells[2].innerHTML = "-";
        } else {
            table.rows[9].cells[1].innerHTML = Math.round(values[4]);
            table.rows[9].cells[2].innerHTML = parseFloat(values[4]/table.rows[10].cells[1].innerHTML*100).toFixed(1)+"%";
        };
        table.rows[9].cells[3].innerHTML = "-";

        //renewable (wind + hydro)
        table.rows[11].cells[0].innerHTML = "Renewable";
        table.rows[11].cells[1].innerHTML = "";
        table.rows[11].cells[2].innerHTML = parseFloat(values[5]/table.rows[10].cells[1].innerHTML*100+values[3]/table.rows[10].cells[1].innerHTML*100).toFixed(1)+"%";
        table.rows[11].cells[3].innerHTML = "";




        // DOM editing data over here
    });
}

// top left line plot
let myConfig1 = {
    legend: {
        enabled:false
    },
    chart: {
        backgroundColor: "transparent",
        type: "area",
        width: 1200,
        height:400,
    },
    title: {
        align: "left",
        text: 'Generation MW',
    },
    
    plotOptions: {
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        }
    },
    yAxis: {
        tickInterval: 1000,
        max: 9000,
        min: -1000,
        title: {
            text: "Generation MW"
        },
        reversedStacks: true
    },

    tooltip: {
        //split: false,

        positioner: function () {
            return {
                // right aligned
                x: this.chart.chartWidth - this.label.width-100+100,
                y: 10 // align to title
            };
        },

        borderWidth: 0,
        //backgroundColor: 'none',
        pointFormat: '{point.total}',
        headerFormat: '',
        shadow: false,
        style: {
            fontSize: '20px'
        },


        formatter: function () {                                                                   
                //console.log("here is line 141");
                //console.log(this..x);
                var position = this.point.x;
                let toBar = document.getElementById("switchToBar");
                let toPie = document.getElementById("switchToPie");
                //time = global_time[position].slice(4,10) + "," + global_time[position].slice(16,21);
                //console.log(global_time[position]);
                document.getElementById("time_display").innerHTML = global_time[position].toString().slice(4,21);
                toBar.x = position;
                toPie.x = position;
                //console.log(toBar.x);
                if (toBar.on){
                    plotBar(position);
                } else {
                    plotDonut(position);
                }
                fillInTable(position);
                return this.total
                // Plot pie chart based on the x axis of the point.                                      
        },
        //shared: true,
    },

    xAxis: {
        tickInterval: 47,
        crosshair: true,
        tickmarkPlacement: "on",
        title: {
            enabled: false
        },
        events: {
            setExtremes: syncExtremes
        }
    }
};

document.getElementById("switchToPie").addEventListener("click", function() {
    let btn = document.getElementById("switchToPie");
    //console.log(btn);
    plotDonut(btn.x);
    btn.style.backgroundColor = "red";
    btn.on = true;
    let barBtn = document.getElementById("switchToBar");
    barBtn.on = false;
    barBtn.style.backgroundColor = "transparent";
});

document.getElementById("switchToBar").addEventListener("click", function() {
    let btn = document.getElementById("switchToBar");
    plotBar(btn.x);
    btn.style.backgroundColor = "red";
    btn.on = true;
    let pieBtn = document.getElementById("switchToPie");
    pieBtn.on = false;
    pieBtn.style.backgroundColor = "transparent";
});

let barChartConfig = {
    title:{
        text:""
    },
    legend: {
        enabled:false
    },
    chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        height: 200,
        width: 400
    },
    // title: {
    //     text: 'Browser market share, April, 2011'
    // },
    xAxis: {
        categories: ['Wind', 'Hydro', 'Gas(CCGT)', 'Distillate', 'Black Coal'],
        title: {
            text: null,
        }
    },
    yAxis:{
        title:{
            enabled: false,
            visible: false
        },
        labels: {
            enabled: false
        },
    },

    plotOptions: {
        bar: {
            shadow: false,
            animation: false,
            dataLabels:{
                enabled:true,
                formatter:function(){
                    return this.y + '%'
                }
            }
        }
    },

    series: [{
        name:""
        
    }]
};


function plotBar(x) {
    fetchJSONFile('springfield.json', function(data){
        function sum(total, num) {
            return total + num;
        }
        //console.log(data);
        dataAtX = new Array()
        dataAtX[0] = data[5]['history']['data'][1+x*6];
        dataAtX[1] = data[3]['history']['data'][1+x*6];
        dataAtX[2] = data[2]['history']['data'][1+x*6];
        dataAtX[3] = data[1]['history']['data'][1+x*6];
        dataAtX[4] = data[0]['history']['data'][1+x*6];
        total = dataAtX.reduce(sum,0);

        dataAtX[0] = {y: parseFloat((dataAtX[0]/total * 100).toFixed(1)), color: colorMap['wind']};
        dataAtX[1] = {y: parseFloat((dataAtX[1]/total * 100).toFixed(1)), color: colorMap['hydro']};
        dataAtX[2] = {y: parseFloat((dataAtX[2]/total * 100).toFixed(1)), color: colorMap['gas_ccgt']};
        dataAtX[3] = {y: parseFloat((dataAtX[3]/total * 100).toFixed(4)), color: colorMap["distillate"]};
        dataAtX[4] = {y: parseFloat((dataAtX[4]/total * 100).toFixed(1)), color: colorMap["black_coal"]};


        barChartConfig['series'][0]['data'] = dataAtX;
        //console.log(dataAtX)
        Highcharts.chart("donut_chart", barChartConfig);
    });
};



var global_time;


function plotJSONData() {
    fetchJSONFile('springfield.json', function(data){

        function buildTimeArr(start, end, interval) {
            var arr = new Array();
            var temp_dt = new Date(start);
            while (temp_dt <= end) {
                arr.push(new Date(temp_dt));
                temp_dt = new Date(temp_dt.valueOf() + 1000*60*interval);
            }
            return arr;
        }

        //sources start from 1571579700 (1:55 pm) with 5 mins interval and prices/temp start from 1571578200 (1:30 pm) with 30 mins interval
        //To align the data, we start from 2:00 (1571580000) and ends in 10/27/2019 1:30 pm
        solar_time_arr = buildTimeArr(1571580000*1000, 1572183000*1000, parseInt("30m"));

    
        var seriesData = data.slice(0,7).map(function(elm) {
            var obj = {};
            // the 7th data is solar, with 30ms interval, other data has 5ms interval, so we select one point every 6 ones.

            start_date = new Date(parseInt(elm['history']['start'])*1000);
            end_date = new Date(parseInt(elm['history']['last'])*1000);
            var inner_interval = parseInt(elm["history"]['interval']);
            time_arr = buildTimeArr(start_date, end_date, inner_interval);

            var dic_xy = {};
            time_arr.forEach((key, i) => dic_xy[key] = elm['history']["data"][i]);

            var time;
            var data_arr = new Array();
            for(time of solar_time_arr) {
                data_arr.push(dic_xy[time]);
            };
            obj['color'] = colorMap[elm['fuel_tech']];
            if (elm['fuel_tech'] == "exports" || elm['fuel_tech'] == "pumps") {
                obj['data'] = data_arr.map(value => -1 * value);
            } else {
                obj['data'] = data_arr;
            }
            
            obj['name'] = elm['fuel_tech'];

            return obj;
        });

        myConfig1['series'] = seriesData;
        //console.log(seriesData);
        global_time = solar_time_arr;
        category = []
        for (i = 0; i < solar_time_arr.length; i++) {
            category[i] = solar_time_arr[i].toString().slice(0,10);
        }

        //console.log(category);
        myConfig1['xAxis']['categories'] = category;

        Highcharts.chart("Generation_area_chart", myConfig1);
    });
};



// middle left plot
let myConfig2 = {
    legend: {
        enabled:false
    },
    chart: {
        backgroundColor: "transparent",
        type: "line",
        width:1200,
        height:200

    },
    title: {
        align: "left",
        text: 'Price $/MWh',
        
    },

    yAxis: {
        min:-100,
        max:300,
        title: {
            text: "Price $/MWh"
        }
    },
    plotOptions: {
        line: {
            step: "left",
            color: "red"
        },
        series: {
            label: {
                connectorAllowed: true
            }
        }
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    },

    tooltip: {

        positioner: function () {
            return {
                // right aligned
                x: this.chart.chartWidth - this.label.width,
                y: 10 // align to title
            };
        },
        borderWidth: 0,
        shadow: false,
        //background:"none",
        //followPointer: true,
        animation: false,
        shared: true
    },
    xAxis: {
        crosshair: true,
        events: {
            setExtremes: syncExtremes
        },
        labels:{
            enabled:false
        }
    }
};


function plotJSONData2() {
    fetchJSONFile('springfield.json', function(data){

        var seriesData = [{
            name: "price",
            data: data[8]['history']['data']
        }] 
        //console.log(seriesData);
        myConfig2['series'] = seriesData;
        Highcharts.chart("Price_line_chart", myConfig2);
    });
};


// bottom left plot
let myConfig3 = {
    legend: {
        enabled:false
    },
    chart: {
        backgroundColor: "transparent",
        type: "line",
        width:1200,
        height:200

    },
    title: {
        align: "left",
        text: 'Temperature °F',
    },

    yAxis: {
        min:0,
        max:90,
        title: {
            text: "Temperature"
        }
    },
    tooltip: {
        positioner: function () {
            return {
                // right aligned
                x: this.chart.chartWidth - this.label.width,
                y: 10 // align to title
            };
        },
        borderWidth: 0,
        shadow: false,
        animation: false,
        shared: false
    },
    
    xAxis: {
        crosshair: true,
        events: {
            setExtremes: syncExtremes
        },
        labels:{
            enabled:false
        }
    },
    plotOptions: {
        line:{
            color:"red"
        },
        series: {
            label: {
                connectorAllowed: false
            }

        }
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

};

function plotJSONData3() {
    fetchJSONFile('springfield.json', function(data){

        var seriesData = [{
            name: "temperature",
            data: data[10]['history']['data']
        }]
        //console.log(seriesData);
        myConfig3['series'] = seriesData;
        Highcharts.chart("Temperature_line_chart", myConfig3);
    });
};

function generateEmpytTable(){
    
    var tbl = document.getElementById("table_chart");
    //var tbl = document.createElement("table");
    //var tblBody = document.createElement("tbody");

    var num_rows = 12;
    var num_cols = 4;
    for (var i = 0; i < num_rows; i++) {
        var row = document.createElement("tr");
        row.setAttribute("id", "tr"+i);
        // creates a table row
        if (i == 0 || i == 1 || i == 7 || i == 10 || i == 11) {
            for (var j = 0; j < num_cols; j++) {
                var head = document.createElement("th");
                head.setAttribute("id", "th" + j);
                if (j == 0) {
                    head.setAttribute("width", "40%");
                } else {
                    head.setAttribute("width", "20%");
                }
                var headText = document.createTextNode("cell in row "+i+", column "+j);
                head.appendChild(headText);
                row.appendChild(head);
            }
        } else {

            for (var j = 0; j < num_cols; j++) {
                
                var cell = document.createElement("td");
                cell.setAttribute("id", "td" + j);

                if (i == 2) {
                    var cellText = document.createElement("div");
                    cellText.innerHTML = "Wind";
                } else if (i == 3){
                    var cellText = document.createTextNode("Hydro");
                } else if (i == 4){
                    var cellText = document.createTextNode("Gas(CCGT)");
                } else if (i == 5){
                    var cellText = document.createTextNode("Distillate");
                } else if (i == 6){
                    var cellText = document.createTextNode("Black Coal");
                } else if (i == 8){
                    var cellText = document.createTextNode("Exports");
                } else if (i == 9){
                    var cellText = document.createTextNode("Pumps");
                } else {
                    var cellText = document.createTextNode("cell in row "+i+", column "+j);
                }

                if (j == 0) {
                    if (i == 2) {
                        var cellText = "<div class = \"green\"></div>Wind";
                        cell.innerHTML = cellText;
                    }  else if (i == 3) {
                        var cellText = "<div class = \"blue\"></div>Hydro";
                        cell.innerHTML = cellText;
                    }  else if (i == 4) {
                        var cellText = "<div class = \"orange\"></div>Gas(CCGT)";
                        cell.innerHTML = cellText;
                    }  else if (i == 5) {
                        var cellText = "<div class = \"red\"></div>Distillate";
                        cell.innerHTML = cellText;
                    }  else if (i == 6) {
                        var cellText = "<div class = \"black\"></div>Black Coal";
                        cell.innerHTML = cellText;
                    }  else if (i == 8) {
                        var cellText = "<div class = \"purple\"></div>Exports";
                        cell.innerHTML = cellText;
                    }  else if (i == 9) {
                        var cellText = "<div class = \"sky\"></div>Pumps";
                        cell.innerHTML = cellText;
                    }
                    
                    else {
                        var colorDiv = document.createElement("div");
                        colorDiv.setAttribute("class", "color"+i);
                        colorDiv.innerHTML = "";
                        cell.appendChild(colorDiv);
                        //console.log(colorDiv);
                        cell.appendChild(cellText);
                        //console.log(cell);
                    }
                } else {
                    var cellText = document.createTextNode("cell in row "+i+", column "+j);
                    cell.appendChild(cellText);
                }
                row.appendChild(cell);
            }
            
        }
        
        tbl.appendChild(row)
    }

    tbl.setAttribute("border", "1");
}

// function updateTime() {
//     document.getElementById("time_display").innerHTML = "1234";
// }