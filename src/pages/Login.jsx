import images from "../assets/images/index";
import { HiOutlineMail } from "react-icons/hi";
import { CiLock } from "react-icons/ci";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef, useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useRef(null);
  const navigate = useNavigate();

  // Hàm decode token để lấy thông tin user
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = atob(base64);
      return JSON.parse(decodedPayload);
    } catch {
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://localhost:7274/api/Auth/login",
        {
          email,
          password,
        }
      );

      // Lưu token vào localStorage
      const token = response.data;
      localStorage.setItem("token", token);

      // Giải mã token để lấy role của user
      const decodedToken = parseJwt(token);
      const userRole =
        decodedToken?.[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      // Điều hướng dựa trên vai trò
      if (userRole === "Admin") {
        navigate("/admin"); // Chuyển đến trang Admin nếu là Admin
      } else {
        const previousUrl = sessionStorage.getItem("previousUrl");
        navigate(previousUrl || "/");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessage = err.response.data;
        toast.current.show({
          severity: "error",
          summary: "Lỗi",
          detail: errorMessage,
          life: 3000,
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex md:justify-between justify-center min-h-screen bg-gradient-15 md:p-40 pt-20">
      {/* Image */}
      <div className="flex items-center pt-10 hidden md:block">
        <img
          className="max-w-full h-auto"
          src={images.login}
          alt="Login Devices"
        />
      </div>

      {/* TOAST */}
      <Toast ref={toast} />

      {/* Form */}
      <form
        className="flex flex-col items-center h-fit flex-1 border border-primary rounded-lg py-10 md:px-20 px-10 mx-4 md:ml-40 bg-white shadow-lg"
        onSubmit={handleLogin}
      >
        {/* Title */}
        <div className="text-2xl font-bold mb-6">ĐĂNG NHẬP</div>

        {/* Email */}
        <div className="flex items-center bg-white border border-primary rounded-lg my-4 px-4 py-2 w-full">
          <HiOutlineMail className="text-gray-400 mr-3 text-xl" />
          <input
            type="email"
            placeholder="Email"
            className="outline-none flex-1 text-gray-700 placeholder-gray-400"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex items-center bg-white border border-primary rounded-lg my-4 px-4 py-2 w-full">
          <CiLock className="text-gray-400 mr-3 text-xl" />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="outline-none flex-1 text-gray-700 placeholder-gray-400"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex justify-end items-center w-full my-4">
          <a
            href="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>

        {/* Login Button */}
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-all">
          ĐĂNG NHẬP
        </button>

        {/* Sign-up link */}
        <div className="text-sm text-gray-500 mt-6">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Đăng ký
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
