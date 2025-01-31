const nodemailer = require("nodemailer");

const userMail = process.env.MAIL_USER
const pass = process.env.MAIL_PSSWD

const transport = nodemailer.createTransport({ // Con esto creo la conexión SMTP y le paso las credenciales del correo remitente
    service: "Gmail",
    pool: true,
    host: 'smtp.gmail.com', // Gmail as mail client
    port: 465,
    secure: true, // use SSL

    auth: {
        user: userMail,
        pass: pass,
    },
    tls: {
        rejectUnauthorized: false
    },
});


// Aquí creo el correo de bienvenida que llamaré la función una vez creado el usuario

module.exports.sendWelcomeEmail = (name,surname,city,email,password) => {
    console.log("Send Mail Create User");
    transport.sendMail({
        from: userMail,
        to: email,
        subject: "¡Bienvenido a CIRIA!!!",
        html: `<h1>¡Datos de acceso a la aplicación!</h1>
        <h2>¡¡Hola ${name} ${surname}!!! </h2>
        <p>Tus datos de acceso son los siguientes:</p>
        <p><b>Nombre y Apellidos:</b> ${name} ${surname}</p>
        <p><b>Ciudad de Origen:</b> ${city}</p>
        <p><b>Correo electrónico :</b> ${email}</p>
        <p><b>Password:</b> ${password}</p>
        <p>Gracias por hacerte usuario de nuestra pagina web y esperemos que disfrutes! </p>
        </div>`,
    }).catch(err => console.log(err));
};



// --- donde USER_MAIL y PASS_MAIL son datos guardados en tu archivo .env y es tu correo con tu contraseña --- ojo, está hecho para gmail --- 