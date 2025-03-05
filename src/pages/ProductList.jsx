import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import { useLocation } from "react-router-dom";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import images from "../assets/images";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const brand = window.location.pathname.split("/").pop();
  const toast = useRef(null);

  const location = useLocation();
  const { search } = location.state || {};

  const [selectedPrice, setSelectedPrice] = useState([]);
  const prices = [
    {
      name: "2.000.000đ - 5.000.000đ",
      code: "2t5",
      min: 2000000,
      max: 5000000,
    },
    {
      name: "5.000.000đ - 10.000.000đ",
      code: "5t10",
      min: 5000000,
      max: 10000000,
    },
    {
      name: "10.000.000đ - 20.000.000đ",
      code: "10t20",
      min: 10000000,
      max: 20000000,
    },
    { name: "> 20.000.000đ", code: "t20", min: 2000000, max: Infinity },
  ];

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        if (search) {
          setProducts(search);
        } else {
          const response = await axios.get(
            `https://localhost:7274/api/Products/dienthoai/${brand}`
          );
          setProducts(response.data);
          setAllProduct(response.data);
          setLoading(false);
        }
      } catch (err) {
        setError("Không thể tải dữ liệu");
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, [brand, search]);

  useEffect(() => {
    const filterProductsByPrice = () => {
      if (Array.isArray(selectedPrice) && selectedPrice.length > 0) {
        const minPrice = Math.min(...selectedPrice.map((price) => price.min));
        const maxPrice = Math.max(...selectedPrice.map((price) => price.max));

        const filtered = products.filter((product) => {
          return selectedPrice.some((priceRange) => {
            const price = product.newPrice.replace("đ", "").replace(/\./g, "");
            const priceNumber = parseFloat(price);

            return priceNumber >= minPrice && priceNumber <= maxPrice;
          });
        });
        if (filtered.length > 0) {
          setProducts(filtered);
        } else {
          setProducts(allProduct);
          toast.current.show({
            severity: "info",
            summary: "Thông báo",
            detail: "Không có sản phẩm với giá bạn chọn!",
            life: 3000,
          });
        }
      } else {
        setProducts(allProduct);
      }
    };

    filterProductsByPrice();
  }, [selectedPrice, allProduct, products]);

  const branchs = [
    {
      image: images.apple,
      alt: "apple",
      uri: "/dienthoai/iphone",
    },
    {
      image: images.asus,
      alt: "asus",
      uri: "/dienthoai/asus",
    },
    {
      image: images.honor,
      alt: "honor",
      uri: "/dienthoai/honor",
    },
    {
      image: images.huawei,
      alt: "huawei",
      uri: "/dienthoai/huawei",
    },
    {
      image: images.nokia,
      alt: "nokia",
      uri: "/dienthoai/nokia",
    },
    {
      image: images.oppo,
      alt: "oppo",
      uri: "/dienthoai/oppo",
    },
    {
      image: images.realme,
      alt: "realme",
      uri: "/dienthoai/realme",
    },
    {
      image: images.samsung,
      alt: "samsung",
      uri: "/dienthoai/samsung",
    },
    {
      image: images.vivo,
      alt: "vivo",
      uri: "/dienthoai/vivo",
    },
    {
      image: images.all,
      alt: "all",
      uri: "/dienthoai",
    },
  ];

  return (
    <div className="py-6 px-4 min-h-screen flex flex-col justify-center items-end">
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <ProgressSpinner />
        </div>
      ) : (
        <>
          <Toast ref={toast} />
          <div className="w-full flex justify-between">
            {branchs.map((branch, index) => (
                <a
                  href={branch.uri}
                  className="relative flex justify-center items-center mb-8 bg-radial md:p-3 p-2 rounded-full drop-shadow-xl hover:scale-125 transition-transform duration-200 ease-in-out"
                >
                  <div key={index}>
                    <img className="relative z-10 md:w-10 md:h-10 w-6 h-6 object-contain rounded-full overflow-visible" src={branch.image} alt={branch.alt} />
                  </div>
                </a>
            ))}
          </div>
          <MultiSelect
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.value)}
            options={prices}
            optionLabel="name"
            display="chip"
            placeholder="Chọn khoảng giá tiền"
            maxSelectedLabels={3}
            className="md:w-96 w-68 border border-priamry border-2"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mt-10 w-full">
            {products.map((product, index) => (
              <Card
                key={index}
                image={product.image}
                productName={product.productName}
                name={product.id}
                newPrice={product.newPrice}
                oldPrice={product.oldPrice}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;
