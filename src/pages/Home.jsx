import { useEffect, useState } from "react";
import images from "../assets/images/index";
import Branch from "../components/Branch";
import CartPopUp from "../components/CartPopUp";
import Search from "../components/Search";
import { useNavigate } from "react-router-dom";
import CarouselDisplay from "../components/CarouselDisplay";
import CarouselProduct from "../components/CarouselProduct";

function Home() {
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const toggleCartPopup = () => {
    if (user) {
    } else {
      setIsCartVisible(!isCartVisible);
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
  }, [navigate]);

  const branchs = [
    {
      image: images.apple,
      alt: "apple",
      uri: "/dienthoai/iphone",
    },
    {
      image: images.asus,
      alt: "asus",
      uri: "/dienthoai/asus",
    },
    {
      image: images.honor,
      alt: "honor",
      uri: "/dienthoai/honor",
    },
    {
      image: images.huawei,
      alt: "huawei",
      uri: "/dienthoai/huawei",
    },
    {
      image: images.nokia,
      alt: "nokia",
      uri: "/dienthoai/nokia",
    },
    {
      image: images.oppo,
      alt: "oppo",
      uri: "/dienthoai/oppo",
    },
    {
      image: images.realme,
      alt: "realme",
      uri: "/dienthoai/realme",
    },
    {
      image: images.samsung,
      alt: "samsung",
      uri: "/dienthoai/samsung",
    },
    {
      image: images.vivo,
      alt: "vivo",
      uri: "/dienthoai/vivo",
    },
    {
      image: images.all,
      alt: "all",
      uri: "/dienthoai",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative flex justify-between h-[36rem] bg-gradient-15">
        <Search />
        <div className="pt-24 pl-28 mt-20 text-center">
          <h1 className="font-bold mb-4">
            Khám phá những sản phẩm công nghệ đỉnh cao, nâng tầm cuộc sống với
            thiết bị hiện đại, thông minh.
          </h1>
          <span>
            Cập nhật xu hướng công nghệ mới nhất, chọn lựa thiết bị phù hợp để
            tối ưu hóa cuộc sống của bạn.
          </span>
        </div>
        <img
          className="mr-20 mt-20"
          src={images.background}
          alt="background-phonezone"
        />
      </div>
      <h1 className="flex justify-center w-full font-bold mt-6 text-2xl">
        <span>Nhãn Hàng</span>
      </h1>
      <div>
        <div className="grid grid-cols-5 gap-6 justify-items-center">
          {branchs.map((branch, index) => (
            <Branch
              key={index}
              image={branch.image}
              alt={branch.alt}
              uri={branch.uri}
            />
          ))}
        </div>
        <div>
          <CarouselDisplay user={user} toggleCartPopup={toggleCartPopup} />
          {isCartVisible && !user && <CartPopUp onClose={toggleCartPopup} />}
        </div>
        <div>
          <CarouselProduct />
        </div>
      </div>
    </div>
  );
}

export default Home;
