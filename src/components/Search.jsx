import axios from "axios";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { DataScroller } from "primereact/datascroller";
import { useNavigate } from "react-router-dom";

function Search() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`https://localhost:7274/api/Products`);
        setProducts(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

  const handleClick = (i, name) => {
    localStorage.setItem("name", i);
    navigate(`/dienthoai/details/${name}`);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const result = products.filter((product) =>
      product.productName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProducts(result);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const result = products.filter((product) =>
        product.productName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(result);
      navigate(`/dienthoai/search=${search}`, {
        state: { search: filteredProducts },
      });
    }
  };

  const itemTemplate = (data) => {
    return (
      <div
        className="col-12"
        onClick={() => handleClick(data.id, data.productName)}
      >
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-12 font-mono text-black hover:bg-second cursor-pointer">
          <img
            className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
            src={data.image}
            alt={data.productName}
          />
          <div className="flex flex-column lg:flex-row justify-content-between align-items-center xl:align-items-start lg:flex-1 gap-4">
            <div className="flex flex-column align-items-center lg:align-items-start gap-3">
              <div className="flex flex-column gap-1">
                <div className="text-lg font-semibold">{data.productName}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <input
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        value={search}
        placeholder={`Tìm kiếm theo tên sản phẩm...`}
        className="absolute right-1/4 ml-48 border border-slate-400 outline-second rounded-full w-1/2 h-10 p-3 pl-8 text-xs"
      />
      <i className="absolute top-3 left-1/4 ml-3">
        <BiSearchAlt color="gray" />
      </i>
      {filteredProducts && (
        <DataScroller
          className="absolute w-1/2 top-10 left-1/4"
          value={filteredProducts}
          itemTemplate={itemTemplate}
          rows={5}
          inline
          scrollHeight="100px"
        />
      )}
    </div>
  );
}

export default Search;
