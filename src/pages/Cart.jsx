import axios from "axios";
import images from "../assets/images";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// react-icons
import { FiShoppingCart } from "react-icons/fi";
import { FaUserEdit, FaRegUser, FaPhone } from "react-icons/fa";
import { FaMoneyBill1Wave, FaMoneyCheckDollar } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaRegTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import {
  IoColorPaletteOutline,
  IoLocationOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { MdOutlineEventNote } from "react-icons/md";
import { RiBillLine, RiDiscountPercentLine } from "react-icons/ri";
import { AiOutlineProduct } from "react-icons/ai";

// prime-react
import { DataScroller } from "primereact/datascroller";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { ChevronDownIcon } from "primereact/icons/chevrondown";
import { ChevronRightIcon } from "primereact/icons/chevronright";

function Cart() {
  const [currentStep, setCurrentStep] = useState(0);
  const [cart, setCart] = useState();
  const [user, setUser] = useState();

  // state cho thông tin mua hàng
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [receiveAt, setReceiveAt] = useState("");
  const [address, setAddress] = useState("");
  const [color, setColor] = useState("");
  const [note, setNote] = useState("");
  const [userData, setUserData] = useState("");
  const [coupon, setCoupon] = useState("");
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(5);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const toast = useRef(null);
  const location = useLocation();

  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);

  const colors = [
    { name: "Đen", code: "black" },
    { name: "Trắng", code: "white" },
    { name: "Khác", code: "other" },
  ];

  const payments = [
    {
      name: "Thanh toán tại cửa hàng",
      code: "CH",
      img: "https://firebasestorage.googleapis.com/v0/b/upmood-aebf6.appspot.com/o/PhoneZone%2Fphone_Cart.png?alt=media&token=bf8141b1-b087-4b88-ba4f-c8eaacbc57b7",
    },
    {
      name: "Thanh toán với VNPay",
      code: "vnpay",
      img: "https://firebasestorage.googleapis.com/v0/b/upmood-aebf6.appspot.com/o/PhoneZone%2Fvnpay.png?alt=media&token=571ad300-5e44-48b9-aeaf-aed9be67dec6",
    },
  ];

  const selectedPaymentTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex items-center">
          <img
            alt={option.name}
            src={option.img}
            className={`mr-2 w-10 flag flag-${option.code.toLowerCase()}`}
          />
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const paymentOptionTemplate = (option) => {
    return (
      <div className="flex items-center">
        <img
          alt={option.name}
          src={option.img}
          className={`mr-2 w-10 flag flag-${option.code.toLowerCase()}`}
        />
        <div>{option.name}</div>
      </div>
    );
  };

  const panelFooterTemplate = () => {
    return (
      <div className="py-2 px-3">
        {selectedPayment ? (
          <span>
            <b>{selectedPayment.name}</b> được chọn.
          </span>
        ) : (
          "Không có phương thức thanh toán được lựa chọn."
        )}
      </div>
    );
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

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId =
          user[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];

        const responses = await axios.get(
          `https://localhost:7274/api/Carts/items/${userId}`
        );

        const products = responses.data;

        const cartItems = await Promise.all(
          products.map(async (product) => {
            const response = await axios.get(
              `https://localhost:7274/api/Products/${product.productId}`
            );
            return {
              ...response.data,
              quantity: product.quantity,
              cartItemId: product.id,
            };
          })
        );

        setCart(cartItems);
      } catch (err) {
        console.log("Không thể tải dữ liệu");
      }
    };

    fetchCart();
  }, [user]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get("https://localhost:7274/api/Coupons");
        setCoupons(response.data);
      } catch (error) {
        console.error("Không thể tải danh sách coupon", error);
      }
    };

    fetchCoupons();
  }, []);

  const steps = [
    "Kiểm tra giỏ hàng",
    "Thông tin mua hàng",
    "Hình thức thanh toán",
    "Đặt hàng thành công",
  ];

  const getIcon = (icon) => {
    switch (icon) {
      case "Kiểm tra giỏ hàng":
        return (
          <div className="flex flex-col items-center w-16">
            <i className="text-3xl mb-2">
              <FiShoppingCart />
            </i>
            <span className="text-xs">Kiểm tra giỏ hàng</span>
          </div>
        );
      case "Thông tin mua hàng":
        return (
          <div className="flex flex-col items-center w-16">
            <i className="text-3xl mb-2">
              <FaUserEdit />
            </i>
            <span className="text-xs">Thông tin mua hàng</span>
          </div>
        );
      case "Hình thức thanh toán":
        return (
          <div className="flex flex-col items-center w-16">
            <i className="text-3xl mb-2">
              <FaMoneyCheckDollar />
            </i>
            <span className="text-xs">Hình thức thanh toán</span>
          </div>
        );
      case "Đặt hàng thành công":
        return (
          <div className="flex flex-col items-center w-16">
            <i className="text-3xl mb-2">
              <IoMdCheckmarkCircleOutline />
            </i>
            <span className="text-xs">Kiểm tra giỏ hàng</span>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center w-16">
            <i className="text-3xl mb-2">
              <FiShoppingCart />
            </i>
            <span className="text-xs">Đặt hàng thành công</span>
          </div>
        );
    }
  };

  const saveOrder = async (orderData) => {
    try {
      const orderResponse = await axios.post(
        "https://localhost:7274/api/Orders",
        orderData
      );
      const orderId = orderResponse.data.id;
      const cart = JSON.parse(sessionStorage.getItem("cart"));
      const orderDetails = cart.map((item) => ({
        orderId: orderId,
        productId: item.id,
        quantity: item.quantity,
        price: item.newPrice.replace("đ", "").replace(/\./g, ""),
      }));

      await Promise.all(
        orderDetails.map((detail) =>
          axios.post("https://localhost:7274/api/OrderDetails", detail)
        )
      );
      toast.current.show({
        severity: "success",
        summary: "Thông báo",
        detail: "Đặt hàng thành công!",
        life: 3000,
      });
    } catch (error) {
      console.error("Lỗi khi lưu đơn hàng:", error);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Không thể lưu đơn hàng, vui lòng thử lại!",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get("vnp_ResponseCode");

    if (paymentStatus === "00" && !localStorage.getItem("orderSaved")) {
      const orderData = {
        userId: JSON.parse(sessionStorage.getItem("user")),
        totalAmount: sessionStorage.getItem("totalAmount"),
        discountAmount: JSON.parse(sessionStorage.getItem("coupon"))
          ? Intl.NumberFormat("vi-VN").format(
              discountPrice(
                totalPrice(JSON.parse(sessionStorage.getItem("cart"))),
                JSON.parse(sessionStorage.getItem("coupon"))
              )
            ) + "đ"
          : "0đ",
        finalAmount:
          Intl.NumberFormat("vi-VN").format(
            queryParams.get("vnp_Amount") / 100
          ) + "đ",
        status: "warning",
        paymentMethod: "VNPay",
        color: JSON.parse(sessionStorage.getItem("color")),
      };

      saveOrder(orderData);
      localStorage.setItem("orderSaved", "true");
      setCurrentStep(3);

      axios
        .delete(
          `https://localhost:7274/api/CartItems/user/${JSON.parse(
            sessionStorage.getItem("user")
          )}`
        )
        .then((response) => {
          console.log("Cart cleared successfully:", response);
        })
        .catch((error) => {
          console.error("Error clearing cart:", error);
        });
    }
  }, [location]);

  const nextStep = () => {
    if (currentStep === 2 && !selectedPayment) {
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Vui lòng chọn phương thức thanh toán!",
        life: 3000,
      });
      return;
    }

    if (selectedPayment?.code === "vnpay") {
      handlePayment();
    } else if (selectedPayment?.code === "CH") {
      handlePaymentAtStore();
    } else {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleIncrease = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveCart = async (id) => {
    try {
      const userId =
        user[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      await axios.delete(
        `https://localhost:7274/api/CartItems/${userId}/${id}`
      );

      const response = await axios.get(
        `https://localhost:7274/api/Carts/items/${userId}`
      );
      const updatedCartItems = await Promise.all(
        response.data.map(async (product) => {
          const productResponse = await axios.get(
            `https://localhost:7274/api/Products/${product.productId}`
          );
          return {
            ...productResponse.data,
            quantity: product.quantity,
            cartItemId: product.id,
          };
        })
      );

      setCart(updatedCartItems);
    } catch (error) {
      console.log("Lỗi xóa sản phẩm: ", error);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Không thể xóa sản phẩm!",
        life: 3000,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = {};
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name) formErrors.name = true;
    if (!email) formErrors.email = true;
    if (!phone) formErrors.phone = true;
    if (!color) formErrors.color = true;
    if (!address && receiveAt === "home") formErrors.address = true;
    if (!receiveAt) formErrors.receiveAt = true;
    if (email && !regex.test(email)) formErrors.emailFormat = true;
    if (phone.length !== 10) formErrors.phoneLength = true;

    if (Object.keys(formErrors).length > 0) {
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: formErrors.emailFormat
          ? "Địa chỉ email không hợp lệ!"
          : formErrors.phoneLength
          ? "Số điện thoại không đúng định dạng!"
          : "Vui lòng điền đầy đủ thông tin bắt buộc!",
        life: 3000,
      });
      setErrors(formErrors);
    } else {
      if (receiveAt === "store") {
        const formData = {
          name,
          email,
          phone,
          receiveAt,
          color,
          address: "Cửa hàng 19D Nguyễn Hữu Thọ, Tân Hưng, Quận 7",
          note,
        };
        setUserData(formData);
      } else {
        const formData = {
          name,
          email,
          phone,
          receiveAt,
          color,
          address,
          note,
        };
        setUserData(formData);
      }
      nextStep();
    }
  };

  const itemTemplate = (data) => {
    return (
      <div className="flex items-center justify-start my-4 drop-shadow-xl bg-white border border-second rounded-xl py-4 mx-24">
        <div className="flex text-2xl text-black font-seminbold w-full">
          <img
            className="w-32 mx-10 drop-shadow-xl rounded-xl"
            src={data.image}
            alt={data.productName}
          />
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-start">
              <div className="">{data.productName}</div>
              <div className="text-xl text-primary mt-6">{data.newPrice}</div>
            </div>
            <div className="flex flex-col items-end pt-2 pb-4 pr-6 text-lg font-normal">
              <button
                onClick={() => handleRemoveCart(data.cartItemId)}
                className="hover:bg-red-500 hover:text-white border border-second drop-shadow-lg p-2 rounded-xl bg-white"
              >
                <FaRegTrashAlt />
              </button>
              <div className="flex bg-[#F5F5F5] p-2 rounded-full justify-around w-24 text-xs mt-12">
                <button onClick={() => handleDecrease(data.id)}>
                  <FaMinus />
                </button>
                <span className="text-lg">{data.quantity}</span>
                <button onClick={() => handleIncrease(data.id)}>
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const totalPrice = (products) => {
    return products.reduce((total, product) => {
      const price = product.newPrice
        .replace("đ", "")
        .replace(/\./g, "")
        .replace(/\,/g, "");
      const priceNumber = parseFloat(price);

      return total + priceNumber * product.quantity;
    }, 0);
  };

  const discountPrice = (totalprice, coupon) => {
    if (coupon) {
      const couponCode = coupons.find((c) => c.code === coupon);
      if (couponCode) {
        return totalprice - totalprice * (1 - couponCode.value / 100);
      }
    }
    return 0;
  };

  const finalPrice = (totalprice, coupon) => {
    if (coupon) {
      const couponCode = coupons.find((c) => c.code === coupon);
      if (couponCode) {
        return totalprice * (1 - couponCode.value / 100);
      }
    }
    return totalprice;
  };

  useEffect(() => {
    if (currentStep === 3 && timer > 0) {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("totalAmount");
      sessionStorage.removeItem("coupon");
      sessionStorage.removeItem("color");

      localStorage.removeItem("orderSaved");

      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    }

    if (timer === 0) {
      navigate("/");
      window.location.reload();
    }
  }, [currentStep, timer, navigate]);

  const handlePayment = async () => {
    try {
      sessionStorage.setItem(
        "user",
        JSON.stringify(
          user[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ]
        )
      );
      sessionStorage.setItem(
        "totalAmount",
        Intl.NumberFormat("vi-VN").format(totalPrice(cart)) + "đ"
      );
      sessionStorage.setItem("coupon", JSON.stringify(coupon ? coupon : ""));
      sessionStorage.setItem("cart", JSON.stringify(cart));
      sessionStorage.setItem("color", JSON.stringify(color));

      const paymentData = {
        Name: userData.email,
        Amount: parseFloat(finalPrice(totalPrice(cart), coupon)).toFixed(1),
        OrderType: "other",
        OrderDescription:
          "Thanh toán đơn hàng qua VNPay tại PhoneZone đơn hàng giá trị:",
      };

      const response = await axios.post(
        "https://localhost:7274/api/Payment/create-payment-url",
        paymentData
      );
      window.location.href = response.data;
    } catch (error) {
      console.log("Lỗi khi tạo URL thanh toán VNPay: ", error);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Không thể tạo URL thanh toán. Vui lòng thử lại sau.",
        life: 3000,
      });
    }
  };

  const handlePaymentAtStore = async () => {
    try {
      sessionStorage.setItem(
        "user",
        JSON.stringify(
          user[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ]
        )
      );
      sessionStorage.setItem(
        "totalAmount",
        Intl.NumberFormat("vi-VN").format(totalPrice(cart)) + "đ"
      );
      sessionStorage.setItem("coupon", JSON.stringify(coupon ? coupon : ""));
      sessionStorage.setItem("cart", JSON.stringify(cart));
      sessionStorage.setItem("color", JSON.stringify(color));

      if (!localStorage.getItem("orderSaved")) {
        const orderData = {
          userId:
            user[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ],
          totalAmount:
            Intl.NumberFormat("vi-VN").format(totalPrice(cart)) + "đ",
          discountAmount:
            Intl.NumberFormat("vi-VN").format(
              discountPrice(totalPrice(cart), coupon)
            ) + "đ" || "0đ",
          finalAmount:
            Intl.NumberFormat("vi-VN").format(
              finalPrice(totalPrice(cart), coupon)
            ) + "đ",
          status: "warning",
          paymentMethod: "Cửa hàng",
          color: color,
        };

        saveOrder(orderData);
        localStorage.setItem("orderSaved", "true");
        setCurrentStep(3);

        axios
          .delete(
            `https://localhost:7274/api/CartItems/user/${JSON.parse(
              sessionStorage.getItem("user")
            )}`
          )
          .then((response) => {
            console.log("Cart cleared successfully:", response);
          })
          .catch((error) => {
            console.error("Error clearing cart:", error);
          });
      }
    } catch (error) {
      console.log("Lỗi khi tạo URL thanh toán VNPay: ", error);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Không thể tạo URL thanh toán. Vui lòng thử lại sau.",
        life: 3000,
      });
    }
  };
  return (
    <>
      <Toast ref={toast} />
      {(!cart || cart.length === 0) && currentStep !== 3 ? (
        <div className="min-h-screen flex flex-col items-center font-semibold">
          <img className="w-96 mb-6" src={images.empty} alt="cart-empty" />
          <span>Giỏ hàng của bạn đang trống</span>
          <span>Hãy chọn thêm sản phẩm để mua sắm nhé</span>
          <button
            onClick={() => {
              navigate("/");
              window.location.reload();
            }}
            className="mt-10 font-normal border border-primary py-4 px-6 rounded-lg hover:bg-primary hover:text-white hover:scale-125 transition-transform duration-200 ease-in-out"
          >
            Quay lại trang chủ
          </button>
        </div>
      ) : (
        <div className="container mx-auto py-4 px-60 min-h-screen bg-white">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div
                  className={`p-10 ${
                    index === currentStep
                      ? "text-primary"
                      : "border-second text-second"
                  }`}
                >
                  {getIcon(step)}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-1/2 left-28 w-48 border-dashed border-t-2 ${
                      index < currentStep ? "border-primary" : "border-second"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white shadow-lg rounded-lg  px-6">
            <div className="mb-6">
              {/* Bước 1 - Kiểm tra giỏ hàng*/}
              {currentStep === 0 && (
                <div className="text-center font-semibold text-xl">
                  <span>Đơn hàng của bạn</span>
                  <DataScroller
                    emptyMessage={"Không có mặt hàng khả dụng"}
                    className="drop-shadow-xl"
                    value={cart}
                    itemTemplate={itemTemplate}
                    rows={5}
                    inline
                    scrollHeight="500px"
                  />
                </div>
              )}

              {/* Bước 2 - Điền thông tin thanh toán*/}
              {currentStep === 1 && (
                <div>
                  <form
                    onSubmit={handleSubmit}
                    className="border border-second text-center min-h-96 py-6 text-black px-28 drop-shadow-xl bg-white rounded-xl"
                  >
                    <span className="text-3xl font-semibold">
                      Thông tin nhận hàng
                    </span>
                    {/* Họ và tên */}
                    <FloatLabel className="my-8">
                      <InputText
                        className="border border-second w-full p-2"
                        id="username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <label htmlFor="username">Họ và tên</label>
                    </FloatLabel>

                    {/* Địa chỉ email */}
                    <FloatLabel className="mb-8">
                      <InputText
                        className="border  border-second w-full p-2"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label htmlFor="email">Địa chỉ Email</label>
                    </FloatLabel>

                    {/* Số điện thoại */}
                    <FloatLabel className="mb-8">
                      <InputText
                        keyfilter={"pnum"}
                        className="border border-second w-full p-2"
                        id="alphanum"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <label htmlFor="phone">Số điện thoại</label>
                    </FloatLabel>

                    {/* Màu sắc */}
                    <div className="text-start mb-8">
                      <Dropdown
                        value={color}
                        onChange={(e) => setColor(e.value)}
                        options={colors}
                        optionValue="name"
                        optionLabel="name"
                        placeholder="Chọn màu sắc"
                        className="border border-sencond"
                      />
                    </div>

                    {/* Địa chỉ + phương thức nhận */}
                    <div className="flex items-center mb-8">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="store"
                          checked={receiveAt === "store"}
                          onChange={() => setReceiveAt("store")}
                          className="text-primary"
                        />
                        <span className="ml-2">Nhận tại cửa hàng</span>
                      </label>
                      <label className="flex items-center mt-1 ml-20">
                        <input
                          type="radio"
                          value="home"
                          checked={receiveAt === "home"}
                          onChange={() => setReceiveAt("home")}
                          className="text-primary"
                        />
                        <span className="ml-2">Giao hàng tận nơi</span>
                      </label>
                    </div>

                    {receiveAt === "store" ? (
                      <FloatLabel className="relative mb-10">
                        <InputText
                          disabled
                          id="address"
                          className="border border-second w-full py-2 px-3 rounded-md mt-2 placeholder:text-black"
                          placeholder="Cửa hàng 19D Nguyễn Hữu Thọ, Tân Hưng, Quận 7"
                          value={address}
                          onChange={(e) =>
                            setAddress(
                              "Cửa hàng 19D Nguyễn Hữu Thọ, Tân Hưng, Quận 7"
                            )
                          }
                        />
                        <label
                          htmlFor="address"
                          className="absolute left-3 top-2 text-gray-500"
                        >
                          Địa chỉ nhận hàng
                        </label>
                      </FloatLabel>
                    ) : (
                      <FloatLabel className="relative mb-10">
                        <InputText
                          type="text"
                          id="address"
                          className="border border-second w-full py-4 px-3 rounded-md mt-2"
                          placeholder="Vui lòng nhập địa chỉ giao hàng"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                        <label
                          htmlFor="address"
                          className="absolute left-3 top-2 text-gray-500"
                        >
                          {" "}
                          Địa chỉ nhận hàng
                        </label>
                      </FloatLabel>
                    )}

                    {/* Ghi chú */}
                    <FloatLabel className="mb-6">
                      <InputTextarea
                        className="border border-second w-full p-2"
                        id="description"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={5}
                        cols={30}
                      />
                      <label htmlFor="description">Ghi chú</label>
                    </FloatLabel>
                    {/* button */}
                    <div className="flex justify-around text-center">
                      <button
                        onClick={prevStep}
                        className="bg-gray-300 text-gray-700 px-24 py-6 rounded-xl hover:scale-125 transition-transform duration-200 ease-in-out"
                      >
                        Quay lại
                      </button>
                      <button
                        type="submit"
                        className="bg-primary text-white px-24 py-6 rounded-xl hover:scale-125 transition-transform duration-200 ease-in-out"
                      >
                        Tiếp theo
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Bước 3 - Thanh toán*/}
              {currentStep === 2 && userData && cart && (
                <form
                  method="POST"
                  className="min-h-96 border border-second bg-white drop-shadow-xl rounded-xl py-8 text-black px-28 text-center"
                >
                  <span className="text-3xl font-semibold">
                    Thông tin hóa đơn
                  </span>
                  <div className="text-xl mb-10 mt-4 font-normal">
                    {/* Họ tên */}
                    <div className="flex items-center grid grid-cols-2 gap-2">
                      <div className="flex items-center my-3">
                        <span className="mr-3">
                          <FaRegUser />
                        </span>
                        <span>Họ và tên khách hàng: </span>
                      </div>
                      <i className="text-start">{userData.name}</i>
                    </div>

                    {/* Email */}
                    <div className="flex items-center grid grid-cols-2 gap-2">
                      <div className="flex items-center my-3">
                        <span className="mr-3">
                          <HiOutlineMail />
                        </span>
                        <span>Email: </span>
                      </div>
                      <i name="Name" className="text-start">
                        {userData.email}
                      </i>
                    </div>

                    {/* Địa chỉ */}
                    <div className="flex items-center grid grid-cols-2 gap-2">
                      <div className="flex items-center my-3">
                        <span className="mr-3">
                          <IoLocationOutline />
                        </span>
                        <span>Địa chỉ: </span>
                      </div>
                      <i className="text-start">{userData.address}</i>
                    </div>

                    {/* Số điện thoại */}
                    <div className="flex items-center grid grid-cols-2 gap-2">
                      <div className="flex items-center my-3">
                        <span className="mr-3">
                          <FaPhone />
                        </span>
                        <span>Số điện thoại: </span>
                      </div>
                      <i className="text-start">{userData.phone}</i>
                    </div>

                    {/* Màu sắc */}
                    <div className="flex items-center grid grid-cols-2 gap-2">
                      <div className="flex items-center my-3">
                        <span className="mr-3">
                          <IoColorPaletteOutline />
                        </span>
                        <span>Màu sắc: </span>
                      </div>
                      <i className="text-start">{userData.color}</i>
                    </div>

                    {/* Ghi chú */}
                    <div className="flex items-center grid grid-cols-2 gap-2">
                      <div className="flex items-center my-3">
                        <span className="mr-3">
                          <MdOutlineEventNote />
                        </span>
                        <span>Ghi chú: </span>
                      </div>
                      <i className="text-start max-h-20 text-ellipsis">
                        {userData.note}
                      </i>
                    </div>

                    {/* Sản phẩm */}
                    <div className="flex items-center grid grid-cols-2 gap-2">
                      <div className="flex items-center my-3">
                        <span className="mr-3">
                          <AiOutlineProduct />
                        </span>
                        <span>Sản phẩm: </span>
                      </div>
                      <i className="text-start">
                        {cart.map((item, index) => (
                          <ul key={index}>
                            <li className="my-3">
                              <i className="font-semibold mr-6">
                                {item.productName}
                              </i>{" "}
                              x {item.quantity}
                            </li>
                          </ul>
                        ))}
                      </i>
                    </div>

                    {/* Tạm tính */}
                    <div className="flex items-center grid grid-cols-2 gap-2">
                      <div className="flex items-center my-3">
                        <span className="mr-3">
                          <RiBillLine />
                        </span>
                        <span>Tạm tính: </span>
                      </div>
                      <i className="text-start">
                        {Intl.NumberFormat("vi-VN").format(totalPrice(cart)) +
                          "đ"}
                      </i>
                    </div>

                    {/* Giảm giá */}
                    <div className="flex items-center grid grid-cols-2 gap-2">
                      <div className="flex items-center my-3">
                        <span className="mr-3">
                          <RiDiscountPercentLine />
                        </span>
                        <span>Giảm giá: </span>
                      </div>
                      <FloatLabel className="my-10">
                        <InputText
                          className="border border-second w-full p-2"
                          id="coupon"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                        />
                        <label htmlFor="coupon">Nhập mã giảm giá</label>
                      </FloatLabel>
                    </div>

                    {/* Tổng tiền */}
                    <div className="flex items-center grid grid-cols-2 gap-2">
                      <div className="flex items-center my-3">
                        <span className="mr-3">
                          <FaMoneyBill1Wave />
                        </span>
                        <span>Tổng tiền: </span>
                      </div>
                      <i
                        name="Amount"
                        className="text-start font-bold text-primary"
                      >
                        {Intl.NumberFormat("vi-VN").format(
                          finalPrice(totalPrice(cart), coupon)
                        ) + "đ"}
                      </i>
                    </div>
                  </div>
                  <div className="flex items-center grid grid-cols-2 gap-2">
                    <div className="flex items-center my-3 text-xl">
                      <span className="mr-3">
                        <IoWalletOutline />
                      </span>
                      <span>Thông tin thanh toán:</span>
                    </div>
                    <Dropdown
                      name="OrderDescription"
                      value={selectedPayment}
                      onChange={(e) => setSelectedPayment(e.value)}
                      options={payments}
                      optionLabel="name"
                      placeholder="Chọn phương thức thanh toán"
                      valueTemplate={selectedPaymentTemplate}
                      itemTemplate={paymentOptionTemplate}
                      className="w-full md:w-14rem border border-second"
                      panelFooterTemplate={panelFooterTemplate}
                      dropdownIcon={(opts) => {
                        return opts.iconProps["data-pr-overlay-visible"] ? (
                          <ChevronRightIcon {...opts.iconProps} />
                        ) : (
                          <ChevronDownIcon {...opts.iconProps} />
                        );
                      }}
                    />
                  </div>
                </form>
              )}

              {/* Bước 4 - Trả kết quả*/}
              {currentStep === 3 && (
                <div className="flex flex-col items-center justify-center w-full">
                  <img
                    className=""
                    src={images.payment_success}
                    alt="success"
                  />
                  <div className="font-bold text-5xl text-primary mb-4">
                    Thanh toán thành công
                  </div>
                  <div className="font-semibold italic ">
                    Xin cảm ơn bạn đã tin tưởng lựa chọn PhoneZone để mua hàng
                  </div>
                  <div className="mt-4 text-xl">
                    Chuyển về trang chủ sau {timer} giây...
                  </div>
                </div>
              )}
            </div>

            {/* các nút */}
            <div className="flex justify-around text-center">
              {currentStep > 0 && currentStep !== 1 && currentStep !== 3 && (
                <button
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-700 px-36 py-6 mb-6 rounded-xl hover:scale-125 transition-transform duration-200 ease-in-out"
                >
                  Quay lại
                </button>
              )}
              {currentStep === 0 ? (
                <button
                  onClick={nextStep}
                  className="bg-primary hover:scale-125 transition-transform duration-200 ease-in-out text-white text-xl px-36 py-6 mb-6 rounded-xl mx-auto"
                >
                  Đặt hàng
                </button>
              ) : currentStep === 2 ? (
                <button
                  onClick={nextStep}
                  className="bg-primary hover:scale-125 transition-transform duration-200 ease-in-out text-white px-36 py-6 mb-6 rounded-xl"
                >
                  Thanh toán
                </button>
              ) : (
                currentStep < steps.length - 1 &&
                currentStep !== 1 && (
                  <button
                    onClick={nextStep}
                    className="bg-primary text-white px-60 py-6 rounded-xl hover:scale-125 transition-transform duration-200 ease-in-out"
                  >
                    Tiếp theo
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
