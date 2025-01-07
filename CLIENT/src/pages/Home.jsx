import { Link } from "react-router-dom";
import CouponCard from "../components/CouponCard";
import { useState, useEffect } from "react";
import AddCoupon from "../components/coupon/AddCoupon";
import CouponCategory from "../components/CouponCategory";
import axios from "axios";
import AddCouponModal from "../components/coupon/AddCouponModal";
import CouponDetail from "../components/coupon/CouponDetail";
function Home({ coupons, setCoupons }) {
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  const [category, setCategory] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedCoupon, setSelectedCoupon] = useState(null); //클릭된 쿠폰 데이터
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 모달 열림 상태

  // 선택한 카테고리 필터링
  const handleCategoryClick = (item) => {
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

  const addCategory = async (input) => {
    if (input === "") {
      alert("카테고리를 입력해주세요.");
      return;
    }

    const isCategoryExist = category.includes(input);
    if (isCategoryExist) {
      alert("이미 존재하는 카테고리입니다.");
      return;
    }
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/category`,
      {
        name: input,
        user_id: localStorage.getItem("userId"),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 200) {
      alert("카테고리 추가 완료");
    } else {
      alert("카테고리 추가 실패");
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchCategory();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/coupon`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCoupons(response.data);
    } catch (error) {
      console.error("쿠폰 조회 오류:", error);
    }
  };
  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategory(response.data);
    } catch (error) {
      console.error("카테고리 조회 오류:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategory(response.data);
    } catch (error) {
      console.error("카테고리 조회 실패:", error);
    }
  };

  // 클릭한 쿠폰정보 담아두기
  const handleCouponClick = (coupon) => {
    console.log("Clicked coupon:", coupon); // 클릭한 쿠폰 데이터 확인
    if (window.innerWidth >= 640) {
      // sm 이상: 4section에 출력
      setSelectedCoupon(coupon);
      setIsDetailModalOpen(false);
    } else {
      // sm 이하: 모달로 표시
      setSelectedCoupon(coupon);
      setIsDetailModalOpen(true);
    }
  };

  useEffect(() => {
    console.log("Selected Coupon updated:", selectedCoupon); // 클릭된 쿠폰 상태 업데이트 확인
  }, [selectedCoupon]);

  // 모달창 열려있을때 브라우저 크기 감지
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isDetailModalOpen) {
        // sm 이상으로 전환되면 모달을 닫고 섹션에 출력
        setIsDetailModalOpen(false);
      } else if (window.innerWidth < 640 && selectedCoupon) {
        // sm 이하로 전환되면 섹션에 출력 중인 것을 모달로 전환
        setIsDetailModalOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isDetailModalOpen, selectedCoupon]);

  return (
    <div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr]">
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
              <CouponCategory category={category} addCategory={addCategory} handleCategoryClick={handleCategoryClick} refreshCategories={fetchCategories} />
            </div>
          </div>
          <div className="2 bg-white border-white rounded-lg shadow-md mb-6 p-4 mr-4">
            <div>222</div>
          </div>

          <div className="3section bg-slate-100 mr-4">
            <p className=" mb-1 text-sm">유효기간순</p>
            <div className=" space-y-4 h-screen overflow-auto no-scrollbar ">
              {coupons.length === 0 && <div>쿠폰이 없습니다.</div>}
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} handleCouponClick={handleCouponClick} />
              ))}
            </div>
          </div>
          {/* sm 이상 : 4section */}
          <div className="4section hidden sm:block bg-slate-100 pt-6 mr-4">{selectedCoupon && <CouponDetail setIsDetailModalOpen={setIsDetailModalOpen} setSelectedCoupon={setSelectedCoupon} coupon={selectedCoupon} isSmView={true} />}</div>
        </div>
        <AddCoupon />
      </div>

      {/* 모바일 모달 */}
      {isDetailModalOpen && <CouponDetail setIsDetailModalOpen={setIsDetailModalOpen} setSelectedCoupon={setSelectedCoupon} coupon={selectedCoupon} isSmView={false} />}
    </div>
  );
}

export default Home;
