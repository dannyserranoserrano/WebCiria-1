/* eslint-disable eqeqeq */
import React from "react";
import "./home.css";
import Header from "../../components/header/Header";
import TablaEvents from "../../components/tablaEvents/TablaEvents";
import Carousel from "../../components/carousel/Carousel";

const Home = () => {
  const role = localStorage.getItem("role");

  // ******INDEX UNLOGGED*****
  const Index = () => (
    <div className="index">
      <nav className="header">
        <Header />
      </nav>
      <section className="container home">
        <div className="container eventsIndex w-100">
          <TablaEvents />
        </div>
        <div className="container carruselIndex">
          <Carousel />
        </div>
      </section>
    </div>
  );

  // *****INDEX USER*****
  const IndexUser = () => (
    <div className="index">
      <nav className="header">
        <Header />
      </nav>
      <section className="container home">
        <div className="container eventsIndex w-100">
          <TablaEvents />
        </div>
        <div className="container carruselIndex">
          <Carousel />
        </div>
      </section>
    </div>
  );

  // *****INDEX ADMIN*****
  const IndexAdmin = () => (
    <div className="index">
      <nav className="header">
        <Header />
      </nav>
      <section className="container home">
        <div className="container eventsIndex w-100">
          <TablaEvents />
        </div>
        <div className="container carruselIndex">
          <Carousel />
        </div>
      </section>
    </div>
  );

  // *****Operacion ternaria multiple*****
  let home = role == 0 ? IndexUser() : role == 1 ? IndexAdmin() : Index();
  return <div>{home}</div>;
};

export default Home;
