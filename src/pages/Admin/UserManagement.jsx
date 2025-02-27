import { useState, useEffect } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Hook điều hướng

  // Hàm gọi API để lấy danh sách người dùng không phải admin
  const fetchUsersWithoutAdmin = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7274/api/admin/AdminUser/without-admin"
      );
      setUsers(response.data); // Cập nhật danh sách người dùng
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  // Sử dụng useEffect để gọi API khi component được mount
  useEffect(() => {
    fetchUsersWithoutAdmin();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusTemplate = (rowData) => (
    <span
      className={`px-3 py-1 text-white rounded-full text-sm ${
        rowData.isActive ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {rowData.isActive ? "Hoạt động" : "Vô hiệu"}
    </span>
  );

  const actionTemplate = (rowData) => (
    <Button
      icon="pi pi-eye"
      className="p-button-md md:p-button-lg rounded-xl bg-blue-500 border border-blue-600 text-white hover:bg-blue-600 px-3 md:px-4 py-1 md:py-2"
      tooltip="Xem chi tiết"
      onClick={() => navigate(`/admin/userdetail/${rowData.id}`)} // Điều hướng đến trang sửa điện thoại
    />
  );

  return (
    <div className="p-4 md:p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4 md:mb-6">
        👤 Quản lý người dùng
      </h2>

      {/* Thanh tìm kiếm */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-center gap-4">
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Tìm kiếm người dùng..."
          className="p-inputtext-md md:p-inputtext-lg border border-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/3 px-3 md:px-4 py-2 md:py-3 text-base md:text-lg"
        />
      </div>

      {/* Bảng danh sách người dùng */}
      <div className="overflow-x-auto">
        <DataTable
          value={filteredUsers}
          paginator
          rows={5}
          className="shadow-md rounded-lg text-sm md:text-lg"
          scrollable
        >
          <Column field="name" header="Tên người dùng" />
          <Column field="email" header="Email" />
          <Column field="phoneNumber" header="Số điện thoại" />
          <Column field="address" header="Địa chỉ" />
          <Column field="isActive" header="Trạng thái" body={statusTemplate} />
          <Column header="Hành động" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
}
