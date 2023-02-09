export class Stats{

    #userStats;
    #labelsArray = [];
    #dataArray = [];
    #percentArray = [];

    #last_date_played;
    #daily_streak;

    constructor() {


        // add these to the stats.html page instead of constructor
        let showAllButton = document.getElementById("show-all-button");
        let showLessButton = document.getElementById("show-less-button");

        if( showAllButton ){ showAllButton.addEventListener("click", this.#showAll);  }
        if( showLessButton ){ showLessButton.addEventListener("click", this.#showLess);  }


    }


    async getUserStats(){

        let stats =  await fetch( '/get-stats',
        {
                method: 'POST',
                headers : {

                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({
                    refreshToken: localStorage.getItem('refreshToken')
                })
            }
        )
            .then( resp => resp.json() )
            .catch( (e)=>{ console.log(e) } );

        return stats;

    }

    async updateTable(){

        let userStats = await this.getUserStats();

        let table = document.getElementById('table')
        let tableBody = document.getElementById('table-body');

        for( let x = 0; x < Object.keys( userStats[0] ).length; x++ ){

            let record;

            // only show the top 10 recent activities
            if( x > 9 ){

                record = `
            
                    <tr class="table-row hide">
                        <td>${x+1}</td>
                        <td>${userStats[0][x].game_mode}</td>
                        <td>${userStats[0][x].extra_game_mode}</td>
                        <td>${userStats[0][x].countries_picked}</td>
                        <td>${userStats[0][x].percent_correct * 100}%</td>
                        <td>${userStats[0][x].date_added}</td>
    <!--                    <td class="warning">Pending</td>-->
    <!--                    <td class="primary">Details</td>-->
                    </tr>
            
            `
            }else{

                record = `
            
                    <tr class="table-row">
                        <td>${x+1}</td>
                        <td>${userStats[0][x].game_mode}</td>
                        <td>${userStats[0][x].extra_game_mode}</td>
                        <td>${userStats[0][x].countries_picked}</td>
                        <td>${userStats[0][x].percent_correct * 100}%</td>
                        <td>${userStats[0][x].date_added}</td>
    <!--                    <td class="warning">Pending</td>-->
    <!--                    <td class="primary">Details</td>-->
                    </tr>
            
            `
            }


            table.insertAdjacentHTML('beforeend', record);

            // console.log(record);
        }

        let tableRows = document.getElementsByClassName("table-row");
        let activityButtonDiv = document.getElementById("activity-button-div");

        // hide show all / show less if there's less than 10 items
        if( tableRows.length <= 10 ){ // 11 to account

            activityButtonDiv.style.visibility = "hidden";

        }
    }

    #showAll(){

        let tableRow = document.getElementsByClassName("table-row");


        for( let x = 0; x < tableRow.length; x+=1 ){

            // if element is hidden then show it
            if( tableRow[x].classList.contains("hide") ){

                tableRow[x].classList.remove("hide");
            }
        }


        // show the show less button and remove show all
        let showLessButton = document.getElementById("show-less-button");
        showLessButton.classList.remove('hide');

        let showAllButton = document.getElementById("show-all-button");
        showAllButton.classList.add('hide');

/*        // add show less button functionality
        let showAllButton = document.getElementById("show-all-button");

        showAllButton.setAttribute("value", "Show Less");
        showAllButton.removeEventListener("click", this.#showAll);
        showAllButton.addEventListener("click", this.#showLess);
    */
    }

    #showLess(){

        let tableRow = document.getElementsByClassName("table-row");


        for( let x = 0; x < tableRow.length; x+=1 ){

            if( x > 9 ){

                // hide the rest of the elements
                // if( tableRow[x].classList.contains("hide") ){

                    tableRow[x].classList.add("hide");
                // }
            }

        }

        // show the show all button and remove show less

        let showLessButton = document.getElementById("show-less-button");
        showLessButton.classList.add('hide');

        let showAllButton = document.getElementById("show-all-button");
        showAllButton.classList.remove('hide');

        /*
                // add show all button functionality
                let showAllButton = document.getElementById("show-all-button");

                showAllButton.setAttribute("value", "Show All");
                showAllButton.removeEventListener("click", this.#showLess);
                showAllButton.addEventListener("click", this.#showAll);
        */

    }

    async updateGraphs(){


        let userStats = await this.getUserStats();


        if( userStats[1].hints_played !== null ){ this.#labelsArray.push('Hints'); this.#dataArray.push( userStats[1].hints_played ); this.#percentArray.push( userStats[1].hints_percentage * 100 ) }
        if( userStats[1].capitals_played !== null ){ this.#labelsArray.push('Capitals'); this.#dataArray.push( userStats[1].capitals_played ); this.#percentArray.push( userStats[1].capitals_percentage * 100 ) }
        if( userStats[1].flags_played !== null ){ this.#labelsArray.push('Flags'); this.#dataArray.push( userStats[1].flags_played ); this.#percentArray.push( userStats[1].flags_percentage * 100 ) }
        if( userStats[1].countries_played !== null ){ this.#labelsArray.push('Countries'); this.#dataArray.push( userStats[1].countries_played ); this.#percentArray.push( userStats[1].countries_percentage * 100 ) }

        if( userStats[1].last_logged_in !== null ){ this.#last_date_played = userStats[1].last_logged_in; }

        if( userStats[1].daily_streak !== null ){ this.#daily_streak = userStats[1].daily_streak; }


        // doughnut graph
        let doughnutChartDiv = document.getElementById('doughnut-chart').getContext('2d');
        let doughnutChart = new Chart( doughnutChartDiv, this.setGamesPlayed( this.#labelsArray, this.#dataArray ) );


        // line graph
        let lineChartDiv = document.getElementById('line-chart').getContext('2d');
        let lineChart = new Chart( lineChartDiv, this.setPercentageCorrect( this.#labelsArray, this.#percentArray ) );

    }

    async updateBannerCards(){


        let dateText = document.getElementById('date-text');
        let streaksText = document.getElementById('streaks-text');
        let gamesPlayedText = document.getElementById('game-played-text');
        let averageText = document.getElementById('average-percent-text');


        let currentDay = new Date(new Date().toLocaleDateString());
        let lastDayPlayed = new Date(this.#last_date_played);



        const daysDifference = (currentDay, lastDayPlayed) =>{
            let difference = currentDay.getTime() - lastDayPlayed.getTime();
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            return TotalDays;
        }

        alert(currentDay)
        alert(lastDayPlayed)

        if( currentDay !== lastDayPlayed && daysDifference(currentDay, lastDayPlayed) === 1 ){

            ++this.#daily_streak;

        }else if( daysDifference(currentDay, lastDayPlayed) > 1 ){

            this.#daily_streak = 0;
        }

        // update streaks
        let streaksCount =   await fetch( '/save-streaks',
                {
                    method: 'POST',
                    headers : {

                        'Content-type' : 'application/json'
                    },
                    body : JSON.stringify({
                        daily_streak: ( daysDifference(currentDay, lastDayPlayed) === 1 ? ++this.#daily_streak : 0 ),
                        refreshToken: localStorage.getItem('refreshToken')
                    })
                }
            )
                .then( resp => resp.json() )
                .catch( (e)=>{ console.log(e) } );


        streaksText.innerText = streaksCount;


        dateText.innerText = new Date().toLocaleDateString();

        averageText.innerText = ( this.#percentArray.reduce((a, b) => {
            return a + b;
        }) / this.#percentArray.length ).toFixed(2);

        gamesPlayedText.innerText = this.#dataArray.reduce((a, b) => {
            return a + b;
        });
    }

    updateNeedToWorkOn(){

        let needToWorkOn = document.getElementById('need-to-work-on');

        let element;

        for( let x = 0; x < this.#percentArray.length; x++ ){


            if( this.#percentArray[x] <= 74 ){

                if( this.#labelsArray[x] === 'Hints' ){

                    element = `
                        <div class="item online">
                            <div class="icon primary-background">
                                <span class="material-icons-sharp">search</span>
                            </div>
                            <div class="right">
                                <div class="info">
                                    <h3>Hints</h3>
                                </div>
                                <h3 class="danger">${this.#percentArray[x]}%</h3>
                            </div>
                        </div>
                    `
                }else if( this.#labelsArray[x] === 'Capitals' ){

                    element = `
                        <div class="item online">
                            <div class="icon success-background">
                                <span class="material-icons-sharp"></span>
                            </div>
                            <div class="right">
                                <div class="info">
                                    <h3>Capital</h3>
                                </div>
                                <h3 class="danger">${this.#percentArray[x]}%</h3>
                            </div>
                        </div>
                    `
                }else if( this.#labelsArray[x] === 'Flags' ){

                    element = `
                        <div class="item online">
                            <div class="icon warning-background">
                                <span class="material-icons-sharp">flag</span>
                            </div>
                            <div class="right">
                                <div class="info">
                                    <h3>Flags</h3>
                                </div>
                                <h3 class="danger">${this.#percentArray[x]}%</h3>
                            </div>
                        </div>
                    `
                }else if( this.#labelsArray[x] === 'Countries' ){

                    element = `
                        <div class="item online">
                            <div class="icon danger-background">
                                <span class="material-icons-sharp">public</span>
                            </div>
                            <div class="right">
                                <div class="info">
                                    <h3>Countries</h3>
                                </div>
                                <h3 class="danger">${this.#percentArray[x]}%</h3>
                            </div>
                        </div>
                    `
                }

                needToWorkOn.insertAdjacentHTML('beforeend', element);
            }
        }
    }

    setGamesPlayed( labelsArray, dataArray){

        return {
            type: 'doughnut',
            data: {
                labels: labelsArray,
                datasets: [{
                    // label: 'Life expectancy',
                    data: dataArray,
                    backgroundColor: [
                        '#7380ec', /**/
                        '#41f1b6',
                        '#ffbb55',
                        '#ff7782',
                    ],
                    borderColor: [
                        '#7380ec',
                        '#41f1b6',
                        '#ffbb55',
                        '#ff7782',
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

    setPercentageCorrect( labelsArray, dataArray){

        return {
            type: 'bar',
            data: {
                labels: labelsArray,
                datasets: [{
                    label: '',
                    data: dataArray,
                    backgroundColor: [
                        '#7380ec',
                        '#41f1b6',
                        '#ffbb55',
                        '#ff7782',
                    ],
                    borderColor: [
                        '#7380ec',
                        '#41f1b6',
                        '#ffbb55',
                        '#ff7782',
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

    async saveStats(gameMode, extraGameMode, countriesPicked, percentCorrect, date){

        // make api call to save stats to db for that user
        await fetch( '/save-stats',
        {
                method: 'POST',
                headers : {

                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({
                    refreshToken: localStorage.getItem('refreshToken'),
                    gameMode: gameMode,
                    extraGameMode: extraGameMode,
                    countriesPicked: countriesPicked,
                    percentCorrect: percentCorrect,
                    date: date
                })
            }
        )
            .then( resp => resp.json() )
                .catch( (e)=>{ console.log(e) } )
    }
}

