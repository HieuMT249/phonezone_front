import { useState, useRef, useEffect, useCallback, useReducer } from "react";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
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

const initialState = { oldPassword: "", newPassword: "", confirmPassword: "" };
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
function reducer(state, action) {
  return { ...state, [action.name]: action.value };
}

export default function ChangePassword() {
  const [passwordData, dispatch] = useReducer(reducer, initialState);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? parseJwt(token) : null;
    if (decodedToken) {
      const isTokenValid = decodedToken.exp * 1000 > Date.now();
      if (isTokenValid) {
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
  }, [navigate]);

  const handleChange = (e) =>
    dispatch({ name: e.target.name, value: e.target.value });

  const handleSubmit = useCallback(async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.current.show({
        severity: "warn",
        summary: "Cảnh báo",
        detail: "Vui lòng nhập đầy đủ thông tin!",
        life: 3000,
      });
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail:
          "Mật khẩu phải có ít nhất 8 ký tự, một chữ in hoa, một chữ số và một ký tự đặc biệt.",
        life: 3000,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.current.show({
        severity: "warn",
        summary: "Cảnh báo",
        detail: "Mật khẩu xác nhận không khớp!",
        life: 3000,
      });
      return;
    }

    try {
      await axios.put(
        `https://localhost:7274/api/Users/changepassword/${userId}`,
        { oldPassword, newPassword }
      );
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đổi mật khẩu thành công!",
        life: 3000,
      });
      dispatch({ name: "oldPassword", value: "" });
      dispatch({ name: "newPassword", value: "" });
      dispatch({ name: "confirmPassword", value: "" });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: error.response?.data || "Có lỗi xảy ra khi đổi mật khẩu!",
        life: 3000,
      });
    }
  }, [passwordData, userId]);

  const renderInput = (label, name) => (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <Password
        name={name}
        value={passwordData[name]}
        onChange={handleChange}
        toggleMask
        className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl border border-gray-200">
      <Toast ref={toast} />
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        🔒 Đổi Mật Khẩu
      </h2>
      {renderInput("Mật khẩu cũ", "oldPassword")}
      {renderInput("Mật khẩu mới", "newPassword")}
      {renderInput("Xác nhận mật khẩu mới", "confirmPassword")}
      <Button
        label="Đổi mật khẩu"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        onClick={handleSubmit}
      />
    </div>
  );
}
