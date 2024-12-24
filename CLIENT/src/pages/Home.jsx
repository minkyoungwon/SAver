import { Link } from "react-router-dom"
import CouponCard from "../components/CouponCard";
import { useState, useEffect } from "react";
function Home() {
  const [coupons, setCoupons] = useState([]); 
    // {
    //   id: 1,
    //   imageSrc: null, // 이미지 URL이 없을 경우 기본 "이미지" 텍스트가 표시됩니다.
    //   title: "쿠폰명(상호명)",
    //   description: "쿠폰 디스크립션 쿠폰 디스크립션 쿠폰 디스크립션",
    //   expiryDate: "2024.12.31",
    // },
    useEffect(() => {
      fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
      const response = await axios.get('http://localhost:5000/api/coupons');
      setCoupons(response.data);
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
          <button className="w-1/4 h-10 text-gray-600 hover:bg-gray-200 rounded-md active:text-gray-600">사용가능</button>
          <button className="w-1/4 h-10 text-gray-600 hover:bg-gray-200 rounded-md">기간만료</button>
          <button className="w-1/4 h-10 text-gray-600 hover:bg-gray-200 rounded-md">공유쿠폰</button>
          <button className="w-1/4 h-10 text-gray-600 hover:bg-gray-200 rounded-md">전체쿠폰</button>
        </div>  

        <div className="grid grid-cols-4 gap-4">
          <button className="rounded-full bg-gray-100 hover:bg-gray-200 h-7 w-21 text-gray-600">+</button>
          <button className="rounded-full bg-gray-100 hover:bg-gray-200 h-7 w-21 text-gray-600">금액권</button>
          <button className="rounded-full bg-gray-100 hover:bg-gray-200 h-7 w-21 text-gray-600">카페</button>
          <button className="rounded-full bg-gray-100 hover:bg-gray-200 h-7 w-21 text-gray-600">편의점</button>
          <button className="rounded-full bg-gray-100 hover:bg-gray-200 h-7 w-21 text-gray-600">치킨</button>
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
    </div>
  )
}

export default Home