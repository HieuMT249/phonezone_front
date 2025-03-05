import { useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const toast = useRef(null);

  const showToast = (severity, summary, detail) => {
    toast.current.clear();
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showToast("warn", "Cảnh báo", "Vui lòng nhập email!");
      return;
    }

    try {
      await axios.post("https://localhost:7274/api/Auth/forgot-password", {
        email,
      });

      showToast(
        "success",
        "Thành công",
        "Yêu cầu đặt lại mật khẩu đã được gửi!"
      );
      setEmail("");
    } catch {
      showToast("error", "Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
      <Toast ref={toast} />
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        🔑 Quên Mật Khẩu
      </h2>
      <input
        type="email"
        className="w-full p-3 border rounded-lg mb-4"
        placeholder="Nhập email của bạn"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        label="Gửi Yêu Cầu"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
        onClick={handleForgotPassword}
      />
    </div>
  );
}
