import { useEffect, useRef, useState } from "react";
import { Tag } from "primereact/tag";
import { DataScroller } from "primereact/datascroller";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

function Order() {
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [showPopUp, setShowPopUp] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState();
  const [orders, setOrders] = useState("");
  const [orderId, setOrderId] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    cancelReason: "",
  });

  const toast = useRef(null);
  const navigate = useNavigate();

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
          navigate("/");
        }
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId =
          user[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        const response = await axios.get(
          `https://localhost:7274/api/Orders/user/${userId}`
        );
        console.log("Order: ", response.data);
        const ordersData = response.data;

        const updatedOrders = await Promise.all(
          ordersData.map(async (order) => {
            const responseDetails = await axios.get(
              `https://localhost:7274/api/OrderDetails/Order/${order.id}`
            );
            const orderDetailsData = responseDetails.data;
            order.details = orderDetailsData;

            const updatedDetails = await Promise.all(
              orderDetailsData.map(async (orderDetail) => {
                const productResponse = await axios.get(
                  `https://localhost:7274/api/Products/${orderDetail.productId}`
                );
                orderDetail.product = productResponse.data;
                return orderDetail;
              })
            );

            order.details = updatedDetails;
            return order;
          })
        );

        setOrders(updatedOrders);
      } catch (error) {
        console.log("Error fetching order", error);
      }
    };
    fetchOrders();
  }, [user]);

  const tags = {
    success: "Giao hàng thành công",
    secondary: "Đã xác nhận",
    info: "Đang giao hàng",
    danger: "Đã hủy",
    warning: "Chờ xác nhận",
  };
  const handleButtonClick = (status) => {
    setSelectedStatus(status);
  };

  const getButtonClass = (status) => {
    return selectedStatus === status
      ? "border-primary  bg-gradient-15"
      : "hover:bg-second border-second";
  };

  const itemTemplate = (order) => {
    var image = "";
    var productName = "";
    var quantity = "";
    order.details?.map((item) => {
      productName = item.product?.productName || "NoName";
      image = item.product?.image || "No Image";
      quantity = item?.quantity || "0";
    });
    return (
      <div className="rounded-xl bg-white drop-shadow-xl p-6 mt-6">
        <div className="w-full flex justify-between border-2 border-transparent border-b-gray-300 h-12">
          <span className="text-xl font-bold mr-6">
            Đơn hàng: #<span className="text-lg font-normal">{order.id}</span>
          </span>
          <Tag className="mb-2" severity={order.status}>
            {tags[order.status]}
          </Tag>
        </div>
        <div className="flex mt-8 px-10 p-6">
          <img
            src={image}
            alt={productName}
            className="w-20 h-20 object-cover mr-4"
          />
          <div className="flex justify-between items-end w-full">
            <div className="text-xl ml-10 font-bold">
              <span>{productName}</span>
              <div className="text-lg mt-2">
                Số lượng:<span className="ml-2 font-normal">{quantity}</span>
              </div>
            </div>
            <p className="font-bold">
              Tổng tiền:{" "}
              <span className="ml-2 font-normal">{order.totalAmount}</span>
            </p>
          </div>
        </div>
        {order.status === "warning" && (
          <div className="text-end">
            <button
              onClick={() => handleCancelOrder(order.id)}
              className="border py-4 px-6 rounded-xl border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              {" "}
              Hủy đơn{" "}
            </button>
          </div>
        )}
      </div>
    );
  };

  const handleCancelOrder = (orderId) => {
    setOrderId(orderId);
    setShowPopUp(true);
  };

  const handleCancelSubmit = async () => {
    let formIsValid = true;
    let newErrors = { email: "", cancelReason: "" };

    if (!email.trim()) {
      formIsValid = false;
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formIsValid = false;
      newErrors.email = "Email không hợp lệ";
    }

    if (!cancelReason.trim()) {
      formIsValid = false;
      newErrors.cancelReason = "Lý do hủy là bắt buộc";
    }

    setErrors(newErrors);

    if (formIsValid) {
      try {
        const response = await axios.get(
          `https://localhost:7274/api/Orders/${orderId}`
        );

        const updatedOrder = {
          ...response.data,
          status: "danger",
        };

        setShowPopUp(false);
        await axios.put(
          `https://localhost:7274/api/Orders/${orderId}`,
          updatedOrder
        );

        setCancelReason("");
        setEmail("");
        handleClosePopUp();
      } catch (error) {
        console.log("Error updating order status", error);
      }
    } else {
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: errors.email ? errors.email : errors.cancelReason,
        life: 3000,
      });
    }
  };

  const handleCancelChange = (e) => {
    setCancelReason(e.target.value);
  };

  const handleClosePopUp = () => {
    setShowPopUp(false);
  };

  const popUp = () => {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] z-50 px-80 drop-shadow-xl">
        <div className="relative top-28 left-64 bg-white opacity-100 h-82 rounded-xl p-4 w-96">
          <button className="absolute right-6 top-4" onClick={handleClosePopUp}>
            X
          </button>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold">
              Lý do hủy đơn hàng #{orderId}
            </h2>
            <FloatLabel className="mt-8 w-full">
              <InputText
                className="border w-full p-2"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </FloatLabel>
            <textarea
              value={cancelReason}
              onChange={handleCancelChange}
              className="border p-4 mt-4 w-full h-32 rounded-md"
              placeholder="Nhập lý do hủy đơn"
            />
            <button
              onClick={handleCancelSubmit}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:opacity-50"
            >
              Gửi lý do hủy
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    let filteredOrders = [];

    if (selectedStatus === "Tất cả") {
      filteredOrders = orders;
    } else {
      console.log(selectedStatus);
      filteredOrders = orders.filter(
        (order) => tags[order.status] === selectedStatus
      );
    }

    return (
      <DataScroller
        value={filteredOrders}
        itemTemplate={itemTemplate}
        rows={20}
        inline
        scrollHeight="500px"
      />
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg px-64 m-4 min-h-screen">
      <Toast ref={toast} />

      <div className="my-8 font-semibold flex justify-around">
        <button
          onClick={() => handleButtonClick("Tất cả")}
          className={`border ${getButtonClass(
            "Tất cả"
          )} px-6 py-4 rounded-md text-sm`}
        >
          Tất cả
        </button>
        <button
          onClick={() => handleButtonClick("Đã xác nhận")}
          className={`border ${getButtonClass(
            "Đã xác nhận"
          )} px-6 py-4 rounded-md text-sm`}
        >
          Đã xác nhận
        </button>
        <button
          onClick={() => handleButtonClick("Đang giao hàng")}
          className={`border ${getButtonClass(
            "Đang giao hàng"
          )} px-6 py-4 rounded-md text-sm`}
        >
          Đang giao hàng
        </button>
        <button
          onClick={() => handleButtonClick("Đã hủy")}
          className={`border ${getButtonClass(
            "Đã hủy"
          )} px-6 py-4 rounded-md text-sm`}
        >
          Đã hủy
        </button>
        <button
          onClick={() => handleButtonClick("Giao hàng thành công")}
          className={`border ${getButtonClass(
            "Giao hàng thành công"
          )} px-6 py-4 rounded-md text-sm`}
        >
          Thành công
        </button>
        <button
          onClick={() => handleButtonClick("Chờ xác nhận")}
          className={`border ${getButtonClass(
            "Chờ xác nhận"
          )} px-6 py-4 rounded-md text-sm`}
        >
          Chờ xác nhận
        </button>
      </div>

      <div className="mt-6 min-h-96 border border-second rounded-xl p-10">
        {renderContent()}
      </div>
      {showPopUp && popUp()}
    </div>
  );
}

export default Order;
