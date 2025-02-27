import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast"; // Import Toast

export default function PhoneManagement() {
  const [search, setSearch] = useState("");
  const [phones, setPhones] = useState([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const toast = useRef(null); // Khai báo Toast

  const navigate = useNavigate();

  // Hàm lấy dữ liệu từ API
  const fetchPhones = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7274/api/admin/AdminProduct"
      );
      setPhones(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  const confirmDeletePhone = (phone) => {
    setSelectedPhone(phone);
    setDeleteDialogVisible(true);
  };

  const deletePhone = async () => {
    if (!selectedPhone) return;

    try {
      // Gọi API để xóa điện thoại
      await axios.delete(
        `https://localhost:7274/api/admin/AdminProduct/${selectedPhone.id}`
      );

      // Cập nhật danh sách điện thoại sau khi xóa thành công
      setPhones(phones.filter((p) => p.id !== selectedPhone.id));

      // Hiển thị thông báo thành công
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Đã xóa ${selectedPhone.productName}`,
        life: 3000,
      });
    } catch (error) {
      console.error("Lỗi khi xóa điện thoại:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Đã xảy ra lỗi khi xóa điện thoại.",
        life: 3000,
      });
    }

    setDeleteDialogVisible(false);
    setSelectedPhone(null);
  };

  return (
    <div className="p-4 md:p-6 bg-white shadow-lg rounded-xl">
      <Toast ref={toast} /> {/* Thêm Toast vào UI */}
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
          📱 Quản lý điện thoại
        </h2>
        <Button
          label="Thêm điện thoại"
          icon="pi pi-plus"
          onClick={() => navigate("/admin/addphone")}
          className="p-button-lg md:p-button-xl rounded-xl text-white bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg px-5 md:px-6 py-2 md:py-3 text-base md:text-lg"
        />
      </div>
      {/* Thanh tìm kiếm */}
      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <InputText
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Tìm kiếm điện thoại..."
          className="p-inputtext-lg border border-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/3 px-4 py-3 text-base md:text-lg"
        />
      </div>
      {/* Bảng danh sách điện thoại */}
      <DataTable
        value={phones.filter((phone) =>
          phone.productName.toLowerCase().includes(search.toLowerCase())
        )}
        paginator
        rows={5}
        className="shadow-md rounded-lg text-base md:text-lg"
        scrollable
      >
        <Column field="id" header="ID" />
        <Column
          field="image"
          header="Hình ảnh"
          body={(rowData) => (
            <Image
              src={rowData.image}
              alt={rowData.productName}
              width="50"
              preview
            />
          )}
        />
        <Column field="productName" header="Tên điện thoại" />
        <Column field="newPrice" header="Giá (VND)" />
        <Column field="stock" header="Kho hàng" />
        <Column field="branch" header="Hãng" />
        <Column
          header="Hành động"
          body={(rowData) => (
            <div className="flex gap-2 md:gap-3">
              <Button
                icon="pi pi-pencil"
                className="p-button-md md:p-button-lg rounded-xl bg-yellow-400 border border-yellow-500 text-white hover:bg-yellow-500"
                tooltip="Sửa"
                onClick={() => navigate(`/admin/editphone/${rowData.id}`)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-md md:p-button-lg rounded-xl bg-red-500 border border-red-600 text-white hover:bg-red-600"
                tooltip="Xóa"
                onClick={() => confirmDeletePhone(rowData)}
              />
            </div>
          )}
        />
      </DataTable>
      {/* Dialog xác nhận xóa */}
      <Dialog
        header="❌ Xác nhận xóa"
        visible={deleteDialogVisible}
        style={{ width: "450px" }}
        onHide={() => setDeleteDialogVisible(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button label="Hủy" onClick={() => setDeleteDialogVisible(false)} />
            <Button
              label="Xác nhận"
              className="p-button-danger"
              onClick={deletePhone}
            />
          </div>
        }
      >
        <p>
          Bạn có chắc chắn muốn xóa điện thoại {selectedPhone?.productName}{" "}
          không?
        </p>
      </Dialog>
    </div>
  );
}
