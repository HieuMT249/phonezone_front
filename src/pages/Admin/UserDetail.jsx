import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { format } from "date-fns";
import { Toast } from "primereact/toast";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `https://localhost:7274/api/admin/AdminUser/${id}`
        );
        setUser(userResponse.data);

        const ordersResponse = await axios.get(
          `https://localhost:7274/api/admin/AdminOrder/user/${id}`
        );
        setOrders(ordersResponse.data);
      } catch {
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Không thể tải dữ liệu người dùng.",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleStatusChange = async () => {
    try {
      await axios.patch(
        `https://localhost:7274/api/admin/AdminUser/${id}/status`,
        { isActive: !user.isActive }
      );

      setUser((prevUser) => ({
        ...prevUser,
        isActive: !prevUser.isActive,
      }));

      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Cập nhật trạng thái tài khoản thành công!",
        life: 3000,
      });
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Có lỗi xảy ra khi cập nhật trạng thái tài khoản.",
        life: 3000,
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Không tìm thấy người dùng.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
      <Toast ref={toast} />

      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Thông Tin Người Dùng
      </h2>

      <Card className="mb-6">
        <div className="grid grid-cols-2 gap-4 p-4">
          <p>
            <strong>Họ và Tên:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {user.phoneNumber}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {user.address}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {format(new Date(user.createdDate), "dd/MM/yyyy")}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <Tag severity={user.isActive ? "success" : "danger"}>
              {user.isActive ? "Hoạt động" : "Khóa"}
            </Tag>
          </p>
        </div>
        <div className="p-4 flex justify-center">
          <Button
            label={user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
            icon={user.isActive ? "pi pi-lock" : "pi pi-unlock"}
            className={`px-6 py-3 text-lg font-semibold transition duration-300 ease-in-out transform ${
              user.isActive
                ? "bg-red-500 hover:bg-red-600 text-white shadow-md hover:scale-105"
                : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:scale-105"
            }`}
            onClick={handleStatusChange}
          />
        </div>
      </Card>

      <h2 className="text-xl font-bold text-gray-700 mb-4">Đơn Hàng Đã Mua</h2>
      <DataTable value={orders} paginator rows={5} className="shadow-md">
        <Column field="id" header="Mã ĐH" sortable></Column>
        <Column
          field="createdDate"
          header="Ngày đặt"
          body={(row) => format(new Date(row.createdDate), "dd/MM/yyyy")}
          sortable
        ></Column>
        <Column
          field="finalAmount"
          header="Tổng tiền (VND)"
          body={(row) => row.finalAmount.toLocaleString()}
          sortable
        ></Column>
        <Column field="status" header="Trạng thái" sortable></Column>
      </DataTable>
    </div>
  );
}
