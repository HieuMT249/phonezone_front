import axios from "axios";
import images from "../assets/images";

//prime-react
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { useEffect, useRef, useState } from "react";

//react-icon
import { GiShoppingCart } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartProvider";

function Header({ toggleCartPopup }) {
  const menuRight = useRef(null);
  const navigate = useNavigate();
  const { cartCount, setCartCount } = useCart();

  const [user, setUser] = useState("");
  const [userInfo, setUserInfo] = useState();

  const items = [
    {
      label: "Profile",
      icon: "pi pi-user",
      items: [
        {
          label: "Thông tin",
          icon: "pi pi-info-circle",
          command: () => {
            navigate("/editprofile");
          },
        },
        {
          label: "Đơn hàng",
          icon: "pi pi-shopping-cart",
          command: () => {
            navigate("/order");
          },
        },
        {
          label: "Sản phẩm yêu thích",
          icon: "pi pi-heart",
          command: () => {
            navigate("/wishlist");
          },
        },
        {
          label: "Đổi mật khẩu",
          icon: "pi pi-key",
          command: () => {
            navigate("/changepassword");
          },
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: () => {
            localStorage.removeItem("token");
            navigate("/");
            window.location.reload();
          },
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user) {
          const email =
            user[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ];
          const u = await axios.get(
            `https://localhost:7274/api/Users/email/${email}`
          );
          setUserInfo(u.data);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchUser();
  }, [user]);

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

  useEffect(() => {
    if (userInfo) {
      const fetchCartCount = async () => {
        try {
          const response = await axios.get(
            `https://localhost:7274/api/Carts/count/${userInfo.id}`
          );
          setCartCount(response.data.count);
        } catch (error) {
          console.log("Error fetching cart count", error);
        }
      };
      fetchCartCount();
    }
  }, [userInfo]);

  return (
    <div className="flex items-center justify-between h-20 mb-10 shadow-xl">
      <img
        className="w-1/6 ml-10 cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
        src={images.logo}
        alt="PZ-logo"
      />

      <div className="flex items-center mr-10">
        {/* Cart */}
        <Avatar
          className="mr-6 p-overlay-badge bg-transparent"
          onClick={toggleCartPopup}
        >
          <GiShoppingCart
            size={"60px"}
            className="cursor-pointer hover:text-primary"
          />
          {cartCount > 0 ? <Badge value={cartCount}></Badge> : ""}
        </Avatar>

        {/* User */}
        {user ? (
          <div className="flex">
            <Avatar className="bg-second" icon="pi pi-user" shape="circle" />
            <Menu
              className="mt-4 min-w-56"
              model={items}
              popup
              ref={menuRight}
              id="popup_menu_right"
              popupAlignment="right"
            />
            <span
              className="flex items-center cursor-pointer font-semibold ml-2 hover:text-primary"
              onClick={(event) => menuRight.current.toggle(event)}
              aria-controls="popup_menu_right"
              aria-haspopup
            >
              {
                user[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                ]
              }
            </span>
          </div>
        ) : (
          <div className="flex items-center text-sm italic">
            <a className="hover:text-primary ml-2" href="/login">
              Đăng nhập
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
