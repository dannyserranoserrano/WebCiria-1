import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/header/Header";
import "./addEvent.css";

const AddEvent = () => {
  const [addEvent, setAddEvent] = useState({
    activityId: "",
    name: "",
    description: "",
    price: "",
    dateActivity: "",
  });

  const [activity, setActivity] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getActivity = async () => {
      try {
        const response = await axios.get("/api/activities", {
          withCredentials: true
        });
        console.log('Activities response:', response.data);
        // Make sure we're accessing the correct property in the response
        setActivity(response.data.activities || []); 
      } catch (error) {
        console.error('Error fetching activities:', error);
        setErrorMessage("Error al cargar las actividades");
      }
    };
    getActivity();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Submitting event data:', addEvent);
      const response = await axios.post(
        "/api/newEvent",
        { ...addEvent },
        {
          withCredentials: true
        }
      );

      setSuccessMessage(response.data.message);

      setTimeout(() => {
        navigate("/events");
      }, 2000);
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Error al crear el evento");
      // Don't reload the page on error, just show the message
      // setTimeout(() => {
      //   window.location.href = "/events/addEvent";
      // }, 2000);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'activityId') {
      const selectedActivity = activity.find(a => a.activity_id === e.target.value);
      if (selectedActivity && selectedActivity.pay === 'Gratis') {
        setAddEvent({
          ...addEvent,
          activityId: e.target.value,
          price: '0'
        });
      } else {
        setAddEvent({
          ...addEvent,
          activityId: e.target.value,
          price: ''
        });
      }
    } else {
      setAddEvent({
        ...addEvent,
        [e.target.name]: e.target.value,
      });
    }
    console.log(addEvent);
  };

  return (
    <div className="addEvent">
      <div className="header">
        <Header />
      </div>
      <div className="container centerAddEvent">
        <div className="addEventTitle text-center">
          <p>AÑADIR EVENTO</p>
        </div>
        <form onSubmit={handleSubmit} className="col-auto">
          <div className="container inputsAddEvent">
            <div className="addEventName">
              <label className="form-label">Nombre del Evento</label>
              <input
                type="text"
                name="name"
                className="form-control"
                id="validationDefault01"
                onChange={handleChange}
                placeholder="Nombre del Evento"
                required
              />
            </div>
            <div className="addEventDescription">
              <label className="form-label">Descripción del Evento</label>
              <input
                type="text"
                name="description"
                className="form-control"
                id="validationDefault01"
                onChange={handleChange}
                placeholder="Descripción del Evento"
                required
              />
            </div>

            <div className="addEventActivity">
              <label className="form-label">Tipo de Actividad</label>
              <select
                className="form-select"
                name="activityId"
                onChange={handleChange}
                value={addEvent.activityId}
                aria-label="Default select example"
              >
                <option value="">Selecciona...</option>
                {/* Add a check to ensure activity is an array before mapping */}
                {Array.isArray(activity) && activity.map((e) => (
                  <option key={e.activity_id} value={e.activity_id}>
                    {e.name} ({e.pay})
                  </option>
                ))}
              </select>
            </div>

            <div className="addEventPrice">
              <label className="form-label">Precio del Evento</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  onChange={handleChange}
                  placeholder="0"
                  value={addEvent.price}
                  disabled={activity.find(a => a.activity_id === addEvent.activityId)?.pay === 'Gratis'}
                  min="0"
                  step="0.01"
                  aria-label="Amount (to the nearest euro)"
                  required
                />
                <span className="input-group-text">€</span>
              </div>
            </div>

            <div className="addEventDate">
              <label className="form-label">Fecha del Evento</label>
              <input
                type="datetime-local"
                className="form-control"
                name="dateActivity"
                onChange={handleChange}
              />
            </div>
          </div>
          {/* *****AVISOS DE ERRORES***** */}
          <div
            className="message_ok shadow-lg p-3 m-3 bg-body rounded border"
            style={{ display: successMessage ? "block" : "none" }}
          >
            <div>{successMessage}</div>
          </div>

          <div
            className="message_ok shadow-lg p-3 m-3 bg-body rounded border"
            style={{ display: errorMessage ? "block" : "none" }}
          >
            <div>{errorMessage}</div>
          </div>

          {/* *****Buttons***** */}
          <div className="container AddEventButtons">
            <div className=" row justify-content-between">
              <div className="col-auto">
                <Link className="btn btn-primary" type="button" to="/events">
                  Volver
                </Link>
              </div>
              <div className="col-auto">
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={
                    !addEvent.name.length ||
                    !addEvent.description.length ||
                    !addEvent.activityId.length ||
                    !addEvent.price.length ||
                    !addEvent.dateActivity.length
                  }
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
