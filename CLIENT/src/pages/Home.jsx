import { Link } from "react-router-dom";
import CouponCard from "../components/CouponCard";
import { useState, useEffect } from "react";
import AddCoupon from "../components/coupon/AddCoupon";
import AddCoupon2 from "../components/coupon/AddCoupon2";
import CouponCategory from "../components/CouponCategory";
import axios from "axios";
function Home() {
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      imageSrc: null, // 이미지 URL이 없을 경우 기본 "이미지" 텍스트가 표시됩니다.
      title: "쿠폰명(상호명)",
      description: "쿠폰 디스크립션 쿠폰 디스크립션 쿠폰 디스크립션",
      expiryDate: "2024.12.31",
      category: "카테고리1",
      status: "available",
    },
    {
      id: 2,
      imageSrc: null,
      title: "스타벅스 아메리카노",
      description: "스타벅스 아메리카노 무료 쿠폰",
      expiryDate: "2024.06.30",
      category: "카테고리2",
      status: "available",
    },
    {
      id: 3,
      imageSrc: null,
      title: "배스킨라빈스 싱글레귤러",
      description: "배스킨라빈스 아이스크림 싱글레귤러 교환권",
      expiryDate: "2024.08.31",
      category: "카테고리1",
      status: "used",
    },
    {
      id: 4,
      imageSrc: null,
      title: "CGV 영화 관람권",
      description: "CGV 2D 일반 영화 관람권",
      expiryDate: "2024.12.31",
      category: "카테고리3",
      status: "expired",
    },
    {
      id: 5,
      imageSrc: null,
      title: "버거킹 와퍼",
      description: "버거킹 와퍼 단품 교환권",
      expiryDate: "2024.09.30",
      category: "카테고리2",
      status: "available",
    },
  ]);
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  const [category, setCategory] = useState(["카테고리1", "카테고리2", "카테고리3"]);
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
    const response = await axios.get(`${import.meta.env.VITE_EC2_URL}/api/coupons`);
    setCoupons(response.data);
  };
  const fetchCategory = async () => {
    const response = await axios.get(`${import.meta.env.VITE_EC2_URL}/api/category`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setCategory(response.data);
  };
  return (
    <div>
      <div>
        <nav className="flex justify-center">
          <Link to="/board" className="w-1/2">
            <div className="flex justify-center items-center  h-10 bg-gray-100 hover:bg-gray-300 rounded-md">게시판</div>
          </Link>
          <Link to="/coupon" className="w-1/2">
            <div className="flex justify-center items-center  h-10 bg-gray-100 hover:bg-gray-300 rounded-md">쿠폰</div>
          </Link>
        </nav>
        <div className="flex justify-evenly items-center">
          <button 
            onClick={() => showFilteredCoupons("available")} 
            className={`w-1/4 h-10 border border-[#74C79E] rounded-md
              ${selectedFilter === "available" 
                ? "bg-[#74C79E] text-white" 
                : "bg-white text-[#74C79E] hover:bg-[#e8f4ee]"
              }`}
          >
            사용가능
          </button>
          <button 
            onClick={() => showFilteredCoupons("expired")} 
            className={`w-1/4 h-10 border border-[#74C79E] rounded-md
              ${selectedFilter === "expired" 
                ? "bg-[#74C79E] text-white" 
                : "bg-white text-[#74C79E] hover:bg-[#e8f4ee]"
              }`}
          >
            기간만료
          </button>
          <button 
            onClick={() => showFilteredCoupons("shared")} 
            className={`w-1/4 h-10 border border-[#74C79E] rounded-md
              ${selectedFilter === "shared" 
                ? "bg-[#74C79E] text-white" 
                : "bg-white text-[#74C79E] hover:bg-[#e8f4ee]"
              }`}
          >
            공유쿠폰
          </button>
          <button 
            onClick={() => showFilteredCoupons("all")} 
            className={`w-1/4 h-10 border border-[#74C79E] rounded-md
              ${selectedFilter === "all" 
                ? "bg-[#74C79E] text-white" 
                : "bg-white text-[#74C79E] hover:bg-[#e8f4ee]"
              }`}
          >
            전체쿠폰
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <CouponCategory category={category} handleCategoryClick={handleCategoryClick} addCategory={addCategory} />
        </div>
        <div className="flex justify-center items-center w-1/2 h-10 bg-gray-100 hover:bg-gray-300 rounded-md">
          <Link to="/coupon">쿠폰</Link>
        </div>
        <div className="p-4 space-y-4 bg-gray-50 h-screen overflow-y-auto">
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
