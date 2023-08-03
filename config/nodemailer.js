const nodemailer =require('nodemailer');

const env =require('./enviroment');

class newmail{

    static activeAccountMail = async (data)=>{
    
        let transporter = nodemailer.createTransport(env.smtp);
        let body = `<h2>Please click on below link to active your account..</h2>
        <p>http://localhost:1001/user/registation-step2/${data.token}</p>
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

    static forgetPasswordMail = async(data)=>{
        let transporter = nodemailer.createTransport(env.smtp);
        let body = `<h2>Please click on below link to Reset your password..</h2>
        <p>http://localhost:1001/user/forgetPassword-step2/${data.token}</p>
        <p><b>NOTE</b> This link expaire in 15 minutes..</p>
        `

        try{
            let info = await transporter.sendMail({
                from : 'soumenpanuya4@gmail.com',
                to : data.email,
                subject : 'Reset Password',
                html : body
            });
    
            console.log('mail send to the user..',info.response)
    
    
        }catch(err){
            console.log(err);
        }

    }
}

module.exports = newmail;


