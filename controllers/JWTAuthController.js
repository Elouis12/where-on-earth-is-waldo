const jwt = require('jsonwebtoken');
const dotEnv = require("dotenv");
dotEnv.config();

let signJWT = (id, username, secret, expiration) => {


    // no expiration date for the token
    if( !expiration ){

        return jwt.sign(

            {
                id,
                username
            },
            secret
        )

    }else{

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

}

let verifyJWT = (token, secret) => {

    try {

        return jwt.verify( token, secret );

    }catch (e){

        console.log(e)
    }

}

let authenticateJWT = async (req, resp, next)=>{


    let { accessToken, refreshToken, resetToken } = req.body;


    if( resetToken ){

            jwt.verify( resetToken, process.env.JWT_EMAIL_SECRET, (error, decoded)=> {

                if (error) {

                    return resp.json('restricted'); // to have user log back in

                    // it is a valid reset token
                }else{

                    return resp.json('authorized'); // to have user log back in

                }
            });

    }else if ( refreshToken ){
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

    // no reset, access token nor refresh tokens were found
    }else if( !resetToken || !refreshToken || !accessToken ){

        console.log('3')
            return resp.json('restricted');

        }


}



module.exports = {

    signJWT,
    verifyJWT,
    authenticateJWT
}