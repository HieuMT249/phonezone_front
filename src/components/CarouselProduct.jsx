import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import Card from "./Card";

function CarouselProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [displayCount, setDisplayCount] = useState(8);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const response = await axios.get("https://localhost:7274/api/Products");

        const shuffledProducts = shuffleArray(response.data);
        setProducts(shuffledProducts);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu");
        setLoading(false);
      }
    };

    fetchRandomProducts();
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
    <div className="px-10 flex flex-col items-end">
      {loading ? (
        <div className="flex justify-content-center">
          <ProgressSpinner />
        </div>
      ) : (
        <>
          <div className="w-full border border-second rounded-xl bg-gradient-15 py-10 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
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
            <div className="flex justify-center items-center text-center my-6 w-full mx-auto">
              <button
                onClick={loadMore}
                className="flex items-center px-6 py-2 border border-second hover:border-primary hover:text-primary rounded "
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

export default CarouselProduct;
