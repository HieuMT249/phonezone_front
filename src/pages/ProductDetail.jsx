import axios from "axios";
import { Galleria } from "primereact/galleria";
import { BsCartPlus } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { FaGift } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Skeleton } from "primereact/skeleton";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import CartPopUp from "../components/CartPopUp";
import { useCart } from "../components/CartProvider";

function ProductDetail() {
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState();
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [product, setProduct] = useState();
  const [productDetail, setProductDetail] = useState(null);
  const [images, setImages] = useState(null);
  const [isExpand, setIsExpand] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const { setCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);

  const specs = [
    { label: "Kích thước màn hình", value: productDetail?.screenSize },
    { label: "Công nghệ màn hình", value: productDetail?.screenTechnology },
    { label: "Dung lượng Pin", value: productDetail?.batteryCapacity },
    { label: "Bộ nhớ trong", value: productDetail?.internalMemory },
    { label: "Tính năng màn hình", value: productDetail?.screenFeatures },
    { label: "Độ phân giải", value: productDetail?.screenResolution },
    { label: "Chip", value: productDetail?.chip },
    { label: "Công nghệ NFC", value: productDetail?.nfc },
    { label: "CPU", value: productDetail?.cpu },
    { label: "Dung lượng RAM", value: productDetail?.ram },
    { label: "Cảm biến", value: productDetail?.sensor },
    { label: "sim", value: productDetail?.sim },
    { label: "Camera sau", value: productDetail?.rearCamera },
    { label: "Camera trước", value: productDetail?.frontCamera },
    { label: "Pin", value: productDetail?.batteryCapacity },
    { label: "Tính năng đặc biệt", value: productDetail?.specialFeatures },
    { label: "Vân tay", value: productDetail?.fingerprintSensor },
    { label: "Công nghệ sạc", value: productDetail?.chargingTechnology },
    { label: "GPS", value: productDetail?.gps },
    { label: "Bluetooth", value: productDetail?.bluetooth },
    { label: "Wi-fi", value: productDetail?.wifi },
    { label: "Hỗ trợ mạng", value: productDetail?.networkSupport },
    { label: "Hỗ trợ sạc tối đa", value: productDetail?.chargingSupport },
    { label: "GPU", value: productDetail?.gpu },
    { label: "Tính năng camera", value: productDetail?.cameraFeatures },
    { label: "Kháng nước, bụi", value: productDetail?.waterResistant },
    { label: "Bảo hành", value: productDetail?.guarantee },
    { label: "Hãng", value: productDetail?.company },
    { label: "Thương hiệu", value: productDetail?.country },
    { label: "Pin và nguồn", value: productDetail?.battery },
    { label: "Sạc và kết nối", value: productDetail?.chargingConnectivity },
    { label: "Video", value: productDetail?.video },
    { label: "Trọng lượng", value: productDetail?.weight },
    { label: "Màu sắc", value: productDetail?.colour },
    { label: "Camera", value: productDetail?.camera },
    { label: "Màn hình", value: productDetail?.screen },
  ];

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
      sessionStorage.removeItem("previousUrl");
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
    } else {
      sessionStorage.setItem("previousUrl", location.pathname);
    }
  }, [navigate]);

  const toggleExpand = () => {
    setIsExpand(!isExpand);
  };

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

  const responsiveOptions = [
    {
      breakpoint: "991px",
      numVisible: 4,
    },
    {
      breakpoint: "767px",
      numVisible: 3,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
    },
  ];

  const id = localStorage.getItem("name");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7274/api/Products/${id}`
        );
        const responseDetail = await axios.get(
          `https://localhost:7274/api/Specifications/${id}`
        );

        setProduct(response.data);
        setProductDetail(responseDetail.data);
      } catch (err) {
        console.log("Không thể tải dữ liệu");
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const thumbnails = productDetail?.thumbnails
      ? productDetail.thumbnails.split(", ")
      : [];
    product &&
      thumbnails &&
      setImages([
        {
          itemImageSrc: product.image,
          thumbnailImageSrc: product.image,
          alt: product.productName,
        },
        ...thumbnails.map((thumbnail) => ({
          itemImageSrc: thumbnail,
          thumbnailImageSrc: thumbnail,
          alt: product.productName,
        })),
      ]);
  }, [product, productDetail]);

  const itemTemplate = (item) => {
    return (
      <img
        className="h-[22rem] max-w-[30rem] py-10"
        src={item.itemImageSrc}
        alt={item.alt}
      />
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img
        className="w-14 bg-white"
        src={item.thumbnailImageSrc}
        alt={item.alt}
      />
    );
  };

  const parseData = () => {
    let h2 = "";
    let ul = [];

    // Sản phẩm nổi bật
    if (!productDetail?.outstandingFeatures) {
      return { h2, ul };
    }
    const dataSplit = productDetail?.outstandingFeatures.split("#H2#") || [];

    h2 = dataSplit[1]
      ? dataSplit[1].split("', '").filter((item) => item !== "")
      : "";

    if (dataSplit[2]) {
      ul = dataSplit[2].split("', '#LI#").filter((item) => item !== "");
    }

    if (ul[ul.length - 1]?.includes("']")) {
      ul[ul.length - 1] = ul[ul.length - 1].replace("']", "");
    }

    // thông tin sản phẩm
    const dataPD =
      product?.productDescription
        .split(" #P# ")
        .filter(
          (item) =>
            item !== "Nội dung chính" &&
            item !== "Phiên bản" &&
            item !== "Giá bán"
        ) || [];
    const temp = dataPD
      .shift()
      .split("#H2# ")
      .filter((item) => item !== "");
    const h3PD = temp
      .filter((item) => item.includes("#H3# "))
      .map((item) => {
        return item.split("#H3# ");
      });

    const h2PD = temp.filter((item) => !item.includes("#H3# "));
    return { h2, ul, dataPD, h2PD, h3PD };
  };

  const { h2, ul, dataPD, h2PD, h3PD } = parseData();

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

  const handleAddCart = async (userId, productId) => {
    if (!user) {
      setIsCartVisible(!isCartVisible);
    } else {
      const data = {
        userId: userId,
        productId: productId,
      };

      try {
        await axios.post(`https://localhost:7274/api/Carts/add-cart`, data);
        const response = await axios.get(
          `https://localhost:7274/api/Carts/count/${userInfo.id}`
        );
        setCartCount(response.data.count);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Sản phẩm đã được thêm vào giỏ hàng.",
          life: 2000,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleBuyNow = async (userId, productId) => {
    if (!user) {
      setIsCartVisible(!isCartVisible);
    } else {
      const data = {
        userId: userId,
        productId: productId,
      };

      try {
        await axios.post(`https://localhost:7274/api/Carts/add-cart`, data);
        const response = await axios.get(
          `https://localhost:7274/api/Carts/count/${userInfo.id}`
        );
        setCartCount(response.data.count);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Sản phẩm đã được thêm vào giỏ hàng.",
          life: 2000,
        });

        navigate("/cart");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      {isCartVisible && !user && <CartPopUp onClose={handleAddCart} />}
      <div className="flex justify-around min-w-96 py-6 px-32">
        <div className="bg-white ">
          <Galleria
            className="min-w-96 bg-white"
            circular
            autoPlay
            transitionInterval={3000}
            showItemNavigatorsOnHover
            showItemNavigators
            value={images}
            responsiveOptions={responsiveOptions}
            numVisible={5}
            item={itemTemplate}
            thumbnail={thumbnailTemplate}
          />
        </div>
        {product && (
          <div className="py-10 px-6">
            <h1 className="text-3xl font-bold w-full">{product.productName}</h1>
            <div className="mt-4">
              <div className="mb-2">Giá bán</div>
              <div className="text-2xl">
                <span className="text-primary font-bold mr-6">
                  {product.newPrice}
                </span>
                <span className="text-gray-300 line-through text-xl">
                  {product.oldPrice === "Không rõ giá" ? "" : product.oldPrice}
                </span>
              </div>
              <div className="mt-4 border border-primary rounded-xl">
                <div className="flex items-center text-primary p-2 bg-second rounded-t-xl">
                  <i>
                    <FaGift />
                  </i>
                  <span className="ml-2">Khuyến mãi</span>
                </div>
                <ul className="p-4">
                  <li className="mb-4">
                    <span className="py-1 px-2 text-white mr-2 bg-primary rounded-full">
                      1
                    </span>
                    Trả góp 0% đến 12 tháng
                  </li>
                  <li>
                    <span className="py-1 px-2 text-white mr-2 bg-primary rounded-full">
                      2
                    </span>
                    Tặng ốp lưng chính hãng
                  </li>
                </ul>
              </div>
              <div className="flex items-center mt-10">
                <div
                  onClick={() => handleBuyNow(userInfo.id, id)}
                  className="text-center text-white bg-primary hover:opacity-60 px-10 py-4 rounded-xl"
                >
                  <p className="text-lg font-semibold">Mua ngay</p>
                  <p className="text-md font-thin">
                    (Giao nhanh từ 2 giờ trong nội thành)
                  </p>
                </div>
                <button
                  onClick={() => handleAddCart(userInfo.id, id)}
                  className="border border-primary rounded-xl px-10 py-6 hover:bg-primary hover:opacity-60 ml-6 text-3xl hover:text-white"
                >
                  <BsCartPlus />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="relative flex justify-around text-3xl border border-2 border-transparent border-t-gray-200 pb-20 pt-10 mx-10">
        {product?.productDescription && productDetail?.outstandingFeatures ? (
          <>
            <div
              className={`border bg-white drop-shadow-xl w-2/3 mr-4 rounded-xl p-4 overflow-hidden transition-all duration-500  ${
                isExpand ? "" : "max-h-[30rem]"
              }`}
            >
              {h2 && ul && (
                <div className={`bg-[#f2f2f2] w-full p-4 rounded-xl`}>
                  <h2 className="text-center text-primary font-semibold text-2xl">
                    {h2}
                  </h2>
                  <ul className="list-disc pl-5 text-lg mt-2">
                    {ul.map((item, index) => (
                      <li key={index} className="mb-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {h3PD ? (
                <>
                  <ul className="list-none text-lg mt-2">
                    {h2PD.map((item, index) => (
                      <li key={index} className="mb-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ul className="list-none text-lg mt-2">
                    {h3PD.map((item, index) => (
                      <li key={index} className="mb-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <h2 className="font-bold text-2xl mt-4">{h2PD}</h2>
              )}

              {dataPD.map((item, index) => (
                <p className="text-lg mt-2" key={index}>
                  {item}
                </p>
              ))}
            </div>
            <div className="absolute bottom-0 -left-[16rem] flex justify-center items-center text-center my-6 w-full mx-auto">
              {isExpand ? (
                <button
                  onClick={toggleExpand}
                  className="flex items-center px-4 p-1 text-lg border border-second hover:border-primary hover:text-primary rounded "
                >
                  Thu gọn
                  <i className="ml-1">
                    <IoIosArrowUp />
                  </i>
                </button>
              ) : (
                <button
                  onClick={toggleExpand}
                  className="flex items-center px-4 p-1 text-lg border border-second hover:border-primary hover:text-primary rounded "
                >
                  Xem thêm
                  <i className="ml-1">
                    <IoIosArrowDown />
                  </i>
                </button>
              )}
            </div>
            <div className="border bg-white drop-shadow-xl w-1/3 rounded-xl py-4 px-4 text-2xl max-h-[30rem] overflow-hidden">
              <p className="font-bold text-center mb-4">Thông số kỹ thuật</p>
              <table className="table-auto text-lg bg-white border drop-shadow-xl">
                <thead>
                  <tr className="text-center w-full">
                    <th className="font-semibold p-2 border-r">Thông số</th>
                    <th className="font-semibold p-2">Giá trị</th>
                  </tr>
                </thead>
                <tbody>
                  {specs
                    .filter((spec) => spec.value)
                    .map((spec, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 text-center border-r">
                          {spec.label}
                        </td>
                        <td className="p-4 max-w-[20rem]">{spec.value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="absolute bottom-0 left-0 w-full bg-white">
                <button
                  onClick={toggleDetails}
                  className="relative left-[8rem] text-center my-6 mx-auto text-lg border border-second px-4 p-1 rounded hover:text-primary hover:border-primary"
                >
                  {isDetailsVisible ? "Thu gọn" : "Xem cấu hình chi tiết"}
                </button>
              </div>
            </div>

            {/* Modal hiển thị thông số kỹ thuật chi tiết */}
            {isDetailsVisible && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg w-3/4 p-6 overflow-auto max-h-[80vh]">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-center mb-4">
                      Thông số kỹ thuật
                    </p>
                    <button
                      onClick={toggleDetails}
                      className="text-gray-500 text-3xl"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="mt-4">
                    <table className="w-full table-auto text-lg border">
                      <thead className="border">
                        <tr className="text-center border">
                          <th className="font-semibold border p-2">Thông số</th>
                          <th className="font-semibold border p-2">Giá trị</th>
                        </tr>
                      </thead>
                      <tbody>
                        {specs
                          .filter((spec) => spec.value)
                          .map((spec, index) => (
                            <tr key={index} className="border">
                              <td className="p-2 border">{spec.label}</td>
                              <td className="p-4 border">{spec.value}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right">
                    <button
                      onClick={toggleDetails}
                      className="px-6 py-2 text-lg border border-primary rounded hover:bg-red-600 hover:text-white hover:border-red-600"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="border bg-white drop-shadow-xl w-2/3 mr-4 rounded-xl">
              <Skeleton width="w-2/3" height="4rem"></Skeleton>
            </div>
            <div className="border bg-white drop-shadow-xl w-1/3 rounded-xl">
              <Skeleton width="w-1/3" height="4rem"></Skeleton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
