let { db } = require("../config/db.js");

const getUser = (req, resp) => {

    const sql = `
    
    SELECT 
        user_name
    FROM users;
    `

    db.query( sql, (err, result) => {

        if( err ){ // if there's an error
            throw err;
        }else { // if there's no error send us the result AKA query we just made

            console.log(result)
            result.length === 0 ?
                resp.json( { message : 'there are no users in the database' } )
                :
                resp.json(result);
        }
    } );
}


const getUserStats = (req, resp) => {

    const sql = `
    
    SELECT 
        user_name,
    FROM users;
    `
    db.query( sql, (err, result) => {

        if( err ){ // if there's an error
            throw err;
        }else{ // if there's no error send us the result AKA query we just made

            return resp.json(result);
        }
    } );
}

module.exports = {

    getUser
}
