const path = require('path');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken')


let signJWT = (id, username, secret, expiration) => {


    return jwt.sign(

        {
            id,
            username
        },

        secret,

        {
            expiresIn : expiration
        }
    )

}

let verifyJWT = (token, secret) => {

    try {

        jwt.verify( token, secret);

    }catch (e){

        console.log(e)
    }

}


module.exports = {

    signJWT,
    verifyJWT
}