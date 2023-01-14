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

    /*try{*/

        // check refresh token
        jwt.verify( accessToken, process.env.JWT_ACCESS_SECRET, (error, decoded)=>{

            if( error ){

                return resp.json('restricted'); // to have user log back in

                // it is a valid refresh token, check the access token did not expire
            }else{

                // check access token
                jwt.verify( accessToken, process.env.JWT_ACCESS_SECRET, (error, decoded)=>{

                    if( error ){

                        return resp.json('unauthorized'); // to have user log back in

                    }else{

                        return resp.json('authorized');
                    }

                } );

            }

        } );


/*    }catch (e){

        if (e.name === 'TokenExpiredError') {

            resp.json('unauthorized');

        }else if( e.name === 'JsonWebTokenError' ){

            resp.json('restricted')
        }
    }*/
    /*let accessToken = req.cookies.accessToken;
    let refreshToken = req.cookies.refreshToken;

    if( !accessToken ){

        return resp.redirect('/login');
    }

    try{

        jwt.verify( accessToken, process.env.JWT_ACCESS_SECRET);

        console.log('token not yet expired');

    }catch (e){

        if( e.name === 'TokenExpiredError' ){

            console.log('expired token ')

            let newAccessToken = signJWT(refreshToken, JWT_REFRESH_SECRET);

            resp.cookie('accessToken', newAccessToken); // cookie sent on that rout
            resp.cookie('refreshToken', refreshToken);

        }else{

            resp.redirect('/login');
        }

    }

    return next(); // let them access the resource if no errors occurred
*/

}



module.exports = {

    signJWT,
    verifyJWT,
    authenticateJWT
}