const bcrypt = require('bcryptjs');
const passwordComplexity = require("joi-password-complexity");
const emailValidator= require("email-validator");
const inputValidator= require("node-input-validator");
const dotEnv = require("dotenv");
dotEnv.config();
const jwt = require('jsonwebtoken');
let { db } = require("../config/db.js");


let userModel = require('../models/userModel.js');
let JWTAuth = require('./JWTAuthController.js');

let getUserByUsername = (username) => {

    //simple function to get growth items
    return new Promise((resolve, reject) => {
        let sql = `SELECT id, user_name, password FROM users WHERE user_name = '${username}'`;
        db.query(sql, function (err, result){
            if (err){
                reject(err);
            }

            resolve(result)
        })
    })

}

let getUserByEmail = (email) => {

    //simple function to get growth items
    return new Promise((resolve, reject) => {
        let sql = `SELECT id, user_name, email, password FROM users WHERE email = '${email}'`;
        db.query(sql, function (err, result){
            if (err){
                reject(err);
            }

            resolve(result)
        })
    })

}



let postRegister = async (req, resp) => {

    const { username, email, password: plainTextPassword, passwordConfirmation } = req.body; // property: newPropertyName

    let issues = {};


    let userByUsername = await getUserByUsername(username)
        .then( resp => resp )
        .catch( (e) => { console.log(e) } )



    let userByEmail = await getUserByEmail(email)
        .then( resp => resp )
        .catch( (e) => { console.log(e) } )


    // verify username
    if( !username || typeof username !== 'string' ){

        issues.username = 'Invalid username';

    }else if( userByUsername.length > 0 ){

        issues.username = 'Username already exist';

    }



    // verify email
    if( !email || typeof email !== 'string' || !emailValidator.validate(email) ){

        issues.email = 'Invalid email';

    }
    if( userByEmail.length > 0 ){

        issues.email = 'Email already exist';

    }


    // verify password
    if( !plainTextPassword || typeof plainTextPassword !== 'string' || passwordComplexity().validate(plainTextPassword).error ){

        let messages = (passwordComplexity().validate(plainTextPassword).error).toString().split("{")
        let allMessages = messages[0].slice(16);

        issues.password = allMessages.split('.');
    }

    // verify passwords match
    if( passwordConfirmation === "" || passwordConfirmation !== plainTextPassword ){

        issues.passwordConfirmation = 'Passwords do not match';
    }

    if( Object.keys(issues).length > 0 ){

        return resp.json( { issues } );
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    try{

        let sql = `
            
            INSERT INTO users( user_name, email, password, daily_streak )
            values( '${username}', '${email}', '${password}', ${0} );
        
        `
        db.query( sql );

        console.log('User created successfully');
        return resp.status(202).json( {success:'success'} );


    }catch (e){

        if( e.code === 11000 ){ // duplicate key in mongoose

            return resp.status(400).json( {status:'error', error:'Username already in use'} );

        }else{ // something else besides duplicate key (ex. connection error )

            throw e;
        }

    }

}


let postLogin = async (req, resp) => {

    const { usernameOrEmail, password } = req.body;

    if( !usernameOrEmail || !password ){

        return resp.json({issue : 'Invalid credentials'})

    }

    let userByUsername = await getUserByUsername(usernameOrEmail)
        .then( result => result   )
        .catch( (e)=>{ console.log( e ) } )

    let userByEmail = await getUserByEmail(usernameOrEmail)
        .then( result => result   )
        .catch( (e)=>{ console.log( e ) } )

    // GRAB THE RECORD MATCHING THE NAME OR EMAIL
    let userExists = ( userByUsername.length > 0 ) || ( userByEmail.length > 0 )


    // PERSON DOES NOT EXISTS
    if(  !userExists ){

        return resp.json({issue : 'Invalid credentials'})
    }

    let user;

    if( userByUsername.length > 0 ){

        user = userByUsername;

    }else if( userByEmail.length > 0 ){

        user = userByEmail;

    }

    console.log( await bcrypt.compare(password, user[0].password) );


    // USERNAME AND PASSWORD CORRECT
    if( await bcrypt.compare(password, user[0].password ) ){

        // this is public BUT if anyone tempers with it, everything else becomes invalidated
        // sign the token with the payload { id, username } and secret { obhbrbfhbrub }

        let id = user[0].id.toString();
        let username = user[0].user_name;

        const accessToken = JWTAuth.signJWT(
            id,
            username,
            process.env.JWT_ACCESS_SECRET,
            '30s'

        );

        const refreshToken = JWTAuth.signJWT(
            id,
            username,
            process.env.JWT_REFRESH_SECRET,
            '1d'

        );

        // send them a token to use till we decide to expire it
        // also set it to the header
        // req.headers['authorization'] = 'Bearer ' + token;
        return resp.json({success:'success', accessToken:accessToken, refreshToken: refreshToken})

    }else{

        return resp.json({issue : 'Invalid credentials'})
    }

}



let getAccessToken = (req, resp) => {

    let { refreshToken } = req.body;

    try{

        // verify the refresh token coming in making sure it wasn't tampered with
        const userInfo = jwt.verify( // gives decoded version of middle part -> { _id , username }

            refreshToken,
            process.env.JWT_REFRESH_SECRET
        )


        let userId = userInfo.id;
        let username =  userInfo.username;


        let accessToken = JWTAuth.signJWT(

            userId,
            username,
            process.env.JWT_ACCESS_SECRET,
            '15s'
        )

        // no need to change to refresh token
        console.log(accessToken);
        resp.status(200).json(accessToken); // send the new access token to the browser

    }catch (e){

        resp.status(200).json('restricted'); // send the new access token to the browser

    }

}

/*

*/
let getUserInfo = (req, resp) => {

    const { refreshToken } = req.body; // grabbing the token we sent from the client


    try{

        const userInfo = JWTAuth.verifyJWT( // gives decoded version of middle part -> { _id , username }

            refreshToken,
            process.env.JWT_REFRESH_SECRET
        )

        let userId = userInfo.id; // because it is an int
        let username = userInfo.username;


        const sql = `
    
    
                SELECT 
                    user_name
                FROM users
                WHERE  user_name = '${username}';
    `

        db.query( sql, (err, result) => {

            if( err ){ // if there's an error
                throw err;
            }else{ // if there's no error send us the result AKA query we just made

                result.length === 0 ?
                    resp.json( { message : 'there are no users in the database' } )
                    :
                    resp.json(result);
            }
        } );

    }catch (e){

        console.log(e.name);

        if (e.name === 'TokenExpiredError') {

            resp.json({unauthorized : 'unauthorized'})

        }else if( e.name === 'JsonWebTokenError' || e.name ){

            resp.json({restricted : 'restricted'})
        }

    }

}


let deleteLogout = (req, resp) => {


    try{

        let { refreshToken } = req.body;

        const userInfo = JWTAuth.verifyJWT( // gives decoded version of middle part -> { _id , username }

            refreshToken,
            process.env.JWT_ACCESS_SECRET
        )

        let userId = userInfo.userId;
        let username = userInfo.name;


        // remove from mysql to blacklist

        // send user to login page or home page

        // make sure to delete them from the server side

        resp.redirect('/login');

    }catch (e){


    }
}



module.exports = {

    postRegister,
    postLogin,
    getUserInfo,
    getAccessToken,
    deleteLogout
}

