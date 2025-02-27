import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { format } from "date-fns";
import axios from "axios";

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const toast = useRef(null);

  useEffect(() => {
    axios
      .get(`https://localhost:7274/api/admin/AdminOrder/${orderId}`)
      .then((response) => {
        const orderData = response.data;
        setOrder(orderData);
        setStatus(orderData.status);

        axios
          .get(`https://localhost:7274/api/admin/AdminUser/${orderData.userId}`)
          .then((userResponse) => {
            setOrder((prevOrder) => ({
              ...prevOrder,
              user: userResponse.data,
            }));
          });

        axios
          .get(
            `https://localhost:7274/api/admin/AdminOrderDetail/order/${orderId}`
          )
          .then((detailsResponse) => {
            setOrder((prevOrder) => ({
              ...prevOrder,
              OrderDetail: detailsResponse.data,
            }));

            const fetchProducts = async () => {
              const productDetails = await Promise.all(
                detailsResponse.data.map((item) =>
                  axios
                    .get(
                      `https://localhost:7274/api/admin/AdminProduct/${item.productId}`
                    )
                    .then((response) => response.data)
                )
              );

              setOrder((prevOrder) => ({
                ...prevOrder,
                products: productDetails.map((product, index) => ({
                  ...detailsResponse.data[index],
                  ...product,
                })),
              }));
            };

            fetchProducts();
          });
      });
  }, [orderId]);

  const orderStatusOptions = [
    { label: "Chờ xác nhận", value: "warning" },
    { label: "Đã xác nhận", value: "secondary" },
    { label: "Đang giao hàng", value: "info" },
    { label: "Giao hàng thành công", value: "success" },
    { label: "Đã hủy", value: "danger" },
  ];

  const getStatusSeverity = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "warning";
      case "Đang xử lý":
        return "info";
      case "Đang giao hàng":
        return "primary";
      case "Đã giao":
        return "success";
      case "Đã hủy":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.put(
        `https://localhost:7274/api/admin/AdminOrder/${orderId}`,
        {
          id: orderId,
          ...order,
          status,
        }
      );

      setOrder((prev) => ({ ...prev, status }));

      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Cập nhật trạng thái thành: ${status}`,
        life: 3000,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Cập nhật trạng thái thất bại!",
        life: 3000,
      });
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
      <Toast ref={toast} />

      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Chi Tiết Đơn Hàng #{orderId}
      </h2>

      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 px-4 pt-4">
          Thông Tin Người Đặt
        </h3>
        <div className="grid grid-cols-2 gap-4 p-4">
          <p>
            <strong>Họ và Tên:</strong> {order.user?.name}
          </p>
          <p>
            <strong>Email:</strong> {order.user?.email}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {order.user?.phoneNumber}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {order.user?.address}
          </p>
          <p>
            <strong>Ngày đặt hàng:</strong>{" "}
            {format(new Date(order.createdDate), "dd/MM/yyyy")}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <Tag severity={getStatusSeverity(order.status)}>{order.status}</Tag>
          </p>
          <p>
            <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
          </p>
        </div>
      </Card>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">
          Cập Nhật Trạng Thái
        </h3>
        <div className="flex items-center gap-4 mt-3">
          <Dropdown
            value={status}
            options={orderStatusOptions}
            onChange={(e) => setStatus(e.value)}
            placeholder="Chọn trạng thái"
            className="w-60"
          />
          <Button
            label="Lưu thay đổi"
            onClick={handleUpdateStatus}
            className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
          />
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-700 mb-4">Sản Phẩm Đã Mua</h3>
      <DataTable
        value={order.products}
        paginator
        rows={5}
        className="shadow-md"
      >
        <Column field="id" header="Mã SP" sortable></Column>
        <Column field="productName" header="Tên sản phẩm" sortable></Column>
        <Column field="quantity" header="Số lượng" sortable></Column>
        <Column
          field="price"
          header="Tổng (VND)"
          body={(row) => row.price}
          sortable
        ></Column>
      </DataTable>

      <Card className="mt-6 p-4 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700">
          Tổng Kết Đơn Hàng
        </h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <p>
            <strong>Tổng tiền:</strong> {order.totalAmount} VND
          </p>
          <p>
            <strong>Giảm giá:</strong> -{order.discountAmount} VND
          </p>
          <p className="text-xl font-bold text-red-600">
            <strong>Thành tiền:</strong> {order.finalAmount} VND
          </p>
        </div>
      </Card>
    </div>
  );
}
