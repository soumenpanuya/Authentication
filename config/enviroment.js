
// ---------use for development--------//
const development ={
    name: 'development',
    port :1001,
    db : "mongodb://127.0.0.1:27017/Authentication",
    session_secret : "secret",
    jwt_key : 'jwtkey',
    smtp :{
        service :'gmail',
        host :'smtp.gmail.com',
        port :587,
        secure :false,
        auth :{
            user : process.env.smtp_user ,  //  please replace smtp_user to your user..
            pass : process.env.smtp_pass  // replace smtp_pass to your...
        }
    },
    google_clientID : process.env.google_clientID,
    google_clientSecret : process.env.google_clientSecret,
    google_callbackURL : 'http://localhost:1001/user/google-auth-callback'
}

// --------------use for production-------------//
const production ={
    name: 'production',
    port : process.env.port,
    db : process.env.db,
    session_secret : process.env.session_secret,
    jwt_key : process.env.jwt_key,
    smtp :{
        service :'gmail',
        host :'smtp.gmail.com',
        port :587,
        secure :false,
        auth :{
            user : process.env.smtp_user ,  //  please replace smtp_user to your user..
            pass : process.env.smtp_pass  // replace smtp_pass to your...
        }
    },
    google_clientID : process.env.google_clientID,
    google_clientSecret : process.env.google_clientSecret,
    google_callbackURL : process.env.google_callbackURL
}

module.exports =eval(process.env.ev) == undefined ? development : eval(process.env.ev);