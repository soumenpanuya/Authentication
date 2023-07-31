const development ={
    name: 'development',
    port :1001,
    db : "mongodb://127.0.0.1:27017/Authentication",
    secret : "secret",
}

const production ={
    name: 'production',
    port : process.env.port,
    db : process.env.db,
    secret : process.env.secret,
}

module.exports =eval(process.env.ev) == undefined ? development : eval(process.env.ev);