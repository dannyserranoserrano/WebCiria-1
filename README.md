# **CIRIA (Aplicación para gestión de eventos keD@MOS???)**
## **Descripción del proyecto.**
* En este proyecto intento abarcar diferentes aplicaciones, todas unidas en un espacio comun donde cualquier usuario sin  necesidad de login pueda acceder y consultar la información principal así como su galería de imágenes, pero que contenga mucho más una vez logueado. 
* La primera aplicación consistirá en un espacio donde los usuarios logueados podrán crear nuevos eventos puntuales para que quien lo desee pueda inscribirse y participar. En él, podran decidir el tipo de actividad a realizar, desde una ruta senderista, paseo en bici, comidas o cenas populares, etc. En dicho evento, se podran introducir imágenes que despues se  visualizarán, por ejemplo si se realiza de nuevo esa ruta como información, o si se desea visualizar en un futuro a modo de album multimedia. En caso de que dicha actividad fuese de pago, que pueda realizarlo mediante un sistema como  tarjeta, paypal, etc.

## Relación entre Modelos.
<img src="/images/Relación entre modelos.jpg" style="width: 800px;" alt="relacion entre modelos">

## Esquema estructural de la web
<img src="/images/Diagrama_Proyecto3.png" style="width: 800px;" alt="Esquema estructural de la web">

## Tecnologias empleadas
<img src="/images/GrupoLogos.png" style="width: 800px;" alt="Tecnologías empleadas">

## Caracteristicas de la Aplicación.

* Sistema de **inicio de sesión / registro:**
    - Espacio en el cual si no estas registrado podrás realizar tu registro introduciendo **nombre completo, clave, ciudad de residencia, email y teléfono.** El email y la clave serás los datos de logueo para el usuario. Si ya estás registrado, introducirás el **correo y contraseña**, ello te llevará a la siguente pantalla que dependerá de si eres usuario o administrador.

* **Panel de usuario / administrador**

    ***-Panel de usuario:*** 
    - Podrá seleccionar la entrada a la **zona de eventos**, visitar la **zona multimedia**, entrar en tu **perfil de usuario** y editar Ciudad, Telefono y la Clave.
    * En la **Zona de eventos** se mostrarán todos los **eventos activados** y se podrá seleccionar el que desee para inscribirse,en el cual se hará el **pago** en caso de tener coste, **activar nuevos eventos** para que otros usuarios puedan inscribirse y **consultar los eventos pasados**. El sistema de eventos **desactivará cada evento** que halla caducado en fecha, pero se conservarán sus datos para poder ser consultados. 
    * El evento contendrá el **precio** en caso de que tenga, la **fecha y hora** de su realización, el **tipo de evento** que se quiere celebrar,la **descripción** del mismo y archivos **multimedia** que se hallan insertado en el sistema y estén relacionados con ello mediante etiquetas. 
    * El Modelo de archivos **multimedia** incluirán el nombre del archivo, la descripcion del mismo, **Fecha** de creación, y el  **usuario** que lo ha introducido. 
    * El modelo de **tipo de actividad** contendrá el **nombre de actividad** como por ejemplo marcha senderista, ruta en bici, comidas o cenas populares, partidos de frontón, misas, etc, es decir, diferentes actividades predefinidas, así como su precio en caso de que tuviese un coste. 
    * El modelo de **Pago** contendrá los modos de pago guardados por el usuario, así como el nombre de usuario.

    ***-Panel de administrador:*** 
    - Contendrá los mismos elementos que el Panel de usuario, pero con opciones añadidas como la **Gestión y creación** de nuevos eventos, **Gestión y borrado** de archivos insertados por los usuarios o gestión de usuarios.


## **Reparto de archivos en carpetas:**

