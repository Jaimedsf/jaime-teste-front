import React, { Component } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom"; // Importe Navigate
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import AddClient from "./components/addclient.component";
import EventBus from "./common/EventBus";
import ClientsList from "./components/client.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
 

          <div className="navbar-nav mr-auto">
            {currentUser && (
              <React.Fragment>
                <li className="nav-item">
                  <Link to={"/cliente"} className="nav-link">
                    Clientes
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/addcliente"} className="nav-link">
                    Adicionar Clientes
                  </Link>
                </li>
              </React.Fragment>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                Inscrever-se
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route
              path="/"
              element={
                currentUser ? (
                  <Navigate to="/profile" /> // Redireciona para a página de perfil se estiver logado
                ) : (
                  <Login />
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
           
            {currentUser && (
              <React.Fragment>
                <Route path="/cliente" element={<ClientsList />} />
                <Route path="/addcliente" element={<AddClient />} />
              </React.Fragment>
            )}
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
