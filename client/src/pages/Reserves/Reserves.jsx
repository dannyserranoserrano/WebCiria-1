import React from "react";
import { Link } from "react-router-dom";
import "./reserves.css";
import Header from "../../components/header/Header";
import TablaReserves from "../../components/tablaReserves/TablaReserves";

const Reserves = () => {
  return (
    <div className="reserves">
      <div className="header">
        <Header />
      </div>
      <div className="container centerReserves">
        <TablaReserves />

        {/* *****Buttons***** */}
        <div className="container reservesButtons">
          <div className="row justify-content-start">
            <div className="addReserves col-auto">
              <Link className="btn btn-sm btn-primary " type="button" to="/">
                Volver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reserves;
