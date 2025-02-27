import { FaMapLocationDot, FaPhone } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";

function Footer() {
  return (
    <div className="flex justify-between h-48 bg-black py-16 px-20">
      <div className="text-5xl font-mono">
        <span className="text-white">PHONE</span>
        <span className="text-primary">ZONE</span>
      </div>

      <div className="text-white text-sm font-thin">
        <div className="flex items-center">
          <i>
            <FaMapLocationDot />
          </i>
          <span className="ml-2">
            19 Đ. Nguyễn Hữu Thọ, Tân Hưng, Quận 7, Hồ Chí Minh
          </span>
        </div>
        <div className="flex items-center mt-3">
          <i>
            <FaPhone />
          </i>
          <span className="ml-2">(028) 37 755 035</span>
        </div>
        <div className="flex items-center mt-3">
          <i>
            <FiMail />
          </i>
          <span className="ml-2">tonducthanguniversity@tdtu.edu.vn</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
