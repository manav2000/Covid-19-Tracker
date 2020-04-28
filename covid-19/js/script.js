var totalCases;
var deaths;
var recovered;
var active;
var chart;
var chartTitle;
var totalFig = document.querySelector('#total-figure');
var deathFig = document.querySelector('#death-figure');
var recoveredFig = document.querySelector('#recovered-figure');
var activeFig = document.querySelector('#active-figure');
var marq = document.querySelector('marquee');
var country = document.querySelector('input');
var stats = document.querySelector('.stats');
var canvas = document.querySelector('#myChart');
var searchButton = document.querySelector('.search-button');

searchButton.addEventListener('click', function () {

    document.querySelector('body').style.height = 'auto';
    var countryName = country.value;

    var api2 = `https://api.covid19api.com/total/country/${country.value}`;
    var api = `https://api.covid19api.com/live/country/${country.value}`;

    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data[0]) {
                if (data[0].CountryCode !== '' && data[0].Province === '') {
                    console.log(data);
                    getInfo(data, countryName);
                    marq.innerHTML = `<b>Country</b>:${countryName.toUpperCase()} <b>Confirmed</b>: ${totalCases} <b>Deaths</b>: ${deaths} <b>Recovered</b>: ${recovered} <b>Active</b>: ${active}`;
                } else {
                    fetch(api2)
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            console.log(data);
                            getInfo(data, countryName);
                            marq.innerHTML = `<b>Country</b>:${countryName.toUpperCase()} <b>Confirmed</b>: ${totalCases} <b>Deaths</b>: ${deaths} <b>Recovered</b>: ${recovered} <b>Active</b>: ${active}`;
                        })
                }
            } else {
                alert('Invalid input or poor connection');
            }
        })
    country.value = '';
})

window.addEventListener('click', function () {
    country.value = '';
})

function getInfo(data, countryName) {
    var totalData = [];
    var confData = [];
    var deathData = [];
    var recData = [];
    var activeData = [];
    totalCases = data[data.length - 1].Confirmed;
    deaths = data[data.length - 1].Deaths;
    recovered = data[data.length - 1].Recovered;
    active = data[data.length - 1].Active;

    function extractData() {
        for (let i = 0; i < data.length; i++) {
            confData.push(data[i].Confirmed);
            deathData.push(data[i].Deaths);
            recData.push(data[i].Recovered);
            activeData.push(data[i].Active);
            totalData.push(i);
        }
        return totalData, confData, deathData, recData, activeData;
    }
    extractData();
    var chartData = {
        labels: totalData,
        datasets: [{
            data: confData,
            label: "CONFIRMED",
            borderColor: "orange",
            fill: false
        }, {
            data: deathData,
            label: "DEATHS",
            borderColor: "red",
            fill: false
        }, {
            data: recData,
            label: "RECOVERED",
            borderColor: "lime",
            fill: false
        }, {
            data: activeData,
            label: "ACTIVE",
            borderColor: "yellow",
            fill: false
        }]
    }
    chartTitle = `COVID-19 STATS FOR ${countryName.toUpperCase()}`;

    function animatedNumber(elem, fig) {
        let i = 0;
        let id = setInterval(frame4, 5);

        function frame4() {
            if (i >= fig) {
                clearInterval(id);
                elem.textContent = fig;
            } else {
                i += Math.ceil(Math.random() * 120);
                elem.textContent = i;
            }
        }
    }
    animatedNumber(totalFig, totalCases);
    animatedNumber(deathFig, deaths);
    animatedNumber(recoveredFig, recovered);
    animatedNumber(activeFig, active);
    if (chart) {
        chart.data.labels = chartData.labels;
        chart.data.datasets[0].data = chartData.datasets[0].data;
        chart.data.datasets[1].data = chartData.datasets[1].data;
        chart.data.datasets[2].data = chartData.datasets[2].data;
        chart.data.datasets[3].data = chartData.datasets[3].data;
        chart.options.title.text = `COVID-19 STATS FOR ${countryName.toUpperCase()}`;
        chart.update();
    } else {
        var ctx = document.querySelector('#myChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'black'
                        },
                        gridLines: {
                            display: true,
                            color: 'rgb(0,0,0)'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: 'black',
                            beginAtZero: true
                        },
                        gridLines: {
                            display: true,
                            color: 'rgb(0,0,0)'
                        }
                    }]
                },
                legend: {
                    labels: {
                        fontColor: 'black',
                        fontSize: 14,
                        fontFamily: 'sans-serif',
                        fontStyle: 'bold'
                    }
                },
                title: {
                    display: true,
                    text: chartTitle,
                    fontSize: 15,
                    fontStyle: 'bold',
                    fontColor: 'black'
                },
            }
        })
    }
    canvas.style.background = 'rgba(80, 120, 180, 0.8)';
    return totalCases, recovered, deaths, active;
}