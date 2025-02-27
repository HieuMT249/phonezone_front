import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import images from "../assets/images";

function WishList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [displayCount, setDisplayCount] = useState(20);
  const [user, setUser] = useState();

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const userId =
          user[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];

        const response = await axios.get(
          `https://localhost:7274/api/WishLists/items/${userId}`
        );

        const dataItems = response.data;
        const updatedDetails = await Promise.all(
          dataItems.map(async (item) => {
            const productResponse = await axios.get(
              `https://localhost:7274/api/Products/${item.productId}`
            );
            item.product = productResponse.data;
            return item;
          })
        );

        setProducts(updatedDetails);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu");
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [user]);

  const loadMore = () => {
    setDisplayCount((prevCount) => prevCount + 20);
  };

  return (
    <div className="py-6 px-10 min-h-screen flex flex-col">
      {loading ? (
        <div>
          <ProgressSpinner />
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <>
              <span className="mb-8 text-2xl font-semibold">
                Sản phẩm yêu thích
              </span>
              <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                {products.map((item, index) => (
                  <Card
                    key={index}
                    image={item?.product.image}
                    productName={item?.product.productName}
                    name={item?.product.id}
                    newPrice={item?.product.newPrice}
                    oldPrice={item?.product.oldPrice}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="min-h-screen flex flex-col items-center font-semibold">
              <img className="w-96 mb-6" src={images.empty} alt="cart-empty" />
              <span>Bạn không có sản phẩm yêu thích nào</span>
              <span>
                Hãy yêu thích sản phẩm bạn mong muốn để dễ dàng mua sắm
              </span>
              <button
                onClick={() => navigate("/")}
                className="mt-10 font-normal border border-primary py-4 px-6 rounded-lg hover:bg-primary hover:text-white hover:scale-125 transition-transform duration-200 ease-in-out"
              >
                Quay lại trang chủ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WishList;
