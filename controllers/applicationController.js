let path = require('path');
const jwt = require('./JWTAuthController');
let {db} = require('../config/db');
let {query} = require('../models/userModel.js');
const dotEnv = require("dotenv");
dotEnv.config();



let getHomePage = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, '../public/index.html') );
}


let getRegisterPage = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, '../public/register.html') );
}

let getLoginPage = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, '../public/login.html') );
}


let getAboutPage = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, '../public/about.html') );

}


let getPlayPage = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, '../public/play.html') );

}


let getStatsPage = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, '../public/stats.html') );

}


let getSettingsPage = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, '../public/userSettings.html') );

}


let getResetPasswordPage = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, '../public/resetPassword.html') );

}


let get404Page = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, '../public/404.html') );

}



let postUserStats =  (req, resp)=>{

    let { refreshToken, gameMode, extraGameMode, countriesPicked, percentCorrect, date } = req.body;

    try{


        // get user id from token if valid
        let userId = parseInt(

            jwt.verifyJWT(
                refreshToken,
                process.env.JWT_REFRESH_SECRET,
            ).id
        );

        let postRecordSQL = `
            INSERT INTO users_stats(
                user_id, 
                game_mode, 
                extra_game_mode,  
                countries_picked, 
                percent_correct,
                date_added
            )
            VALUES( 
                ${userId},
                '${gameMode}',
                '${extraGameMode}', 
                ${parseInt(countriesPicked)}, 
                ${parseFloat(percentCorrect)}, 
                '${date}'
             )`
        /* POST RECORD */
        db.query( postRecordSQL, (error, results)=>{

            if( error ){

                return resp.status(401).json('user record not stored');

            }else{

                // update games played, game mode percentage
                let getUserStats = `
                    
                    SELECT
                        games_played,
                        hints_percentage,
                        capitals_percentage,
                        flags_percentage,
                        countries_percentage,
                        hints_played,
                        capitals_played,
                        flags_played,
                        countries_played
                    FROM users
                    WHERE id = ${userId}
                
                `

                // get user stats
                db.query( getUserStats, ( error, results )=>{

                    if( results ){

                        let userStats = results[0];

                        let modePlayedToUpdate;
                        let modePercentageToUpdate;


                        switch (gameMode){

                            case 'hints':

                                // user playing for the first time
                                if( userStats.hints_played === null ){

                                    modePercentageToUpdate = `hints_percentage = ${ parseFloat(percentCorrect) }`
                                    modePlayedToUpdate = `hints_played = ${1}`

                                    // user has records already
                                }else{

                                    let played = parseInt(userStats.hints_played);

                                    modePercentageToUpdate = ` hints_percentage = ${ ( ( ( userStats.hints_played * userStats.hints_percentage ) + ( parseFloat(percentCorrect) ) ) / ( userStats.hints_played + 1 ) ).toFixed(2) }`
                                    modePlayedToUpdate = ` hints_played = ${ ++played }`

                                }
                                break;

                            case 'flags':

                                    // user playing for the first time
                                    if( userStats.flags_played === null ){

                                        modePercentageToUpdate = `flags_percentage = ${ parseFloat(percentCorrect) }`
                                        modePlayedToUpdate = `flags_played = ${1}`

                                        // user has records already
                                    }else{

                                        let played = parseInt(userStats.flags_played);

                                        modePercentageToUpdate = ` flags_percentage = ${ ( ( ( userStats.flags_played * userStats.flags_percentage ) + ( parseFloat(percentCorrect) ) ) / ( userStats.flags_played + 1 ) ).toFixed(2) }`
                                        modePlayedToUpdate = ` flags_played = ${ ++played }`

                                    }
                                    break;

                            case 'capitals':

                                    // user playing for the first time
                                    if( userStats.capitals_played === null ){

                                        modePercentageToUpdate = `capitals_percentage = ${ parseFloat(percentCorrect) }`
                                        modePlayedToUpdate = `capitals_played = ${1}`

                                        // user has records already
                                    }else{

                                        let played = parseInt(userStats.capitals_played);

                                        modePercentageToUpdate = ` capitals_percentage = ${ ( ( ( userStats.capitals_played * userStats.capitals_percentage ) + ( parseFloat(percentCorrect) ) ) / ( userStats.capitals_played + 1 ) ).toFixed(2) }`
                                        modePlayedToUpdate = ` capitals_played = ${ ++played }`

                                    }
                                    break;

                            case 'countries':

                                    // user playing for the first time
                                    if( userStats.countries_played === null ){

                                        modePercentageToUpdate = `countries_percentage = ${ parseFloat(percentCorrect) }`
                                        modePlayedToUpdate = `countries_played = ${1}`

                                        // user has records already
                                    }else{

                                        let played = parseInt(userStats.countries_played);

                                        modePercentageToUpdate = ` countries_percentage = ${ ( ( ( userStats.countries_played * userStats.countries_percentage ) + ( parseFloat(percentCorrect) ) ) / ( userStats.countries_played + 1 ) ).toFixed(2) }`
                                        modePlayedToUpdate = ` countries_played = ${ ++played }`

                                    }
                                    break;

                        }

                        let gamesPlayed = userStats.games_played === null ? 1 : ++userStats.games_played;

/*                        let updateUsersSQL = `
                            
                            UPDATE 
                                users
                            SET games_played = ${gamesPlayed} 
                            WHERE id = ${userId};
                            
                            UPDATE 
                                users
                            SET ${modePlayedToUpdate}
                            WHERE id = ${userId};  
                                                        
                            UPDATE 
                                users
                            SET ${modePercentageToUpdate}
                            WHERE id = ${userId};                               
                        `*/

                        let gamesPlayedQuery = ` UPDATE 
                                users
                            SET games_played = ${gamesPlayed} 
                            WHERE id = ${userId};
                        `
                        let modesPlayedQuery = `UPDATE 
                                users
                            SET ${modePlayedToUpdate}
                            WHERE id = ${userId};
                        `
                        let modePercentage = `UPDATE 
                                users
                            SET ${modePercentageToUpdate}
                            WHERE id = ${userId};
                        `
                        let lastDatePlayed = `UPDATE 
                                users
                            SET last_logged_in = '${date}'
                            WHERE id = ${userId};
                        `

                        // made it an array because of syntax issue when running multiple updates in the variable 'updateUsersSQL'
                        let queriesToRun = [ gamesPlayedQuery, modesPlayedQuery, modePercentage, lastDatePlayed ];

                        for( let x = 0; x < queriesToRun.length; x++){

                            db.query( queriesToRun[x], (error, results)=>{

                                if( error ){

                                    return resp.status(401).json('user record not stored');

                                }

                            } )
                        }

                        return resp.status(200).json('success');

                    }
                } );

                // return resp.status(200).json('success');
            }

        } );


    }catch (e){

        console.log(e);
        // have user re-login
        return resp.status(401).json('user record not stored');

    }


}

