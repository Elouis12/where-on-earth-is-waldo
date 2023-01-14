

let barGraphData = {
    type: 'bar',
    data: {
        labels: ['Hong Kong', 'Macau', 'Japan', 'Switzerland', 'Spain', 'Singapore'],
        datasets: [{
            label: 'Life expectancy',
            data: [84.308, 84.188, 84.118, 83.706, 83.5, 83.468],
            backgroundColor: [
                'rgba(216, 27, 96)',
                'rgba(3, 169, 244)',
                'rgba(255, 152, 0)',
                'rgba(29, 233, 182)',
                'rgba(156, 39, 176)',
                'rgba(84, 110, 122)'
            ],
            borderColor: [
                'rgba(216, 27, 96, 1)',
                'rgba(3, 169, 244, 1)',
                'rgba(255, 152, 0, 1)',
                'rgba(29, 233, 182, 1)',
                'rgba(156, 39, 176, 1)',
                'rgba(84, 110, 122, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        legend: {
            display: false
        },
        responsive: true,
        title: {
            display: true,
            text: 'Life Expectancy by Country',
            position: 'top',
            fontSize: 16,
            padding: 20
        },
        scales: {
            yAxes: [{
                ticks: {
                    min: 0
                }
            }]
        }
    }
}
