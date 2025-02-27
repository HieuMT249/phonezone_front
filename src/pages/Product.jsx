import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";
import Card from "../components/Card";

function Product() {
  const [products, setProducts] = useState([]);
  const [allProduct, setAllProduct] = useState([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useRef(null);

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
    { name: "> 20.000.000đ", code: "t20", min: 20000000, max: Infinity },
  ];

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`https://localhost:7274/api/Products`);
        const shuffledProducts = shuffleArray(response.data);
        setProducts(shuffledProducts);
        setAllProduct(shuffledProducts);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadMore = () => {
    setDisplayCount((prevCount) => prevCount + 20);
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-end px-20">
      {loading ? (
        <div className="flex justify-content-center">
          <ProgressSpinner />
        </div>
      ) : (
        <>
          <Toast ref={toast} />
          <MultiSelect
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.value)}
            options={prices}
            optionLabel="name"
            display="chip"
            placeholder="Chọn khoảng giá tiền"
            maxSelectedLabels={3}
            className="w-96 border border-priamry border-2"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {products.slice(0, displayCount).map((product, index) => (
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
          {displayCount < products.length && (
            <div className="flex justify-center text-center mt-6">
              <button
                onClick={loadMore}
                className="flex items-center px-6 py-2 border border-black hover:border-primary hover:text-primary rounded "
              >
                Xem thêm{" "}
                <i className="ml-1">
                  <IoIosArrowDown />
                </i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Product;