let getUserStats = (req, resp)=>{

    let { refreshToken } = req.body;

    let resultsArray = [];


    try{

        let userId = parseInt(jwt.verifyJWT(

            refreshToken,
            process.env.JWT_REFRESH_SECRET
        ).id);


        let sql = `
        
            SELECT 
                game_mode,
                extra_game_mode,
                percent_correct,
                countries_picked,
                date_added
            FROM 
                users_stats 
            WHERE user_id = ${ userId } 
            ORDER BY id DESC

    `

        // get users general stats
        db.query( sql, (error, results)=>{

            if(error){

                return resp.json('could not get users');

            }else if(results){

                resultsArray.push( results );

                let sql = `
                    
                    SELECT 
                        daily_streak,
                        last_logged_in,
                        games_played,
                        hints_percentage,
                        capitals_percentage,
                        flags_percentage,
                        countries_percentage,
                        hints_played,
                        capitals_played,
                        flags_played,
                        countries_played
                    FROM users
                    WHERE id = ${ userId }
                  
                `

                // get users specific stats
                db.query(sql, (error, results)=>{

                    if( error || results.length <= 0 ){

                        return resp.json('could not get users');

                    }else if( results ){

                        resultsArray.push( results[0] );

                        return resp.status(200).json(resultsArray)

                    }
                })
            }

        } );

    }catch (e) {

        console.log(e)
    }
}


let postStreak = async (req, resp) => {

    let {refreshToken} = req.body;


    try {

        let userId = parseInt(jwt.verifyJWT(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        ).id);


        // get last played and current day

        let currentDay = new Date(new Date().toLocaleDateString());

        let lastLoggedInSQL = `SELECT last_logged_in FROM users WHERE id = ${userId} `
        let lastLoggedIn = new Date(await query(lastLoggedInSQL).then(results => results[0].last_logged_in));


        // to see if user logged in within < 24 hours
        const daysDifference = (currentDay, lastLoggedIn) =>{
            let difference = currentDay.getTime() - lastLoggedIn.getTime();
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            return TotalDays;
        }

        let setDailyStreaksSQL;

        // user logged in one day after day, don't update
        if(  currentDay !== lastLoggedIn && daysDifference(currentDay, lastLoggedIn) === 1 ){

            // increase in streaks
            setDailyStreaksSQL = `
        
                UPDATE users
                SET daily_streak = ${daily_streak+1}
                WHERE id = ${userId}
            
            `
            // update the streaks
            await query(setDailyStreaksSQL);

        }else if( daysDifference(currentDay, lastLoggedIn) > 1 ){

            // set to 0
            setDailyStreaksSQL = `
        
                UPDATE users
                SET daily_streak = ${0}
                WHERE id = ${userId}
            
            `
            // update the streaks
            await query(setDailyStreaksSQL);
        }



        let setLastLoggedInSQL = `
        
            UPDATE users
            SET last_logged_in = '${lastLoggedIn}'
            WHERE id = ${userId}
            
        `
        let getDailyStreakSQL = `
        
            SELECT daily_streak
            FROM users
            WHERE id = ${userId}
            
        `
        await query(setLastLoggedInSQL);
        await query(getDailyStreakSQL)
            .then((results)=>{

                return resp.status(201).json(results[0].daily_streak);

            })
            .catch((e)=>{ console.log(e) });



    } catch (e) {

        console.log(e);
    }

}

module.exports = {

    getHomePage,
    getRegisterPage,
    getLoginPage,
    getAboutPage,
    getPlayPage,
    getStatsPage,
    getSettingsPage,
    getResetPasswordPage,
    get404Page,
    postUserStats,
    getUserStats,
    postStreak

}