let path = require("path");


let getAboutPage = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, './public/about.html') );

}


let getPlayPage = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, './public/play.html') );

}


let get404Page = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, './public/404.html') );

}


module.exports = {

    getAboutPage,
    getPlayPage,
    get404Page

}