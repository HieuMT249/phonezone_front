import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import CartPopUp from "./CartPopUp";
import { useNavigate } from "react-router-dom";
import { CartProvider } from "./CartProvider";

function DefaultLayout({ children }) {
  const [user, setUser] = useState();
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const toggleCartPopup = () => {
    setIsCartVisible(!isCartVisible);

    if (user) {
      navigate("/cart");
    }
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = atob(base64);

      return JSON.parse(decodedPayload);
    } catch (e) {
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
          navigate("/");
        }
      }
    }
  }, []);

  return (
    <CartProvider>
      <div className="relative">
        <Header toggleCartPopup={toggleCartPopup} />
        <div id="categories">{children}</div>
        {isCartVisible && !user && <CartPopUp onClose={toggleCartPopup} />}
        <div id="aboutus">
          <Footer />
        </div>
      </div>
    </CartProvider>
  );
}

export default DefaultLayout;
