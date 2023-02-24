const path = require('path');
const bcrypt = require('bcryptjs');
const passwordComplexity = require("joi-password-complexity");
const emailValidator = require("email-validator");
const inputValidator = require("node-input-validator");
const dotEnv = require("dotenv");
dotEnv.config();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mjml = require('mjml');
let {db} = require("../config/db.js");


let {query} = require('../models/userModel.js');
let JWTAuth = require('./JWTAuthController.js');

let getUserByUsername = (username) => {

    return new Promise((resolve, reject) => {
        let sql = `SELECT id, user_name, password FROM users WHERE user_name = '${username}'`;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }

            resolve(result)
        })
    })

}

let getUserByEmail = (email) => {

    return new Promise((resolve, reject) => {
        let sql = `SELECT id, user_name, email, password FROM users WHERE email = '${email}'`;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }

            resolve(result)
        })
    })

}


let postRegister = async (req, resp) => {

    const {username, email, password: plainTextPassword, passwordConfirmation} = req.body; // property: newPropertyName

    let issues = {};


    let userByUsername = await getUserByUsername(username)
        .then(resp => resp)
        .catch((e) => {
            console.log(e)
        })


    let userByEmail = await getUserByEmail(email)
        .then(resp => resp)
        .catch((e) => {
            console.log(e)
        })


    // verify username
    if (!username || typeof username !== 'string') {

        issues.username = 'Invalid username';

    } else if (userByUsername.length > 0) {

        issues.username = 'Username already exist';

    }

    // verify email
    if (!email || typeof email !== 'string' || !emailValidator.validate(email)) {

        issues.email = 'Invalid email';

    }

    if (userByEmail.length > 0) {

        issues.email = 'Email already exist';

    }


    // verify password
    if (!plainTextPassword || typeof plainTextPassword !== 'string' || passwordComplexity().validate(plainTextPassword).error) {

        let messages = (passwordComplexity().validate(plainTextPassword).error).toString().split("{")
        let allMessages = messages[0].slice(16);

        issues.password = allMessages.split('.');
    }

    // verify passwords match
    if (passwordConfirmation === "" || passwordConfirmation !== plainTextPassword) {

        issues.passwordConfirmation = 'Passwords do not match';
    }

    if (Object.keys(issues).length > 0) {

        return resp.json({issues});
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    /* EVERYTHING IS GOOD */
    try {

        let sql = `
            
            INSERT INTO users( user_name, email, password, daily_streak, games_played, verified )
            values( '${username}', '${email}', '${password}', ${0}, ${0}, ${0} );
        
        `
        db.query(sql);

        console.log('User created successfully @' + process.env.DB);


        let id = await getUserByEmail(email).then(resp => resp).catch((e) => {
            console.log(e)
        })

        let emailToken = JWTAuth.signJWT(
            id[0].id.toString(),
            username,
            process.env.JWT_EMAIL_SECRET
        );

        // localhost:5000/api/query?name=ernesto
        // localhost:5000/api/query?name=d&limit=1

        // send user email to verify account

        const body = mjml(`
                <mjml>
                
                  <mj-head>
                    <mj-style>
                      @import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css";
                    </mj-style>
                  </mj-head>
                
                  <mj-body>
                
<!--                    <mj-section>
                      <mj-column>
                        <mj-image align="left" width="100px" src="https://whereonearthiswaldo.onrender.com/favicon.ico"></mj-image>
                      </mj-column>
                -->
                    </mj-section>
                
                    <mj-section background-color="black">
                      <mj-column>
                        <mj-text align="center" color="white" font-size="40px"><i class="fa-regular fa-envelope"></i></mj-text>
                      </mj-column>
                    </mj-section>
                
                    <mj-section>
                      <mj-column>
                
                        <mj-text align="center" font-size="40px">Email Confirmation</mj-text>
                
                        <mj-text align="center">Thank you for creating your account.</mj-text>
                        <mj-text align="center">Please confirm your email address.</mj-text>
                
                        <mj-button background-color="black" href="https://whereonearthiswaldo.onrender.com/auth/query?token=${emailToken}">Verify Email Address</mj-button>
                      </mj-column>
                
                    </mj-section>
                  </mj-body>
                </mjml>
                `)

        await sendEmail(email, "Please Activate Your 'Where on Earth is Waldo Account?'", body.html);
        return resp.status(202).json({success: 'success'});

    } catch (e) {

        return resp.status(400).json({status: 'error', error: 'Username already in use'});

    }

}


let postLogin = async (req, resp) => {

    const {usernameOrEmail, password} = req.body;

    if (!usernameOrEmail || !password) {

        return resp.json({issue: 'Invalid credentials'})

    }

    let userByUsername = await getUserByUsername(usernameOrEmail)
        .then(result => result)
        .catch((e) => {
            console.log(e)
        })

    let userByEmail = await getUserByEmail(usernameOrEmail)
        .then(result => result)
        .catch((e) => {
            console.log(e)
        })

    // GRAB THE RECORD MATCHING THE NAME OR EMAIL
    let userExists = (userByUsername.length > 0) || (userByEmail.length > 0)


    // PERSON DOES NOT EXISTS
    if (!userExists) {

        return resp.json({issue: 'Invalid credentials'})
    }

    let user;

    // if logging in through username
    if (userByUsername.length > 0) {

        user = userByUsername;

        // if logging in through email
    } else if (userByEmail.length > 0) {

        user = userByEmail;

    }

    // USERNAME AND PASSWORD CORRECT
    if (await bcrypt.compare(password, user[0].password)) {

        // this is public BUT if anyone tempers with it, everything else becomes invalidated
        // sign the token with the payload { id, username } and secret { obhbrbfhbrub }

        let id = user[0].id;
        let username = user[0].user_name;

        const accessToken = JWTAuth.signJWT(
            id.toString(),
            username,
            process.env.JWT_ACCESS_SECRET,
            '30s'
        );

        const refreshToken = JWTAuth.signJWT(
            id.toString(),
            username,
            process.env.JWT_REFRESH_SECRET,
            '1d'
        );

        // check if user has verified account through email

        let verifyUserSQL = `

        SELECT verified
        FROM users
        WHERE id = ${id}
    `

        db.query(verifyUserSQL, (error, results) => {

            if (error) {

                return resp.json({error: 'email not verified'});
            }

            if (results.length > 0 && results[0].verified === 1) {

                // send them a token to use till we decide to expire it
                return resp.json({success: 'success', accessToken: accessToken, refreshToken: refreshToken})

            } else {

                return resp.json({error: 'email not verified'});
            }


        })


        // send them a token to use till we decide to expire it
        // also set it to the header
        // req.headers['authorization'] = 'Bearer ' + token;
        // return resp.json({success:'success', accessToken:accessToken, refreshToken: refreshToken})

    } else {

        return resp.json({issue: 'Invalid credentials'})
    }

}


let getAccessToken = (req, resp) => {

    let {refreshToken} = req.body;

    try {

        // verify the refresh token coming in making sure it wasn't tampered with
        const userInfo = jwt.verify( // gives decoded version of middle part -> { _id , username }

            refreshToken,
            process.env.JWT_REFRESH_SECRET
        )


        console.log(userInfo)

        let userId = userInfo.id;
        let username = userInfo.username;


        let accessToken = JWTAuth.signJWT(
            userId,
            username,
            process.env.JWT_ACCESS_SECRET,
            '15s'
        )

        // no need to change to refresh token
        console.log(accessToken);
        resp.status(200).json(accessToken); // send the new access token to the browser

    } catch (e) {

        resp.status(200).json('restricted'); // send the new access token to the browser

    }

}

/*

*/
let getUserInfo = (req, resp) => {

    const {refreshToken} = req.body; // grabbing the token we sent from the client


    try {

        const userInfo = JWTAuth.verifyJWT( // gives decoded version of middle part -> { _id , username }

            refreshToken,
            process.env.JWT_REFRESH_SECRET
        )

        let userId = userInfo.id; // because it is an int
        let username = userInfo.username;


        const sql = `
    
    
                SELECT 
                    user_name,
                    email
                FROM users
                WHERE  user_name = '${username}';
    `

        db.query(sql, (err, result) => {

            if (err) { // if there's an error
                throw err;
            } else { // if there's no error send us the result AKA query we just made

                result.length === 0 ?
                    resp.json({message: 'there are no users in the database'})
                    :
                    resp.json(result);
            }
        });

    } catch (e) {

        console.log(e.name);

        if (e.name === 'TokenExpiredError') {

            resp.json({unauthorized: 'unauthorized'})

        } else if (e.name === 'JsonWebTokenError' || e.name) {

            resp.json({restricted: 'restricted'})
        }

    }

}


let deleteLogout = (req, resp) => {


    try {

        let {refreshToken} = req.body;

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

    } catch (e) {


    }
}


let sendEmail = async (receiver, subject, body) => {

    let transporter = await nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_MY_EMAIL,
        to: receiver,
        subject: subject,
        html: body
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            // console.log(error.name);

            // throw Error(error);

        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}


let verifyEmailToken = (req, resp) => {

    let {token} = req.query;


    console.log(token);

    try {

        // get id from token query
        let userId = parseInt(JWTAuth.verifyJWT(
            token,
            process.env.JWT_EMAIL_SECRET
        ).id);

        // update the user to verified
        let verifyUserSQL = `
        UPDATE users
        SET verified = ${1}
        WHERE id = ${userId}
    `

        db.query(verifyUserSQL, (error, results) => {

            if (error) {

                return resp.status(401).json({error: 'email not verified'});

            } else {

                return resp.redirect('/');
                // return resp.json({success : 'email verified'});
            }

        });

    } catch (e) {

        console.log(e)
        return resp.status(401).json({error: 'email not verified'});
    }

}


let updateUserInfo = async (req, resp) => {

    let {username, email, currentPassword, newPassword, refreshToken} = req.body;

    let issues = {};

    // user did not send anything to be updated
    if (username === 'false' &&
        email === 'false' &&
        currentPassword === 'false' &&
        newPassword === 'false'
    ) {

        return resp.json({noupdate: 'no update'});
    }

    try {

        // VERIFY REFRESHTOKEN
        let userInfo = JWTAuth.verifyJWT(refreshToken, process.env.JWT_REFRESH_SECRET);
        let userId = parseInt(userInfo.id);


        // CHECK USERNAME NOT TAKEN
        if (username !== false) {


            let checkUsernameSQL = `
        
            SELECT user_name 
            FROM users 
            WHERE user_name = '${username}';
        `
            let usernameExists = await query(checkUsernameSQL)
                .then(results => results.length > 0)
                .catch((e) => {
                    console.log(e)
                });

            if (usernameExists) {

                issues.username = 'Username already exists'

            }
        }


        // CHECK EMAIL NOT TAKEN
        if (email !== false) {

            let checkEmailSQL = `
                
                    SELECT email 
                    FROM users 
                    WHERE email = '${email}';
                `


            let emailExists = await query(checkEmailSQL)
                .then(results => results.length > 0)
                .catch((e) => {
                    console.log(e)
                });

            if (emailExists) {
                issues.email = 'Email already exists'

            } else if (!emailValidator.validate(email)) {

                issues.email = 'Invalid email';

            }

        }


        // CHECK THAT THE PASSWORD IS THE SAME AS THE OLD
        if (currentPassword !== false) {

            let currentPasswordSQL = `
                            SELECT
                                password
                            FROM users
                            WHERE id = ${userId};
                        `

            let password = await query(currentPasswordSQL)
                .then(results => results)
                .catch((e) => {
                    console.log(e)
                });

            // CURRENT AND NEW WERE THE SAME
            if (currentPassword === newPassword) {

                issues.currentPassword = 'New password cannot be the same as the old';

                // CHECK CURRENT PASSWORD
            } else if (await bcrypt.compare(currentPassword, password[0].password)) {


                // CHECK NEW PASSWORD IS VALID
                if (passwordComplexity().validate(newPassword).error) {

                    let messages = (passwordComplexity().validate(newPassword).error).toString().split("{")
                    let allMessages = messages[0].slice(16);
                    issues.newPassword = allMessages.split('.');

                }

                // USER DID NOT ENTER THE CORRECT PASSWORD
            } else {

                issues.currentPassword = 'Please enter your password';
            }
        }


        // NO ERRORS
        if (Object.keys(issues).length === 0) {

            // CHECK IF USERNAME WAS SENT TO BE UPDATED
            if (username !== false) {

                let updateUsername = `
                    UPDATE users
                    SET user_name = '${username}'
                    WHERE id = ${userId}
                `

                await query(updateUsername);
            }

            // CHECK IF EMAIL WAS SENT TO BE UPDATED
            if (email !== false) {

                let updateEmail = `
                    UPDATE users
                    SET email = '${email}'
                    WHERE id = ${userId}
                `

                await query(updateEmail);
            }

            // CHECK IF PASSWORD WAS SENT TO BE UPDATED
            if (currentPassword !== false && newPassword !== false) {

                let hashedNewPassword = await bcrypt.hash(newPassword, 10);

                let updatePassword = `
                    UPDATE users
                    SET password = '${hashedNewPassword}'
                    WHERE id = ${userId}
                `

                await query(updatePassword);
            }


            let updatedInfo = `
                
                SELECT
                    user_name,
                    email
                FROM users
                WHERE id = ${userId}
            
            `

            let userInfo = await query(updatedInfo)
                .then(results => results)
                .catch((e) => {
                    console.log(e)
                })

            // send info and new token
            let newRefreshToken = JWTAuth.signJWT(
                userId.toString(),
                userInfo[0].user_name,
                process.env.JWT_REFRESH_SECRET,
                '1d'
            )

            return resp.json({userInfo, newRefreshToken});

        } else {

            return resp.json({issues: issues});

        }


    } catch (e) {

        console.log(e);
    }

}

// when user clicks reset password from client, send them an email
let resetPassword = async (req, resp) => {

    let {email} = req.body;

    let issues = {};

    // verify email
    if (!email || typeof email !== 'string' || !emailValidator.validate(email)) {

        issues.email = 'Invalid email';

        return resp.json({issues});

    }

    let userByEmail = await getUserByEmail(email)
        .then(resp => resp)
        .catch((e) => {
            console.log(e)
        })


    // user does not exists in the db, don't send an email
    if (userByEmail.length <= 0) {

        return resp.json({userNotCreated:'user not created'})
    }

    /* USER EXISTS */
    let passwordToken = JWTAuth.signJWT(
        email,
        email,
        process.env.JWT_EMAIL_SECRET,
        '1800s' // 30 minutes
    );

    let requestToken = JWTAuth.signJWT(
        email,
        email,
        process.env.JWT_EMAIL_SECRET,
        '1800s' // 30 minutes
    );

    // check if token has already been added and has not expired before sending another email and addding it again

    let getTokenSQL = `
    
        SELECT request_token
        FROM users
        WHERE email = '${email}'
    
    `

    await query(getTokenSQL)
        .then((results) => {

            // token already exists
            if (results.length > 0) {

                // check if not expired to tell user to just check email
                jwt.verify(results[0].request_token, process.env.JWT_EMAIL_SECRET, async (error, decoded) => {

                    // token is still valid
                    if (decoded) {

                        return resp.status(401).json('restricted');

                        // token is not valid or has not yet been added
                    } else {

                        const body = mjml(`
                            <mjml>
                            
                              <mj-head>
                                <mj-style>
                                  @import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css";
                                </mj-style>
                              </mj-head>
                            
                              <mj-body>
                            
                                <!--<mj-section>
                                  <mj-column>
                                    <mj-image align="left" width="100px" src="https://whereonearthiswaldo.onrender.com/favicon.ico"></mj-image>
                                  </mj-column>
                            
                                </mj-section>-->
                            
                                <mj-section background-color="black">
                                  <mj-column>
                                    <mj-text align="center" color="white" font-size="40px"><i class="fa-solid fa-key"></i></mj-text>
                                  </mj-column>
                                </mj-section>
                            
                                <mj-section>
                                  <mj-column>
                            
                                    <mj-text align="center" font-size="40px">Password Reset</mj-text>
                            
                                    <mj-text align="center">Click the Button Below to Reset Your Password</mj-text>
                                    <mj-text align="center">This link is valid for 30 minutes</mj-text>
                            
                                    <mj-button background-color="black" href="https://whereonearthiswaldo.onrender.com/auth/reset?token=${passwordToken}">Reset Password</mj-button>
                                  </mj-column>
                            
                                </mj-section>
                              </mj-body>
                            </mjml>
                            `)


                        await sendEmail(email, "Request to Reset Password", body.html)
                            .then(async () => {


                                // add token to db to prevent user from always sending request for passwords until the 30 minutes are up
                                let sql = `
                            
                                    UPDATE users 
                                    SET request_token = '${requestToken}' 
                                    WHERE email = '${email}'
                                
                                `;

                                await query(sql);


                                return resp.status(200).json({success: 'success'})

                            })
                            .catch( (e)=>{ console.log(e); return resp.status(401).json({error: 'error'}) } );


                    }

                })
            }

        })
        .catch((e) => {
            console.log(e)
        })


}

let createPassword = async (req, resp) => {

    let {resetToken, password, passwordConfirmation} = req.body;

    let issues = {};

    try {

        // check token is valid
        let email;

        let userInfo = jwt.verify(resetToken, process.env.JWT_EMAIL_SECRET);

        email = userInfo.id;

        // verify password
        if (!password || typeof password !== 'string' || passwordComplexity().validate(password).error) {

            let messages = (passwordComplexity().validate(password).error).toString().split("{")
            let allMessages = messages[0].slice(16);

            issues.password = allMessages.split('.');
        }

        // verify passwords match
        if (passwordConfirmation !== password) {

            issues.passwordConfirmation = 'Passwords do not match';
        }

        // if there are any issues
        if (Object.keys(issues).length > 0) {

            return resp.json({issues});
        }

        // no issues, update passwords

        let hashedNewPassword = await bcrypt.hash(password, 10);

        let updatePassword = `
                    UPDATE users
                    SET password = '${hashedNewPassword}'
                    WHERE email = '${email}'
                `

        db.query(updatePassword);

        // ADD FEATURE : remove token from the db or wait until time is up to rest again
            // this is because we don't want users to spam change passwords using that link,
            // once they click reset password and it goes through, prevent them from trying to make another too soon

        return resp.json({success: 'success'});

    } catch (e) {


        console.log(e)
        return resp.json('restricted');

    }

}

// to take user to create new password page after clicking email
let getCreatePasswordPage = (req, resp) => {

    resp.sendFile(path.resolve(__dirname, '../public/createPassword.html'));

}

let deleteAccount = async (req, resp) => {

    let {refreshToken} = req.body;

    try {

        // VERIFY REFRESHTOKEN
        let userInfo = JWTAuth.verifyJWT(refreshToken, process.env.JWT_REFRESH_SECRET);
        let userId = parseInt(userInfo.id);

        // disable foreign key check
        await query(`SET FOREIGN_KEY_CHECKS=0;`);

        // delete records first
        let deleteRecordsSQL = `
  
            DELETE
            FROM users_stats
            WHERE id = ${userId};
        `

        // delete account
        let deleteAccountSQL = `
            
            DELETE
            FROM users
            WHERE id = ${userId};
        `

        await query(deleteRecordsSQL);
        await query(deleteAccountSQL);

        // re-enable foreign key check
        await query(`SET FOREIGN_KEY_CHECKS=1;`);


        return resp.json({success: 'account deleted'})

    } catch (e) {

        console.log(e)
    }
}

module.exports = {

    postRegister,
    postLogin,
    getUserInfo,
    getAccessToken,
    deleteLogout,
    sendEmail,
    verifyEmailToken,
    updateUserInfo,
    getCreatePasswordPage,
    resetPassword,
    createPassword,
    deleteAccount
}

