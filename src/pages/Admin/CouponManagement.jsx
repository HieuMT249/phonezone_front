import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast"; // Import Toast

export default function CouponManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [couponData, setCouponData] = useState({
    id: "",
    code: "",
    value: 0,
    description: "",
    usagelimit: 0,
    isactive: true,
  });

  const toast = useRef(null); // Sử dụng Toast

  // Lấy danh sách mã giảm giá từ API
  const fetchCoupons = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7274/api/admin/AdminCoupon"
      );
      setCoupons(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách mã giảm giá:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể tải danh sách mã giảm giá.",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Hàm validate dữ liệu mã giảm giá
  // Hàm validate dữ liệu mã giảm giá
  const validateCoupon = (coupon) => {
    if (!coupon.code) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Mã giảm giá không được để trống.",
        life: 3000,
      });
      return false;
    }

    if (!coupon.value && coupon.value !== 0) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Giá trị giảm giá không được để trống.",
        life: 3000,
      });
      return false;
    }

    if (coupon.value < 0) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Giá trị giảm giá không được nhỏ hơn 0.",
        life: 3000,
      });
      return false;
    }

    if (!coupon.description) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Mô tả không được để trống.",
        life: 3000,
      });
      return false;
    }

    if (!coupon.usageLimit && coupon.usageLimit !== 0) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Giới hạn sử dụng không được để trống.",
        life: 3000,
      });
      return false;
    }

    if (coupon.usageLimit <= 0) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Giới hạn sử dụng phải lớn hơn 0.",
        life: 3000,
      });
      return false;
    }

    return true;
  };

  // Thêm mã giảm giá
  const saveCoupon = async () => {
    if (!validateCoupon(couponData)) return; // Thêm kiểm tra validate
    try {
      await axios.post(
        "https://localhost:7274/api/admin/AdminCoupon",
        couponData
      );
      fetchCoupons();
      setDialogVisible(false);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Mã giảm giá đã được thêm thành công.",
        life: 3000,
      });
    } catch (error) {
      if (error.response) {
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: error.response.data,
          life: 3000,
        });
      } else {
        console.error("Lỗi khi thêm mã giảm giá:", error);
      }
    }
  };

  // Cập nhật mã giảm giá
  const updateCoupon = async () => {
    if (!validateCoupon(couponData)) return; // Thêm kiểm tra validate
    try {
      await axios.put(
        `https://localhost:7274/api/admin/AdminCoupon/${couponData.id}`,
        couponData
      );
      fetchCoupons();
      setEditDialogVisible(false);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Mã giảm giá đã được cập nhật.",
        life: 3000,
      });
    } catch (error) {
      if (error.response) {
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: error.response.data,
          life: 3000,
        });
      } else {
        console.error("Lỗi khi cập nhật mã giảm giá:", error);
      }
    }
  };

  // Xóa mã giảm giá
  const deleteCoupon = async () => {
    try {
      await axios.delete(
        `https://localhost:7274/api/admin/AdminCoupon/${couponToDelete.id}`
      );
      fetchCoupons();
      setDeleteDialogVisible(false);
      setCouponToDelete(null);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Mã giảm giá đã được xóa.",
        life: 3000,
      });
    } catch (error) {
      console.error("Lỗi khi xóa mã giảm giá:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể xóa mã giảm giá.",
        life: 3000,
      });
    }
  };

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewCouponDialog = () => {
    setCouponData({
      code: "",
      value: 0,
      description: "",
      usagelimit: 0,
      isactive: true,
    });
    setDialogVisible(true);
  };

  const editCoupon = (coupon) => {
    setCouponData(coupon);
    setEditDialogVisible(true);
  };

  const confirmDeleteCoupon = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogVisible(true);
  };

  const actionTemplate = (rowData) => (
    <div className="flex gap-3">
      <Button
        icon="pi pi-pencil"
        className="p-button-lg rounded-xl bg-yellow-400 border border-yellow-500 text-white hover:bg-yellow-500 px-4 py-2"
        tooltip="Sửa mã"
        onClick={() => editCoupon(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-lg rounded-xl bg-red-500 border border-red-600 text-white hover:bg-red-600 px-4 py-2"
        tooltip="Xóa mã"
        onClick={() => confirmDeleteCoupon(rowData)}
      />
    </div>
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <Toast ref={toast} /> {/* Thêm Toast ở đây */}
      <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center md:text-left">
        🎟️ Quản lý mã giảm giá
      </h2>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Tìm kiếm mã giảm giá..."
          className="p-inputtext-lg border border-gray-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/2 px-4 py-3 text-lg"
        />
        <Button
          label="Thêm mã mới"
          icon="pi pi-plus"
          className="p-button-xl rounded-xl text-white bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg px-6 py-3 text-lg w-full md:w-auto"
          onClick={openNewCouponDialog}
        />
      </div>
      <div className="overflow-x-auto">
        <DataTable
          value={filteredCoupons}
          paginator
          rows={5}
          className="shadow-md rounded-lg text-sm md:text-lg"
          scrollable
        >
          <Column field="id" header="Mã Coupon" />
          <Column field="code" header="Mã Giảm Giá" />
          <Column field="value" header="Giá Trị" />
          <Column field="description" header="Mô Tả" />
          <Column field="usageLimit" header="Giới Hạn Sử Dụng" />
          <Column
            field="isactive"
            header="Trạng Thái"
            body={(rowData) => (
              <span
                className={
                  rowData.isActive
                    ? "text-green-600 font-bold"
                    : "text-red-500 font-bold"
                }
              >
                {rowData.isActive ? "Hoạt động" : "Vô hiệu"}
              </span>
            )}
          />
          <Column header="Hành động" body={actionTemplate} />
        </DataTable>
      </div>
      {/* Dialog thêm mã mới */}
      <Dialog
        header="🆕 Thêm Mã Giảm Giá"
        visible={dialogVisible}
        style={{ width: "450px" }}
        onHide={() => setDialogVisible(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button label="Hủy" onClick={() => setDialogVisible(false)} />
            <Button label="Lưu" onClick={saveCoupon} />
          </div>
        }
      >
        <FormCoupon couponData={couponData} setCouponData={setCouponData} />
      </Dialog>
      {/* Dialog chỉnh sửa mã */}
      <Dialog
        header="✏️ Chỉnh Sửa Mã Giảm Giá"
        visible={editDialogVisible}
        style={{ width: "450px" }}
        onHide={() => setEditDialogVisible(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button label="Hủy" onClick={() => setEditDialogVisible(false)} />
            <Button label="Cập Nhật" onClick={updateCoupon} />
          </div>
        }
      >
        <FormCoupon couponData={couponData} setCouponData={setCouponData} />
      </Dialog>
      {/* Dialog xác nhận xóa */}
      <Dialog
        header="🗑️ Xác Nhận Xóa"
        visible={deleteDialogVisible}
        style={{ width: "450px" }}
        onHide={() => setDeleteDialogVisible(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button label="Hủy" onClick={() => setDeleteDialogVisible(false)} />
            <Button
              label="Xóa"
              className="p-button-danger"
              onClick={deleteCoupon}
            />
          </div>
        }
      >
        <p>
          Bạn có chắc chắn muốn xóa mã giảm giá {couponToDelete?.code} không?
        </p>
      </Dialog>
    </div>
  );
}

function FormCoupon({ couponData, setCouponData }) {
  return (
    <div className="flex flex-col gap-4">
      <label>Mã Giảm Giá</label>
      <InputText
        value={couponData.code}
        onChange={(e) => setCouponData({ ...couponData, code: e.target.value })}
        placeholder="Nhập mã giảm giá"
        className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
      />

      <label>Giá Trị Giảm Giá</label>
      <InputNumber
        value={couponData.value}
        onValueChange={(e) => setCouponData({ ...couponData, value: e.value })}
        placeholder="Nhập giá trị giảm giá"
        className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
      />

      <label>Mô Tả</label>
      <InputText
        value={couponData.description}
        onChange={(e) =>
          setCouponData({ ...couponData, description: e.target.value })
        }
        placeholder="Nhập mô tả"
        className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
      />

      <label>Giới Hạn Sử Dụng</label>
      <InputNumber
        value={couponData.usageLimit}
        onValueChange={(e) =>
          setCouponData({ ...couponData, usageLimit: e.value })
        }
        placeholder="Nhập số lần sử dụng tối đa"
        className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
      />

      <div className="flex items-center gap-3">
        <Checkbox
          inputId="isActive"
          checked={couponData.isActive}
          onChange={(e) =>
            setCouponData({ ...couponData, isActive: e.checked })
          }
        />
        <label htmlFor="isActive" className="text-lg">
          Kích hoạt mã
        </label>
      </div>
    </div>
  );
}
