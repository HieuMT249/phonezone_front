import { useState, useEffect } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7274/api/admin/AdminOrder"
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  };

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7274/api/admin/AdminUser"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  // Lọc đơn hàng theo từ khóa tìm kiếm
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(order.userId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Lấy tên khách hàng dựa trên userId
  const getCustomerName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Không rõ";
  };

  const getStatusLabel = (status) => {
    const statusMapping = {
      warning: "Chờ xác nhận",
      secondary: "Đã xác nhận",
      info: "Đang giao hàng",
      danger: "Đã hủy",
      success: "Giao hàng thành công",
    };
    return statusMapping[status] || "Không rõ";
  };

  const actionTemplate = (rowData) => (
    <div className="flex gap-3">
      <Button
        label="Xem chi tiết"
        icon="pi pi-eye"
        onClick={() => navigate(`/admin/orderdetail/${rowData.id}`)}
        className="p-button-lg rounded-xl bg-blue-500 border border-blue-600 text-white hover:bg-blue-600 px-4 py-2"
        tooltip="Xem chi tiết đơn hàng"
      />
    </div>
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      {/* Tiêu đề */}
      <h2 className="text-3xl font-bold text-gray-700 mb-6">
        📦 Quản lý đơn hàng
      </h2>

      {/* Thanh tìm kiếm */}
      <div className="flex justify-between items-center mb-6">
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Tìm theo mã đơn hàng hoặc khách hàng..."
          className="p-inputtext-lg border border-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/2 px-4 py-3 text-lg"
        />
      </div>

      {/* Bảng danh sách đơn hàng */}
      <DataTable
        value={filteredOrders}
        paginator
        rows={5}
        className="shadow-md rounded-lg text-lg"
      >
        <Column field="id" header="Mã đơn hàng" />
        <Column
          field="userId"
          header="Khách hàng"
          body={(rowData) => getCustomerName(rowData.userId)}
        />
        <Column field="totalAmount" header="Tổng tiền" />
        <Column
          field="status"
          header="Trạng thái"
          body={(rowData) => (
            <Tag
              value={getStatusLabel(rowData.status)} // Hiển thị nhãn trạng thái
              severity={rowData.status} // Giữ nguyên giá trị gốc từ API để lấy màu đúng
              className="text-lg px-3 py-2 font-semibold"
            />
          )}
        />

        <Column field="paymentMethod" header="Phương thức thanh toán" />
        <Column
          field="createdDate"
          header="Ngày đặt"
          body={(row) => format(new Date(row.createdDate), "dd/MM/yyyy")}
          sortable
        />
        <Column header="Hành động" body={actionTemplate} />
      </DataTable>
    </div>
  );
}
