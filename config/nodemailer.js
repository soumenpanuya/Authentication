const nodemailer =require('nodemailer');

const env =require('./enviroment');

exports.newmail = async (data)=>{

    let transporter = nodemailer.createTransport(env.smtp);
    let body = `<h2>Please click on below link to active your account..</h2>
    <p>http://localhost:1001/user/accountActivate/${data.token}</p>
    <p><b>NOTE</b> This link expaire in 15 minutes..</p>
    `

    try{
        let info = await transporter.sendMail({
            from : 'soumenpanuya4@gmail.com',
            to : data.email,
            subject : 'Account activation',
            html : body
        });

        console.log('mail send to the user..',info.response)


    }catch(err){
        console.log(err);
    }
}

