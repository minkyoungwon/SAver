import { Link } from "react-router-dom";
import CouponCard from "../components/CouponCard";
import { useState, useEffect } from "react";
import AddCoupon from "../components/coupon/AddCoupon";
import CouponCategory from "../components/CouponCategory";
import axios from "axios";
function Home({ coupons }) {
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  const [category, setCategory] = useState(["카테고리1", "카테고리2", "카테고리3", "일", "두울", "세글자", "올리브영", "여섯글자는은", "카테고리3", "카테고리3", "카테고리3", "카테고리3"]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const handleCategoryClick = (item) => {
    console.log("선택된 카테고리", item);
    // setCategory(item);
    const filteredCoupons = coupons.filter((coupon) => coupon.category === item);
    setFilteredCoupons(filteredCoupons);
  };
  const showFilteredCoupons = (filter) => {
    setSelectedFilter(filter);
    if (filter === "all") {
      setFilteredCoupons(coupons);
      return;
    }
    const filteredCoupons = coupons.filter((coupon) => {
      return coupon.status === filter;
    });
    setFilteredCoupons(filteredCoupons);
  };

  const addCategory = (input) => {
    if (input === "") {
      alert("카테고리를 입력해주세요.");
      return;
    }
    const isCategoryExist = category.includes(input);
    if (isCategoryExist) {
      alert("이미 존재하는 카테고리입니다.");
      return;
    }
    setCategory([...category, input]);
  };

  useEffect(() => {
    fetchCoupons();
    fetchCategory();
  }, []);

  const fetchCoupons = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/coupons`);
    setCoupons(response.data);
  };
  const fetchCategory = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setCategory(response.data);
  };
  return (
    <div>
      <div>
        {/* nav header로 이동 */}
        {/* <nav className="flex justify-center mb-2">
          <Link to="/board" className="w-1/2">
            <div className="flex justify-center items-center  h-10 bg-gray-100 hover:bg-gray-300 rounded-md">게시판</div>
          </Link>
          <Link to="/my-coupons" className="w-1/2">
            <div className="flex justify-center items-center  h-10 bg-gray-100 hover:bg-gray-300 rounded-md">쿠폰</div>
          </Link>
        </nav> */}

        <div className=" border-white rounded-lg shadow-md my-6 p-4">
          <div className="flex justify-between items-center mb-4 ">
            <button
              onClick={() => showFilteredCoupons("available")}
              className={`w-[200px] h-10 pr-20 
              ${selectedFilter === "available" ? " text-emerald-700 font-bold" : "bg-white text-emerald-500 hover:"}`}
            >
              사용가능
            </button>
            <button
              onClick={() => showFilteredCoupons("expired")}
              className={`w-[200px] h-10 pr-20 
              ${selectedFilter === "expired" ? " text-emerald-700 font-bold" : "bg-white  text-emerald-500 hover:"}`}
            >
              기간만료
            </button>
            <button
              onClick={() => showFilteredCoupons("shared")}
              className={`w-[200px] h-10 pr-20 
              ${selectedFilter === "shared" ? " text-emerald-700 font-bold" : "bg-white  text-emerald-500 hover:"}`}
            >
              공유쿠폰
            </button>
            <button
              onClick={() => showFilteredCoupons("all")}
              className={` w-[200px] h-10 
              ${selectedFilter === "all" ? " text-emerald-700 font-bold " : "bg-white  text-emerald-500 hover:"}`}
            >
              전체쿠폰
            </button>
          </div>

          <div className="text-sm">
            <CouponCategory category={category} handleCategoryClick={handleCategoryClick} addCategory={addCategory} />
          </div>
        </div>

        <>
          <p className="mb-2 text-sm">유효기간순</p>
        </>

        {/* <div className="flex justify-center items-center w-1/2 h-10 bg-gray-100 hover:bg-gray-300 rounded-md">
          <Link to="/coupon">쿠폰</Link>
        </div> */}

        <div className=" space-y-4 h-screen overflow-y-auto">
          {filteredCoupons.length === 0 && <div>쿠폰이 없습니다.</div>}
          {filteredCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
        <AddCoupon />
        {/* <AddCoupon2 /> */}
      </div>
    </div>
  );
}

export default Home;
