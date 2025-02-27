import { useNavigate } from "react-router-dom";
import images from "../assets/images/index";
import { Ripple } from "primereact/ripple";

function CartPopUp({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] z-50 px-80 drop-shadow-xl">
      <div className="relative top-28 left-64 bg-white opacity-100 h-80 rounded-xl p-4 w-96">
        <button onClick={onClose} className="absolute right-6 top-4">
          X
        </button>
        <div className="flex flex-col items-center justify-center">
          <img src={images.logo} alt="logo" />
          <div className="px-6 mt-4 font-semibold">
            Vui lòng đăng nhập tài khoản để có thể xem ưu đãi và thanh toán dễ
            dàng hơn.
          </div>
          <div className="flex justify-around w-full mt-4">
            <button
              onClick={() => navigate("/register")}
              className="py-4 px-10 rounded-xl border border-primary hover:scale-125 transition-transform duration-200 ease-in-out"
            >
              Đăng ký
            </button>
            <button
              onClick={() => navigate("/login")}
              className="py-4 px-8 rounded-xl border border-primary bg-primary text-white hover:scale-125 transition-transform duration-200 ease-in-out"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPopUp;
