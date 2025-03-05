import { Carousel } from "primereact/carousel";
import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";

function CarouselDisplay({ user, setShowPopUp }) {
  const [productsShock, setProductsShock] = useState([]);
  const [productsDeal, setProductsDeal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [newPriceD, setNewPrice] = useState();
  const [oldPriceD, setOldPrice] = useState();

  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: "1024px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "820px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "768px",
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: "431x",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const shockResponse = await axios.get(
          "https://localhost:7274/api/Products/shock"
        );
        const dealResponse = await axios.get(
          "https://localhost:7274/api/Products/deal"
        );

        const shockWithDiscount = shockResponse.data.map((product) => {
          const discount = Math.floor(Math.random() * 3) + 3;
          const originalPrice = product.newPrice
            .replace("đ", "")
            .replace(/\./g, "")
            .replace(/\,/g, "");
          const originalPriceNumber = parseFloat(originalPrice);

          const newCalculatedPrice =
            originalPriceNumber - (originalPriceNumber * discount) / 100;

          return {
            ...product,
            discount: parseFloat(discount),
            newPrice: Intl.NumberFormat("vi-VN").format(newCalculatedPrice) + "đ",
            oldPrice: Intl.NumberFormat("vi-VN").format(originalPriceNumber) + "đ",
          };
        });

        const dealWithDiscount = dealResponse.data.map((product) => {
          const discount = Math.floor(Math.random() * 3) + 3;
          const originalPrice = product.newPrice
            .replace("đ", "")
            .replace(/\./g, "")
            .replace(/\,/g, "");
          const originalPriceNumber = parseFloat(originalPrice);

          const newCalculatedPrice =
            originalPriceNumber - (originalPriceNumber * discount) / 100;

          return {
            ...product,
            discount: parseFloat(discount),
            newPrice: Intl.NumberFormat("vi-VN").format(newCalculatedPrice) + "đ",
            oldPrice: Intl.NumberFormat("vi-VN").format(originalPriceNumber) + "đ",
          };
        });

        setProductsShock(shockWithDiscount);
        setProductsDeal(dealWithDiscount);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const productTemplate = (product) => {
    return (
      <Card
        image={product.image}
        productName={product.productName}
        name={product.id}
        newPrice={product.newPrice}
        oldPrice={product.oldPrice}
        user={user}
        discount={product.discount}
        setShowPopUp={setShowPopUp}
      />
    );
  };

  return (
    <div className="md:p-10 p-4">
      <div className="border border-second p-4 mt-10 h-[36rem] rounded-3xl bg-gradient-15 md:mt-0 md:p-10">
        <div className="flex md:pl-12 mb-8">
          <div
            className={`text-center w-32 cursor-pointer ${
              activeTab === 0
                ? "text-primary border-b-2 border-primary text-2xl font-bold"
                : "text-lg"
            }`}
            onClick={() => setActiveTab(0)}
          >
            Giá sốc!
          </div>
          <div
            className={`text-center w-32 cursor-pointer ${
              activeTab === 1
                ? "text-primary border-b-2 border-primary text-2xl font-bold"
                : "text-lg"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Hot Deal
          </div>
        </div>
        <Carousel
          value={activeTab === 0 ? productsShock : productsDeal}
          numVisible={4}
          numScroll={3}
          responsiveOptions={responsiveOptions}
          className="custom-carousel"
          circular
          autoplayInterval={3000}
          itemTemplate={productTemplate}
        />
      </div>
    </div>
  );
}

export default CarouselDisplay;