const nodemailer = require('nodemailer')
const {subscribeToEmailEvents} = require('./pubsub')


const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : '',
        pass : ''
    }
})


function EmailHandler(data){
    const {Url ,email ,status} = data
    const mailOptions = {
        from : 'subhamnayak9638@gmail.com',
        to : email,
        subject : `alert : ${Url} is ${status}`,
        text :  `Hello,\n\nWe detected that ${Url} is ${status} .\n\nRegards,\nUptime Monitor Bot`,
    }
    transporter.sendMail(mailOptions,(error,info) =>{
        if(error) {
            return console.error('email failed',error)
        }
        console.log(`alert sent to ${email} for ${Url}`)
    })
}

subscribeToEmailEvents(EmailHandler);