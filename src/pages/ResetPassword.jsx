import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useRef(null);

  const showToast = (severity, summary, detail) => {
    toast.current.clear();
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const handleResetPassword = async () => {
    // Kiểm tra độ mạnh của mật khẩu
    if (!passwordRegex.test(newPassword)) {
      showToast(
        "warn",
        "Cảnh báo",
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ in hoa, số và ký tự đặc biệt!"
      );
      return;
    }

    // Kiểm tra mật khẩu nhập lại
    if (newPassword !== confirmPassword) {
      showToast("warn", "Cảnh báo", "Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      await axios.post("https://localhost:7274/api/Auth/reset-password", {
        token,
        newPassword,
      });

      showToast("success", "Thành công", "Mật khẩu đã được đặt lại!");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      showToast("error", "Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
      <Toast ref={toast} />
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        🔒 Đặt Lại Mật Khẩu
      </h2>
      <input
        type="password"
        className="w-full p-3 border rounded-lg mb-2"
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <p className="text-sm text-gray-500 mb-2">
        🔹 Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ in hoa, số và ký tự đặc
        biệt.
      </p>
      <input
        type="password"
        className="w-full p-3 border rounded-lg mb-4"
        placeholder="Nhập lại mật khẩu"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button
        label="Đặt lại mật khẩu"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
        onClick={handleResetPassword}
      />
    </div>
  );
}
