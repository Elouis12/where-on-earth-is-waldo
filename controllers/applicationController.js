let path = require("path");


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


let get404Page = (req, resp)=>{

    resp.sendFile( path.resolve( __dirname, '../public/404.html') );

}


module.exports = {

    getHomePage,
    getRegisterPage,
    getLoginPage,
    getAboutPage,
    getPlayPage,
    getStatsPage,
    get404Page

}