* *CARPETA **API:***
    * En dicha carpeta se almacenan todos los archivos JSON referentes a las rutas de los modelos, que serán las encargadas de crear los enlaces a las diferentes funciones.

        - ***UserRouter:*** Este archivo contiene las rutas para crear un nuevo usuario, visualizar todos los usuarios, visualizar un solo usuario, modificar los datos de usuario, borrar un usuario o loguearte para entrar en la aplicación.
            - **Crear** nuevo usuario **.post (/users):** Este enlace nos permite introducir nuestros datos para poder registrarnos y acceder a mas opciones. Para realizar esto no es necesario tener **ningun permiso** en especial, se realiza desde la página principal, introduciendo Nombre y apellido, correo electrónico, ciudad de residencia y contraseña. 
            - **Modificar** los datos de usuario **.put (/updateUser/:id):** Desde aqui podremos modificar nuestros datos no esenciales tales como **Nombre, Apellido y Ciudad** de residencia. El correo electrónico no se podra modificar ya que es éste quien nos otorga el usuario. La opción de modificar datos unicamente se podrá realizar si previamente te has **logueado** como usuario en la cuenta.
            - **Borrar** cuenta de usuario **.delete (/deleteUser/:id):** Desde aqui podremos eliminar nuestra cuenta con todos  nuestros datos datos. Para ello tendremos que estar **logueados** como  usuario.
            - **Visualizar todos** los usuarios **.get (/users):** Desde esta ruta podremos visualizar la lista de usuarios registrados en el sistema. Esta ruta es exclusica del **administrador**, por ello tendremos que habernos logueado como tal para realizar dicha operación.
            - **Visualizar un** usuario **.get (/findUser/:id):** Desde esta ruta podremos visualizar todos nuestro datos registrados. Para ello necesitas haberte **logueado** como usuario previamente. 
            - **Loguearte** como usuario/administrador **.post (/login):** Este es el paso previo para poder acceder. Aquí introduciremos nuestro correo electrónico y password y nos dará la posibilidad de realizar las funciones principales de la aplicación. al igual que el registro se realiza desde la página principal **sin haber realizado** ningun paso previo.

        - ***ReserveRouter:*** En este archivo tenemos las rutas para crear reservas, añadirnos como participantes de de un evento, visualizar todos los datos o uno en especifico, o borrar la reserva.
            - **Crear** nueva reserva **.post (/newReserve/:eventId):** Desde aqui crearemos una nueva reserva e inscribiremos al primer participante, para despues, que se puedan ir inscribiendo nuevos participantes. Para ello deberemos insertar el evento al que va relacionado así como el primer participante que lo realizará. Para todo ello debemos habernos inscrito y **logueado** en el sistema como usuario.
            - **Borrar** una reserva **.delete (/deleteReserve/:id):** Con esta ruta podremos borra una reserva. Para ello necesitamos ser **administrador** del sistema y estar logueados.
            - **Visualizar todas** las reservas **.get (/reserves):** Aqui se podrán revisar todas las reservas creadas. Para ello deberás ser **administrador** y estar logueado en el sistema. 
            - **Visualizar una** reserva **.get (/findReserve/:id):** quí podremos visualizar la reserva en la que estoy inscrito. Para ello deberemos estar **logueados** en el sistema. 

        - ***PaymentRouter:*** Este archivo contiene el sistema de pago *****FALTA CONCRETAR*****.  

        - ***FileRouter:*** En este archivo se encuentran las rutas para insertar imágenes asociadas a un evento, tambien podremos modificar, borrar, o visualizar dichas imágenes.
            - **Crear** o subir un nuevo archivo **.post (/newFile):** Desde aquí podremos subir imágenes a nuestro servidor, para ello además de seleccionar el archivo desde nuestras carpetas, necesitaremos añadir **Nombre** del archivo, **Descripción** de la imágen, **Fecha** de la obtención de la imagen, **Usuario** que la ha realizado y **Evento** al que pertenece. Para realizar esto debemos estar **logueados** como usuarios. 
            - **Modificar** datos del archivo **.put (/updateFile/:id):** Aquí podremos modificar datos insertados en el archivo tales como el **nombre** del archivo, la **descripción** de la imagen o la **fecha** de la toma de la imagen. Esto lo podrá realizar el usuario registrado y **logueado** que ha proporcionado dicha imagen.
            - **Borrar** un archivo **.delete (/deleteFile/:id):** Con esta ruta se puede borrar el archivo que deseemos. Esto solo puede realizarlo el **administrador** estando logueado.
            - **Visualizar todos** los archivos subidos **.get (/files):** Desde aqui podremos visualizar las imágenes que los **usuarios** han subido al servidor. Para ello **no es necesario** estar logueado.
            - **Visualizar un** archivo subido al servidor **.get (/findFiles/:id):** Al igual que con el anterior apartado, desde aquí podrás visualizar **un solo archivo**, y para ello **no es necesario** estar logueado.

        - ***EventRouter:*** Aqui tenemos las rutas para crear, modificar, borrar o visualizar los eventos que se van a celebrar.           
            - **Crear** un evento **.post (/newEvent):** Con esta ruta podremos crear un evento rellenando una serie de campos como el **Tipo de actividad** que vamos a realizar, la **descripción** del evento a realizar, el **Precio** del evento en caso de que sea de pago, el **Usuario** que ha creado el evento,y la **fecha de la actividad** a realizar. Para poder realizar esto, deberas estar **logueado** como usuario. 
            - **Modificar** los datos de un evento **.put (/updateEvent/:id):** Desde esta ruta se podrán **modificar** los datos    del evento tales como la **Actividad** a realizar, la **Descripción**, del evento, el precio en caso de tenerlo, el     **Usuario** que lo ha creado y la **Fecha del evento**. Para ello debemos estar registrados y **logueados** en la     aplicación. 
            - **Borrar** un evento creado **.delete (/deleteEvent/:id):** Con esto podemos **borrar** un evento ya creado, para ello debes estar logueado y ser **administrador** de la aplicación. 
            - **Visualizar todos** los eventos **.get (/events):** Se podrán visualizar todos los eventos que estén programados, para que así el que lo desee pueda inscribirse. Para ello **no es necesario** estar logueado. 
            - **Visualizar un** evento ya creado **.get (/findEvent/:id):** También podrá visualizarse un evento concreto, y al igual que la anterior ruta, no es necesario estar logueado.

        - ***ActivityRouter:*** En este archivo están las rutas para crear, modificar, borrar y visualizar las actividades  genéricas que se podrán realizar. 
            - **Crear** una nueva actividad **.post (/newActivity):** Aquí podremos crear una nueva actividad que mas tarde utilizaremos para definir los eventos. En ella deberemos rellenar los siguientes campos: **Nombre de la actividad, si es de pago o no lo es.** Para realizar esta acción debes ser **Administrador** de la aplicación.
            - **Modificar** los datos de una actividad ya creada **.put (/updateActivity/:id):** Con esto puedes modificar la actividad creada previamente con los campos Nombre de la actividad y si es de pago o no lo es. Para realizar la operación debes ser **Administrador** y estar logueado. 
            - **Borrar** una actividad previamente creada **.delete (/deleteActivity/:id):** Ruta para eliminar una actividad     creada. Para realizarlo, tienes que ser **Administrador** y estar logueado. 
            - **Visualizar todas** las actividades creadas **.get (/activities):** Con ello podras visualizar todas las operaciones creadas. Se puede realizar la consultasiendo un usuario **Logueado**. 
            - **Visualizar una** actividad de entre todas **.get (/findActivity/:id):** Desde aquí podrás visualizar una actividad que desees. Para realizarlo, deberas previamente, **Loguearte** como usuario. 
        
* *CARPETA **MODELS:*** 
    * En esta carpeta guardamos todos los archivos JSON con los modelos que vamos a utilizar. Estos modelos se relacionarán con los archivos **Router** comentados anteriormente. Se encuentra el esquema (Schema) con los datos que contrandrá el servidor.
            - **User**
            - **Reserve**
            - **Payment**
            - **File**
            - **Event**
            - **Activity**

* *CARPETA **MIDDLEWARE***
    * Aqui guardamos los archivos relacionados con la creacción del **Token de Autentificación** para acceder como usuarios, así como la creación del role de **Administrador**
            - **auth**
            - **authAdmin**