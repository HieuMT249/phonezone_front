import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export default function EditProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = parseJwt(token);
      if (decodedToken) {
        const expirationTime = decodedToken.exp * 1000;
        if (Date.now() < expirationTime) {
          setUserId(
            decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ]
          );
        } else {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://localhost:7274/api/admin/AdminUser/${userId}`
        );
        setUser(data);
      } catch {
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Không thể lấy thông tin người dùng!",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = useCallback(async () => {
    try {
      await axios.put(
        `https://localhost:7274/api/admin/AdminUser/${userId}`,
        user
      );
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Cập nhật thông tin thành công!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: error.response?.data || "Có lỗi xảy ra!",
        life: 3000,
      });
    }
  }, [user, userId]);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-xl border border-gray-200">
      <Toast ref={toast} />
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        📝 Chỉnh sửa thông tin cá nhân
      </h2>
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height="2rem" className="w-full" />
          ))}
        </div>
      ) : (
        <>
          {["name", "email", "phoneNumber", "address"].map((field, i) => (
            <div key={i} className="mb-4">
              <label className="block text-gray-700 font-medium mb-1 capitalize">
                {field}
              </label>
              <InputText
                name={field}
                value={user[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 p-2"
              />
            </div>
          ))}
          <Button
            label="Lưu thay đổi"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            onClick={handleSave}
          />
        </>
      )}
    </div>
  );
}
