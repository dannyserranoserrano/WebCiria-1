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

module.exports.sendModifyEmail = (name, surname, city, email, password) => {
    console.log("Send Mail Modify User");
    transport.sendMail({
        from: userMail,
        to: email,
        subject: "MODIFICACIÓN EN TUS DATOS",
        html: `<h1>Se han modificado tus datos de la Web CIRIA</h1>
        <h2>¡¡Hola ${name} ${surname}!! </h2>
        <p>Tus datos de acceso han sido modificados de la siguiente manera:</p>
        <p><b>Nombre y Apellido:</b> ${name}, ${surname}</p>
        <p><b>Ciudad de origen:</b> ${city}</p>
        <p><b>Correo Electrónico:</b> ${email}</p>
        <p><b>Password:</b> ${password}</p>
        <p>Gracias por ser usuario de nuestra aplicación! </p>
        </div>`,
    }).catch(err => console.log(err));
};



// --- donde USER_MAIL y PASS_MAIL son datos guardados en tu archivo .env y es tu correo con tu contraseña --- ojo, está hecho para gmail --- 