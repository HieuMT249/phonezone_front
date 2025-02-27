import { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { Toast } from "primereact/toast";

export default function BrandManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [brandData, setBrandData] = useState({
    name: "",
    image: "",
    country: "",
  });
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const toast = useRef(null);
  // Lấy dữ liệu từ API

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7274/api/admin/AdminBrand"
      );
      setBrands(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu hãng:", error);
    }
  };

  const validateBrand = (brand) => {
    if (!brand.name) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Tên hãng không được để trống.",
      });
      return false;
    }
    if (!brand.image) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "URL hình ảnh không được để trống.",
      });
      return false;
    }
    if (!brand.country) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Quốc gia không được để trống.",
      });
      return false;
    }
    return true;
  };

  // Thêm hãng mới
  const saveBrand = async () => {
    if (!validateBrand(brandData)) return;

    try {
      await axios.post(
        "https://localhost:7274/api/admin/AdminBrand",
        brandData
      );
      fetchBrands();
      setDialogVisible(false);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Thêm hãng mới thành công.",
      });
    } catch (error) {
      console.error("Lỗi khi thêm hãng mới:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể thêm hãng mới.",
      });
    }
  };

  // Sửa hãng
  const saveEditedBrand = async () => {
    if (!validateBrand(editingBrand)) return;

    try {
      await axios.put(
        `https://localhost:7274/api/admin/AdminBrand/${editingBrand.id}`,
        editingBrand
      );
      fetchBrands();
      setEditDialogVisible(false);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Cập nhật hãng thành công.",
      });
    } catch (error) {
      console.error("Lỗi khi sửa hãng:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể cập nhật hãng.",
      });
    }
  };

  // Xóa hãng
  const deleteBrand = async () => {
    try {
      await axios.delete(
        `https://localhost:7274/api/admin/AdminBrand/${brandToDelete.id}`
      );
      fetchBrands();
      setDeleteDialogVisible(false);
      setBrandToDelete(null);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Xóa hãng thành công.",
      });
    } catch (error) {
      console.error("Lỗi khi xóa hãng:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể xóa hãng.",
      });
    }
  };

  const openNewBrandDialog = () => {
    setBrandData({ name: "", image: "", country: "" });
    setDialogVisible(true);
  };

  const openEditBrandDialog = (brand) => {
    setEditingBrand(brand);
    setEditDialogVisible(true);
  };

  const confirmDeleteBrand = (brand) => {
    setBrandToDelete(brand);
    setDeleteDialogVisible(true);
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const imageTemplate = (rowData) => (
    <Image src={rowData.image} alt={rowData.name} width="50" preview />
  );

  const actionTemplate = (rowData) => (
    <div className="flex gap-3">
      <Button
        icon="pi pi-pencil"
        className="p-button-lg rounded-xl bg-yellow-400 border border-yellow-500 text-white hover:bg-yellow-500"
        tooltip="Sửa"
        onClick={() => openEditBrandDialog(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-lg rounded-xl bg-red-500 border border-red-600 text-white hover:bg-red-600"
        tooltip="Xóa"
        onClick={() => confirmDeleteBrand(rowData)}
      />
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <Toast ref={toast} /> {/* Thêm Toast */}
      <h2 className="text-3xl font-bold mb-6 text-gray-700">
        🏷️ Quản lý hãng điện thoại
      </h2>
      {/* Thanh tìm kiếm và nút thêm mới */}
      <div className="flex justify-between items-center mb-6">
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Tìm kiếm hãng..."
          className="p-inputtext-lg border border-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-1/3 px-4 py-3 text-lg"
        />
        <Button
          label="Thêm hãng mới"
          icon="pi pi-plus"
          className="p-button-xl rounded-xl text-white bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg px-6 py-3 text-lg"
          onClick={openNewBrandDialog}
        />
      </div>
      {/* Bảng dữ liệu */}
      <DataTable
        value={filteredBrands}
        paginator
        rows={5}
        className="shadow-md rounded-lg text-lg"
      >
        <Column field="id" header="ID" />
        <Column field="image" header="Logo" body={imageTemplate} />
        <Column field="name" header="Tên hãng" />
        <Column field="country" header="Quốc gia" />
        <Column header="Hành động" body={actionTemplate} />
      </DataTable>
      {/* Dialog thêm hãng mới */}
      <Dialog
        header="🆕 Thêm Hãng Điện Thoại"
        visible={dialogVisible}
        style={{ width: "450px" }}
        onHide={() => setDialogVisible(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Hủy"
              icon="pi pi-times"
              className="p-button-text text-gray-700 hover:text-gray-900"
              onClick={() => setDialogVisible(false)}
            />
            <Button
              label="Lưu"
              icon="pi pi-check"
              className="p-button-primary bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
              onClick={saveBrand}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Tên Hãng
            </label>
            <InputText
              value={brandData.name}
              onChange={(e) =>
                setBrandData({ ...brandData, name: e.target.value })
              }
              placeholder="Nhập tên hãng"
              className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Logo Hãng
            </label>
            <InputText
              value={brandData.image}
              onChange={(e) =>
                setBrandData({ ...brandData, image: e.target.value })
              }
              placeholder="Nhập URL logo hãng"
              className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Quốc Gia
            </label>
            <InputText
              value={brandData.country}
              onChange={(e) =>
                setBrandData({ ...brandData, country: e.target.value })
              }
              placeholder="Nhập quốc gia"
              className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
            />
          </div>
        </div>
      </Dialog>
      {/* Dialog sửa hãng */}
      <Dialog
        header="✏️ Sửa Hãng Điện Thoại"
        visible={editDialogVisible}
        style={{ width: "450px" }}
        onHide={() => setEditDialogVisible(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Hủy"
              icon="pi pi-times"
              className="p-button-text text-gray-700 hover:text-gray-900"
              onClick={() => setEditDialogVisible(false)}
            />
            <Button
              label="Lưu"
              icon="pi pi-check"
              className="p-button-primary bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
              onClick={saveEditedBrand}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Tên Hãng
            </label>
            <InputText
              value={editingBrand?.name || ""}
              onChange={(e) =>
                setEditingBrand({ ...editingBrand, name: e.target.value })
              }
              placeholder="Nhập tên hãng"
              className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Logo Hãng
            </label>
            <InputText
              value={editingBrand?.image || ""}
              onChange={(e) =>
                setEditingBrand({ ...editingBrand, image: e.target.value })
              }
              placeholder="Nhập URL logo hãng"
              className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Quốc Gia
            </label>
            <InputText
              value={editingBrand?.country || ""}
              onChange={(e) =>
                setEditingBrand({ ...editingBrand, country: e.target.value })
              }
              placeholder="Nhập quốc gia"
              className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
            />
          </div>
        </div>
      </Dialog>
      {/* Dialog xác nhận xóa */}
      <Dialog
        header="❗ Xác Nhận Xóa"
        visible={deleteDialogVisible}
        style={{ width: "450px" }}
        onHide={() => setDeleteDialogVisible(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Hủy"
              icon="pi pi-times"
              className="p-button-text text-gray-700 hover:text-gray-900"
              onClick={() => setDeleteDialogVisible(false)}
            />
            <Button
              label="Xóa"
              icon="pi pi-trash"
              className="p-button-danger bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              onClick={deleteBrand}
            />
          </div>
        }
      >
        <p className="text-lg text-gray-700">
          Bạn có chắc chắn muốn xóa hãng {brandToDelete?.name} không?
        </p>
      </Dialog>
    </div>
  );
}
