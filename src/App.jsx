import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/Admin/AdminLayout/AdminLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { publicRoutes, privateRoutes, adminRoutes } from "./routes";
import DefaultLayout from "./components/DefaultLayout";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function App() {
  const [user, setUser] = useState(null);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = atob(base64);
      return JSON.parse(decodedPayload);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = parseJwt(token);
      if (decodedToken) {
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();
        if (expirationTime > currentTime) {
          setUser(decodedToken);
        } else {
          localStorage.removeItem("token");
        }
      }
    }
  }, []);

  return (
    <Router>
      <div className="App font-sans">
        <Routes>
          {/* Admin Routes */}
          {user?.[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] === "Admin" &&
            adminRoutes.map((route, index) => {
              const Layout = route.layout || AdminLayout;
              const Page = route.component;

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

          {/* Private Routes */}
          {user &&
            privateRoutes.map((route, index) => {
              const Layout = route.layout || DefaultLayout;
              const Page = route.component;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

          {/* Public Routes */}
          {publicRoutes.map((route, index) => {
            const Layout = route.layout || DefaultLayout;
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
