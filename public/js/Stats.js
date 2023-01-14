class Stats{

    setGamesPlayed( labelsArray = ['Hints', 'Flags', 'Capitals', 'Country'], dataArray = [2, 10, 5, 11]){

        return {
            type: 'doughnut',
            data: {
                labels: labelsArray,
                datasets: [{
                    // label: 'Life expectancy',
                    data: dataArray,
                    backgroundColor: [
                        'rgba(216, 27, 96)',
                        'rgba(3, 169, 244)',
                        'rgba(255, 152, 0)',
                        'rgba(29, 233, 182)',
                    ],
                    borderColor: [
                        'rgba(216, 27, 96, 1)',
                        'rgba(3, 169, 244, 1)',
                        'rgba(255, 152, 0, 1)',
                        'rgba(29, 233, 182, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Modes Played',
                    position: 'top',
                    fontSize: 16,
                    padding: 20
                },
                /*scales: {
                    yAxes: [{
                        ticks: {
                            min: 0
                        }
                    }]
                }*/
            }
        }

    }

    setPercentageCorrect( labelsArray = ['Hints', 'Flags', 'Capitals', 'Country'], dataArray = [2, 10, 5, 11]){

        return {
            type: 'bar',
            data: {
                labels: labelsArray,
                datasets: [{
                    label: 'Life expectancy',
                    data: dataArray,
                    backgroundColor: [
                        'rgba(216, 27, 96)',
                        'rgba(3, 169, 244)',
                        'rgba(255, 152, 0)',
                        'rgba(29, 233, 182)',
                    ],
                    borderColor: [
                        'rgba(216, 27, 96, 1)',
                        'rgba(3, 169, 244, 1)',
                        'rgba(255, 152, 0, 1)',
                        'rgba(29, 233, 182, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Percentage Correct',
                    position: 'top',
                    fontSize: 16,
                    padding: 20
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 100
                        }
                    }]
                }
            }
        }

    }
}


function main(){

    let stats = new Stats();

    let doughnutChartDiv = document.getElementById('doughnut-chart').getContext('2d');

    let doughnutChart = new Chart( doughnutChartDiv, stats.setGamesPlayed() );


    let lineChartDiv = document.getElementById('line-chart').getContext('2d');

    let lineChart = new Chart( lineChartDiv, stats.setPercentageCorrect() );
}

main();