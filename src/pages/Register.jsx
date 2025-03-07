import images from "../assets/images/index";
import { HiOutlineMail, HiOutlineUser, HiOutlinePhone } from "react-icons/hi";
import { CiLock } from "react-icons/ci";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useRef(null);

  const navigate = useNavigate();

  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      name === "" ||
      email === "" ||
      phonenumber === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Vui lòng điền đầy đủ thông tin",
        life: 2000,
      });
      return;
    }

    if (!usernameRegex.test(name)) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail:
          "Username chỉ được chứa chữ cái không dấu và số, không có khoảng trắng.",
        life: 2000,
      });
      return;
    }

    if (phonenumber.length !== 10) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Số điện thoại không đúng định dạng",
        life: 2000,
      });
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail:
          "Mật khẩu phải có ít nhất 8 ký tự, một chữ in hoa, một chữ số và một ký tự đặc biệt.",
        life: 2000,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Mật khẩu xác nhận không đúng",
        life: 2000,
      });
      return;
    }

    if (name.length > 20) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Username không vượt quá 20 kí tự",
        life: 2000,
      });
      return;
    }
    setLoading(true);
    try {
      await axios.post("https://localhost:7274/api/Auth/register", {
        name,
        email,
        phonenumber,
        password,
        confirmPassword,
      });

      navigate("/login");
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
      {/* Left Section - Image */}
      <div className="flex items-center pt-10 hidden md:block">
        <img
          className="max-w-full h-auto"
          src={images.login}
          alt="Register Devices"
        />
      </div>

      {/* TOAST */}
      <Toast ref={toast} />

      {/* Right Section - Form */}
      <form
        className="flex flex-col items-center h-fit flex-1 border border-primary rounded-lg py-10 md:px-20 px-10 mx-4 md:ml-40 bg-white shadow-lg"
        onSubmit={handleRegister}
      >
        {/* Title */}
        <div className="text-2xl font-bold mb-6">ĐĂNG KÝ</div>

        {/* Name */}
        <div className="flex items-center bg-white border border-gray-300 rounded-lg my-2 px-4 py-2 w-full">
          <HiOutlineUser className="text-gray-400 mr-3 text-xl" />
          <input
            type="text"
            placeholder="Username"
            className="outline-none flex-1 text-gray-700 placeholder-gray-400"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="flex items-center bg-white border border-gray-300 rounded-lg my-2 px-4 py-2 w-full">
          <HiOutlineMail className="text-gray-400 mr-3 text-xl" />
          <input
            type="email"
            placeholder="Email"
            className="outline-none flex-1 text-gray-700 placeholder-gray-400"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="flex items-center bg-white border border-gray-300 rounded-lg my-2 px-4 py-2 w-full">
          <HiOutlinePhone className="text-gray-400 mr-3 text-xl" />
          <input
            type="tel"
            placeholder="Số điện thoại"
            className="outline-none flex-1 text-gray-700 placeholder-gray-400"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex items-center bg-white border border-gray-300 rounded-lg my-2 px-4 py-2 w-full">
          <CiLock className="text-gray-400 mr-3 text-xl" />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="outline-none flex-1 text-gray-700 placeholder-gray-400"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Password Confirmation */}
        <div className="flex items-center bg-white border border-gray-300 rounded-lg my-2 px-4 py-2 w-full">
          <CiLock className="text-gray-400 mr-3 text-xl" />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="outline-none flex-1 text-gray-700 placeholder-gray-400"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Register Button */}
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-all my-4">
          ĐĂNG KÝ
        </button>
        {/* Sign-in link */}
        <div className="text-sm text-gray-500 mt-6">
          Bạn đã có tài khoản?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Đăng nhập ngay
          </a>
        </div>
      </form>
    </div>
  );
}

export default Register;
