import { Link } from "react-router-dom";
import CouponCard from "../components/CouponCard";
import { useState, useEffect } from "react";
import AddCoupon from "../components/coupon/AddCoupon";
import CouponCategory from "../components/CouponCategory";
import axios from "axios";
import AddCouponModal from "../components/coupon/AddCouponModal";
import CouponDetail from "../components/coupon/CouponDetail";
function Home({ coupons }) {
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  const [category, setCategory] = useState(["카테고리1", "카테고리2", "카테고리3", "일", "두울", "세글자", "올리브영", "여섯글자는은", "카테고리3", "카테고리3", "카테고리3", "카테고리3"]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedCoupon, setSelectedCoupon] = useState(null); //클릭된 쿠폰 데이터 (hm)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 모달 열림 상태 (hm)

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

  //추가-hm
  const handleCouponClick = (coupon) => {
    console.log("Clicked coupon:", coupon); // 클릭한 쿠폰 데이터 확인
    if (window.innerWidth >= 768) {
      // md 이상: 4section에 표시
      setSelectedCoupon(coupon);
    } else {
      // md 이하: 모달로 표시
      setSelectedCoupon(coupon);
      setIsDetailModalOpen(true);
    }
  };

  useEffect(() => {
    console.log("Selected Coupon updated:", selectedCoupon); // 상태 업데이트 확인
  }, [selectedCoupon]);

  return (
    <div>
      <div>
        {/* <AddCouponForDesk /> */}
        {/* nav header로 이동 */}
        {/* <nav className="flex justify-center mb-2">
          <Link to="/board" className="w-1/2">
            <div className="flex justify-center items-center  h-10 bg-gray-100 hover:bg-gray-300 rounded-md">게시판</div>
          </Link>
          <Link to="/my-coupons" className="w-1/2">
            <div className="flex justify-center items-center  h-10 bg-gray-100 hover:bg-gray-300 rounded-md">쿠폰</div>
          </Link>
        </nav> */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr]">
          <div className="1 bg-white border-white rounded-lg shadow-md mb-6 mr-4 p-4">
            <div className="flex justify-between items-center mb-4 ">
              <button
                onClick={() => showFilteredCoupons("available")}
                className={` h-10 
              ${selectedFilter === "available" ? " text-emerald-700 font-bold" : "bg-white text-emerald-500 hover:"}`}
              >
                사용가능
              </button>
              <button
                onClick={() => showFilteredCoupons("expired")}
                className={` h-10 
              ${selectedFilter === "expired" ? " text-emerald-700 font-bold" : "bg-white  text-emerald-500 hover:"}`}
              >
                기간만료
              </button>
              <button
                onClick={() => showFilteredCoupons("shared")}
                className={` h-10 
              ${selectedFilter === "shared" ? " text-emerald-700 font-bold" : "bg-white  text-emerald-500 hover:"}`}
              >
                공유쿠폰
              </button>
              <button
                onClick={() => showFilteredCoupons("all")}
                className={`  h-10 
              ${selectedFilter === "all" ? " text-emerald-700 font-bold " : "bg-white  text-emerald-500 hover:"}`}
              >
                전체쿠폰
              </button>
            </div>

            <div className="text-sm">
              <CouponCategory category={category} handleCategoryClick={handleCategoryClick} addCategory={addCategory} />
            </div>
          </div>
          <div className="2 bg-white border-white rounded-lg shadow-md mb-6 p-4 mr-4">
            <div>222</div>
          </div>

          <div className="3section bg-slate-100 mr-4">
            <p className=" mb-1 text-sm">유효기간순</p>
            <div className=" space-y-4 h-screen overflow-auto no-scrollbar ">
              {filteredCoupons.length === 0 && <div>쿠폰이 없습니다.</div>}
              {filteredCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </div>
          <div className="4section hidden md:block bg-slate-100 pt-6 mr-4">{selectedCoupon && <CouponDetail setIsDetailModalOpen={setIsDetailModalOpen} coupon={selectedCoupon} isMdView={true} />}</div>
        </div>
        <AddCoupon />
      </div>

      {/* 모바일 모달 */}
      {isDetailModalOpen && <CouponDetail setIsDetailModalOpen={setIsDetailModalOpen} coupon={selectedCoupon} isMdView={false} />}
    </div>
  );
}

export default Home;
