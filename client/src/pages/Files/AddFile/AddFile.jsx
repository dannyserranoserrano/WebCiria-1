import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/header/Header";
import "./addFile.css";

const AddFile = () => {
  const [addFile, setAddFile] = useState({
    fileName: "",
    description: "",
    date: "",
    event: "",
    image: "",
  });

  const [events, setEvents] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      const response = await axios.get("/api/events", {
        withCredentials: true
      });
      //console.log(response.data.events);
      setEvents(response.data.events);
    };
    getEvents();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      console.log('Selected file:', file);
      if (!file) {
        alert("No se ha subido ningún archivo");
        return;
      }
      if (file.size > 4024 * 4024 * 2) {
        alert("Archivo demasiado grande");
        return;
      }
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        alert("Formato de archivo no soportado");
        return;
      }
      setAddFile({
        ...addFile,
        image: file
      });
      console.log('Updated addFile state with image:', addFile);
    } else {
      setAddFile({
        ...addFile,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission - Current addFile state:', addFile);

    // Validate all required fields
    if (!addFile.fileName || !addFile.description || !addFile.date || !addFile.event || !addFile.image) {
      console.log('Missing required fields:', {
        fileName: !!addFile.fileName,
        description: !!addFile.description,
        date: !!addFile.date,
        event: !!addFile.event,
        image: !!addFile.image
      });
      setErrorMessage("Por favor, complete todos los campos requeridos.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fileName', addFile.fileName);
      formData.append('description', addFile.description);
      formData.append('date', addFile.date);
      formData.append('event', addFile.event);
      formData.append('file', addFile.image);

      // Get the token from localStorage
      const token = localStorage.getItem('firstLogin');
      
      const response = await axios.post(
        "/api/newFile",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token
          },
          withCredentials: true
        }
      );

      setSuccessMessage(response.data.message);
      // setTimeout(() => {
      //   navigate("/files");
      // }, 2000);
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage(
        error.response?.data?.message || "Error al subir el archivo. Por favor, inténtelo de nuevo."
      );
    }
  };

  return (
    <div className="addFile">
      <div className="header">
        <Header />
      </div>
      <div className="container">
        <div className="addFileTitle text-center">
          <p>AÑADIR IMAGEN</p>
        </div>

        <form onSubmit={handleSubmit} className="col-auto">
          <div className="container inputAddFile">
            <div className="addFileName">
              <label className="form-label ms-3">Nombre de la Imágen</label>
              <input
                type="text"
                name="fileName"
                className="form-control"
                id="validationDefault01"
                onChange={handleChange}
                placeholder="Titulo de la imagen"
                required
              />
            </div>

            <div className="AddFileDescription">
              <label className="form-label ms-3">
                Descripción de la Imágen
              </label>
              <input
                type="text"
                name="description"
                className="form-control"
                id="validationDefault01"
                onChange={handleChange}
                placeholder="Introduce una Descripción"
                required
              />
            </div>

            <div className="addFileActivity">
              <label className="form-label ms-4">Evento Relacionado</label>
              <select
                className="form-select"
                name="event"
                value={addFile.event}
                onChange={handleChange}
                aria-label="Default select example"
              >
                <option value="">Selecciona...</option>
                {events.map((event) => (
                  <option key={event.event_id} value={event.event_id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="addFileDate">
              <label className="form-label ms-5">Fecha de la imágen</label>
              <input
                type="date"
                className="form-control"
                name="date"
                onChange={handleChange}
              />
            </div>

            <div className="addFileImage">
              <label className="form-label ms-5">Añadir Imágen</label>
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={handleChange}
              />
            </div>
          </div>
          {/* *****AVISOS DE ERRORES***** */}
          <div
            className="message_ok shadow-lg p-1 bg-body rounded border"
            style={{ display: successMessage ? "block" : "none" }}
          >
            <div>{successMessage}</div>
          </div>
          <div
            className="message_nok shadow-lg p-1 bg-body rounded border"
            style={{ display: errorMessage ? "block" : "none" }}
          >
            <div>{errorMessage}</div>
          </div>

          {/* *****Buttons***** */}
          <div className="container addFileButtons">
            <div className=" row justify-content-between">
              <div className="col-auto">
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={
                    !addFile.fileName.length ||
                    !addFile.description.length ||
                    !addFile.date.length ||
                    !addFile.event.length ||
                    !addFile.image
                  }
                >
                  Añadir
                </button>
              </div>
              <div className="col-auto">
                <Link className="btn btn-primary" type="button" to="/files">
                  Volver
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFile;
