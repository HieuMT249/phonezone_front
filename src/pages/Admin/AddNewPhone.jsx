import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function AddNewPhone() {
  const toast = useRef(null);

  const [phoneData, setPhoneData] = useState({
    productName: "",
    oldPrice: "",
    newPrice: "",
    branch: "",
    image: "",
    productDescription: "",
    stock: "",
  });

  const [specification, setSpecification] = useState({
    thumbnails: "",
    outstandingFeatures: "",
    camera: "",
    model: "",
    colour: "",
    weight: "",
    video: "",
    cameraTrueDepth: "",
    chargingConnectivity: "",
    battery: "",
    country: "",
    company: "",
    guarantee: "",
    waterResistant: "",
    cameraFeatures: "",
    gpu: "",
    pin: "",
    chargingSupport: "",
    networkSupport: "",
    wifi: "",
    bluetooth: "",
    gps: "",
    chargingTechnology: "",
    fingerprintSensor: "",
    specialFeatures: "",
    rearCamera: "",
    frontCamera: "",
    sim: "",
    sensor: "",
    ram: "",
    cpu: "",
    nfc: "",
    chip: "",
    screenResolution: "",
    screenFeatures: "",
    internalMemory: "",
    batteryCapacity: "",
    screenSize: "",
    screen: "",
    operatingSystem: "",
  });

  //Hàm kiểm tra validate
  const priceRegex = /^\d{1,3}(\.\d{3})*đ$/;

  const validateForm = () => {
    if (!phoneData.productName) {
      showToast("error", "Lỗi", "Tên điện thoại không được để trống!");
      return false;
    }
    if (!phoneData.oldPrice) {
      showToast("error", "Lỗi", "Giá cũ không được để trống!");
      return false;
    }
    if (!priceRegex.test(phoneData.oldPrice)) {
      showToast(
        "error",
        "Lỗi",
        "Giá cũ phải có định dạng đúng, ví dụ: 5.000.000đ hoặc 300.000đ!"
      );
      return false;
    }
    if (!phoneData.newPrice) {
      showToast("error", "Lỗi", "Giá mới không được để trống!");
      return false;
    }
    if (!priceRegex.test(phoneData.newPrice)) {
      showToast(
        "error",
        "Lỗi",
        "Giá mới phải có định dạng đúng, ví dụ: 5.000.000đ hoặc 300.000đ!"
      );
      return false;
    }
    if (!phoneData.branch) {
      showToast("error", "Lỗi", "Hãng sản xuất không được để trống!");
      return false;
    }
    if (!phoneData.image) {
      showToast("error", "Lỗi", "Vui lòng nhập đường dẫn hình ảnh!");
      return false;
    }
    if (!phoneData.productDescription) {
      showToast("error", "Lỗi", "Mô tả sản phẩm không được để trống!");
      return false;
    }
    if (!phoneData.stock || isNaN(phoneData.stock) || phoneData.stock < 0) {
      showToast("error", "Lỗi", "Số lượng kho phải là số và không âm!");
      return false;
    }
    return true;
  };

  //Hiển thị thông báo bằng Toast
  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Gửi yêu cầu thêm mới sản phẩm (POST)
      const productResponse = await axios.post(
        "https://localhost:7274/api/admin/AdminProduct",
        phoneData
      );

      // Lấy id của sản phẩm vừa được tạo
      const newProductId = productResponse.data.id;

      // Gửi yêu cầu thêm mới specification với productId vừa tạo
      await axios.post("https://localhost:7274/api/admin/AdminSpecification", {
        ...specification,
        productId: newProductId,
      });

      // Hiển thị thông báo thành công
      showToast("success", "Thành công", "Sản phẩm đã được thêm!");

      // ✅ Reset lại form sau khi thêm thành công
      setPhoneData({
        productName: "",
        oldPrice: "",
        newPrice: "",
        branch: "",
        image: "",
        productDescription: "",
        stock: "",
      });

      setSpecification({
        thumbnails: "",
        outstandingFeatures: "",
        camera: "",
        model: "",
        colour: "",
        weight: "",
        video: "",
        cameraTrueDepth: "",
        chargingConnectivity: "",
        battery: "",
        country: "",
        company: "",
        guarantee: "",
        waterResistant: "",
        cameraFeatures: "",
        gpu: "",
        pin: "",
        chargingSupport: "",
        networkSupport: "",
        wifi: "",
        bluetooth: "",
        gps: "",
        chargingTechnology: "",
        fingerprintSensor: "",
        specialFeatures: "",
        rearCamera: "",
        frontCamera: "",
        sim: "",
        sensor: "",
        ram: "",
        cpu: "",
        nfc: "",
        chip: "",
        screenResolution: "",
        screenFeatures: "",
        internalMemory: "",
        batteryCapacity: "",
        screenSize: "",
        screen: "",
        operatingSystem: "",
      });
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      showToast("error", "Lỗi", "Đã xảy ra lỗi khi thêm sản phẩm.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
      <Toast ref={toast} />

      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        📱 Thêm điện thoại
      </h2>

      <div className="flex flex-col gap-4">
        <label>Tên điện thoại</label>
        <InputText
          value={phoneData.productName}
          onChange={(e) =>
            setPhoneData({ ...phoneData, productName: e.target.value })
          }
          placeholder="Nhập tên điện thoại"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Giá cũ (VND)</label>
        <InputText
          value={phoneData.oldPrice}
          onChange={(e) =>
            setPhoneData({ ...phoneData, oldPrice: e.target.value })
          }
          placeholder="Nhập giá cũ. Ví dụ: 5.000.000đ"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Giá mới (VND)</label>
        <InputText
          value={phoneData.newPrice}
          onChange={(e) =>
            setPhoneData({ ...phoneData, newPrice: e.target.value })
          }
          placeholder="Nhập giá mới. Ví dụ: 6.000.000đ"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Hãng sản xuất</label>
        <InputText
          value={phoneData.branch}
          onChange={(e) =>
            setPhoneData({ ...phoneData, branch: e.target.value })
          }
          placeholder="Nhập hãng sản xuất"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Hình ảnh sản phẩm (URL)</label>
        <InputText
          value={phoneData.image}
          onChange={(e) =>
            setPhoneData({ ...phoneData, image: e.target.value })
          }
          placeholder="Nhập đường dẫn hình ảnh"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Mô tả sản phẩm</label>
        <InputText
          value={phoneData.productDescription}
          onChange={(e) =>
            setPhoneData({ ...phoneData, productDescription: e.target.value })
          }
          placeholder="Nhập mô tả sản phẩm"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Số lượng trong kho</label>
        <InputText
          value={phoneData.stock}
          onChange={(e) =>
            setPhoneData({ ...phoneData, stock: e.target.value })
          }
          placeholder="Nhập số lượng"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        {/* Thông số kỹ thuật */}
        <label>Ảnh Thumbnail</label>
        <InputText
          value={specification.thumbnails || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              thumbnails: e.target.value,
            })
          }
          placeholder="Nhập URL ảnh thumbnail"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Đặc điểm nổi bật</label>
        <InputText
          value={specification.outstandingFeatures || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              outstandingFeatures: e.target.value,
            })
          }
          placeholder="Nhập đặc điểm nổi bật"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Camera</label>
        <InputText
          value={specification.camera || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              camera: e.target.value,
            })
          }
          placeholder="Nhập thông số camera"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Model</label>
        <InputText
          value={specification.model || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              model: e.target.value,
            })
          }
          placeholder="Nhập model"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Màu sắc</label>
        <InputText
          value={specification.colour || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              colour: e.target.value,
            })
          }
          placeholder="Nhập màu sắc"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Trọng lượng</label>
        <InputText
          value={specification.weight || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              weight: e.target.value,
            })
          }
          placeholder="Nhập trọng lượng"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Video</label>
        <InputText
          value={specification.video || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              video: e.target.value,
            })
          }
          placeholder="Nhập video"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Camera TrueDepth</label>
        <InputText
          value={specification.cameraTrueDepth || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              cameraTrueDepth: e.target.value,
            })
          }
          placeholder="Nhập thông số camera TrueDepth"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Cổng sạc & kết nối</label>
        <InputText
          value={specification.chargingConnectivity || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              chargingConnectivity: e.target.value,
            })
          }
          placeholder="Nhập thông số sạc và kết nối"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Pin</label>
        <InputText
          value={specification.battery || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              battery: e.target.value,
            })
          }
          placeholder="Nhập thông số pin"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Thương hiệu</label>
        <InputText
          value={specification.country || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              country: e.target.value,
            })
          }
          placeholder="Nhập thương hiệu"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Công ty sản xuất</label>
        <InputText
          value={specification.company || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              company: e.target.value,
            })
          }
          placeholder="Nhập công ty sản xuất"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Bảo hành</label>
        <InputText
          value={specification.guarantee || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              guarantee: e.target.value,
            })
          }
          placeholder="Nhập bảo hành"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Kháng nước & bụi</label>
        <InputText
          value={specification.waterResistant || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              waterResistant: e.target.value,
            })
          }
          placeholder="Nhập thông số kháng nước & bụi"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Tính năng camera</label>
        <InputText
          value={specification.cameraFeatures || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              cameraFeatures: e.target.value,
            })
          }
          placeholder="Nhập tính năng camera"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>GPU</label>
        <InputText
          value={specification.gpu || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              gpu: e.target.value,
            })
          }
          placeholder="Nhập GPU"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Loại Pin</label>
        <InputText
          value={specification.pin || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              pin: e.target.value,
            })
          }
          placeholder="Nhập loại pin"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Hỗ trợ sạc tối đa</label>
        <InputText
          value={specification.chargingSupport || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              chargingSupport: e.target.value,
            })
          }
          placeholder="Nhập hỗ trợ sạc tối đa"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Hỗ trợ mạng</label>
        <InputText
          value={specification.networkSupport || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              networkSupport: e.target.value,
            })
          }
          placeholder="Nhập hỗ trợ mạng"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Wi-Fi</label>
        <InputText
          value={specification.wifi || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              wifi: e.target.value,
            })
          }
          placeholder="Nhập thông số Wi-Fi"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Bluetooth</label>
        <InputText
          value={specification.bluetooth || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              bluetooth: e.target.value,
            })
          }
          placeholder="Nhập thông số Bluetooth"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>GPS</label>
        <InputText
          value={specification.gps || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              gps: e.target.value,
            })
          }
          placeholder="Nhập thông số GPS"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Công nghệ sạc</label>
        <InputText
          value={specification.chargingTechnology || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              chargingTechnology: e.target.value,
            })
          }
          placeholder="Nhập công nghệ sạc"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Cảm biến vân tay</label>
        <InputText
          value={specification.fingerprintSensor || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              fingerprintSensor: e.target.value,
            })
          }
          placeholder="Nhập thông số cảm biến vân tay"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Tính năng đặc biệt</label>
        <InputText
          value={specification.specialFeatures || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              specialFeatures: e.target.value,
            })
          }
          placeholder="Nhập tính năng đặc biệt"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Camera sau</label>
        <InputText
          value={specification.rearCamera || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              rearCamera: e.target.value,
            })
          }
          placeholder="Nhập camera sau"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Camera trước</label>
        <InputText
          value={specification.frontCamera || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              frontCamera: e.target.value,
            })
          }
          placeholder="Nhập camera trước"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>SIM</label>
        <InputText
          value={specification.sim || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              sim: e.target.value,
            })
          }
          placeholder="Nhập thông số SIM"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Cảm biến</label>
        <InputText
          value={specification.sensor || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              sensor: e.target.value,
            })
          }
          placeholder="Nhập thông số cảm biến"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>RAM</label>
        <InputText
          value={specification.ram || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              ram: e.target.value,
            })
          }
          placeholder="Nhập thông số RAM"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>CPU</label>
        <InputText
          value={specification.cpu || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              cpu: e.target.value,
            })
          }
          placeholder="Nhập CPU"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Công nghệ NFC</label>
        <InputText
          value={specification.nfc || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              nfc: e.target.value,
            })
          }
          placeholder="Nhập công nghệ NFC"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Chip</label>
        <InputText
          value={specification.chip || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              chip: e.target.value,
            })
          }
          placeholder="Nhập thông số chip"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Độ phân giải màn hình</label>
        <InputText
          value={specification.screenResolution || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              screenResolution: e.target.value,
            })
          }
          placeholder="Nhập độ phân giải màn hình"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Tính năng màn hình</label>
        <InputText
          value={specification.screenFeatures || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              screenFeatures: e.target.value,
            })
          }
          placeholder="Nhập tính năng màn hình"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Bộ nhớ trong</label>
        <InputText
          value={specification.internalMemory || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              internalMemory: e.target.value,
            })
          }
          placeholder="Nhập bộ nhớ trong"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Dung lượng pin</label>
        <InputText
          value={specification.batteryCapacity || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              batteryCapacity: e.target.value,
            })
          }
          placeholder="Nhập dung lượng pin"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Kích thước màn hình</label>
        <InputText
          value={specification.screenSize || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              screenSize: e.target.value,
            })
          }
          placeholder="Nhập kích thước màn hình"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Màn hình</label>
        <InputText
          value={specification.screen || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              screen: e.target.value,
            })
          }
          placeholder="Nhập loại màn hình"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        <label>Hệ điều hành</label>
        <InputText
          value={specification.operatingSystem || ""}
          onChange={(e) =>
            setSpecification({
              ...specification,
              operatingSystem: e.target.value,
            })
          }
          placeholder="Nhập hệ điều hành"
          className="p-inputtext-lg border border-gray-300 rounded-lg w-full px-4 py-3"
        />

        {/* Nút lưu */}
        <Button
          label="Thêm sản phẩm"
          onClick={handleSubmit}
          className="p-button-lg bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg w-full"
        />
      </div>
    </div>
  );
}
