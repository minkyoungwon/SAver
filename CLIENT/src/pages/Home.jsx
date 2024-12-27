import { Link } from "react-router-dom"
import CouponCard from "../components/CouponCard";
import { useState, useEffect } from "react";
import AddCoupon from "../components/coupon/AddCoupon";
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
    },
  ]); 

  const [category, setCategory] = useState([]);
  const handleCategoryClick = (item) => {
    setCategory(item);
    const filteredCoupons = coupons.filter((coupon) => coupon.category === item);
    setCoupons(filteredCoupons);
  }
  const showFilteredCoupons = (filter) => {
    const filteredCoupons = coupons.filter((coupon) => {
      return coupon.status === filter;
    });
    setCoupons(filteredCoupons);
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
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCategory(response.data);
    };
  return (
    <div>
        <nav className="flex justify-center">
          <div className="flex justify-center items-center w-1/2 h-10 bg-gray-100 hover:bg-gray-300 rounded-md">
            <Link to="/board">게시판</Link>
          </div>
          <div className="flex justify-center items-center w-1/2 h-10 bg-gray-100 hover:bg-gray-300 rounded-md">
            <Link to="/coupon">쿠폰</Link>
          </div>
        </nav>
        <div className="flex justify-evenly items-center">
          <button onClick={() => showFilteredCoupons("available")} className="w-1/4 h-10 text-gray-600 hover:bg-gray-200 rounded-md active:text-gray-600">사용가능</button>
          <button onClick={() => showFilteredCoupons("expired")} className="w-1/4 h-10 text-gray-600 hover:bg-gray-200 rounded-md">기간만료</button>
          <button onClick={() => showFilteredCoupons("shared")} className="w-1/4 h-10 text-gray-600 hover:bg-gray-200 rounded-md">공유쿠폰</button>
          <button onClick={() => showFilteredCoupons("all")} className="w-1/4 h-10 text-gray-600 hover:bg-gray-200 rounded-md">전체쿠폰</button>
        </div>  

        <div className="grid grid-cols-4 gap-4">
          <CouponCategory category={category} handleCategoryClick={handleCategoryClick}/>
        </div>

        <div className="flex justify-between items-center p-4">
          <div className="text-gray-600">
            유효기간순
          </div>
          <div className="text-gray-600">
            사용가능 쿠폰 개수 : {coupons.length} 개
          </div>
        </div>

        <div className="p-4 space-y-4 bg-gray-50 h-screen overflow-y-auto">
          {coupons.length === 0 && <div>쿠폰이 없습니다.</div>}
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              imageSrc={coupon.imageSrc}
              title={coupon.title}
              description={coupon.description}
              expiryDate={coupon.expiryDate}
            />
          ))}
        </div>
        <AddCoupon />
    </div>
  )
}

export default Home