const sgMail = require('@sendgrid/mail')

const sendgridapikey = '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'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcome = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'amasaabubakar@gmail.com',
        subject: 'Welcome',
        text: `Welcome to the app, ${name}. Once again welcome`
    })
}

const sendemaildelete = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'amasaabubakar@gmail.com',
        subject: 'Goodbye',
        text: `why are you leaving us ${name}, anything we can do to keep you.`
    })
}

module.exports = {
    sendWelcome,
    sendemaildelete
}

// sgMail.send({
//     to: 'amasaabubakar@gmail.com',
//     from: 'amasaabubakar@gmail.com',
//     subject: 'this is my first creation',
//     text: 'this is a test email sending.'
// })