const jwt = require('jsonwebtoken');
const dotEnv = require("dotenv");
dotEnv.config();

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

        return jwt.verify( token, secret);

    }catch (e){

        console.log(e)
    }

}

let authenticateJWT = async (req, resp, next)=>{


    let { accessToken, refreshToken } = req.body;

    // no access token nor refresh tokens were found
    if( !refreshToken || !accessToken ){

        return resp.json('restricted');

    }
        // check refresh token
        jwt.verify( refreshToken, process.env.JWT_REFRESH_SECRET, (error, decoded)=>{

            if( error ){

                return resp.json('restricted'); // to have user log back in

            // it is a valid refresh token, check the access token did not expire
            }else{

                // check access token
                /*jwt.verify( accessToken, process.env.JWT_ACCESS_SECRET, (error, decoded)=>{

                    if( error ){

                        return resp.json('unauthorized'); // to have user log back in

                    }else{*/

                        return resp.json('authorized');
                    /*}

                } );*/

            }

        } );

}



module.exports = {

    signJWT,
    verifyJWT,
    authenticateJWT
}