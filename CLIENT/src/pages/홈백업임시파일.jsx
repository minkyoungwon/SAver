import { Link } from "react-router-dom";
import CouponCard from "../components/CouponCard";
import { useState, useEffect } from "react";
import AddCoupon from "../components/coupon/AddCoupon";
import CouponCategory from "../components/CouponCategory";
import axios from "axios";
import AddCouponModal from "../components/coupon/AddCouponModal";
// import CouponDetail from "../components/coupon/CouponDetail";
import ImageUploader from "../components/coupon/ImageUploader";
import AddCouponInfo from "../components/coupon/AddCouponInfo";

function Home({ coupons, setCoupons }) {
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  const [category, setCategory] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  // const [selectedCoupon, setSelectedCoupon] = useState(null); //클릭된 쿠폰 데이터
  // const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 상세 모달 열림 상태
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageUpload = (file) => {
    console.log("Home: ImageUploader에서 전달된 파일:", file);
    setSelectedFile(file);
  };

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
  // const handleCouponClick = (coupon) => {
  //   console.log("Clicked coupon:", coupon); // 클릭한 쿠폰 데이터 확인
  //   if (window.innerWidth >= 768) {
  //     // md 이상: 4section에 출력
  //     setSelectedCoupon(coupon);
  //     setIsDetailModalOpen(false);
  //   } else {
  //     // md 이하: 모달로 표시
  //     setSelectedCoupon(coupon);
  //     setIsDetailModalOpen(true);
  //   }
  // };

  // useEffect(() => {
  //   console.log("Selected Coupon updated:", selectedCoupon); // 클릭된 쿠폰 상태 업데이트 확인
  // }, [selectedCoupon]);

  // 모달창 열려있을때 브라우저 크기 감지
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth >= 768 && isDetailModalOpen) {
  //       // md 이상으로 전환되면 모달을 닫고 섹션에 출력
  //       setIsDetailModalOpen(false);
  //     } else if (window.innerWidth < 768 && selectedCoupon) {
  //       // md 이하로 전환되면 섹션에 출력 중인 것을 모달로 전환
  //       setIsDetailModalOpen(true);
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [isDetailModalOpen, selectedCoupon]);

  // function ButtonComponent() {
  // const [activeButton, setActiveButton] = useState(null);

  // const handleButtonClick = (index) => {
  //   setActiveButton(index);
  // };

  return (
    <div>
      <div className="body">
        <div className="flex justify-center bg-white">
          <div className="이미지업로더창 w-full mx-[20%] mt-40 mb-52 min-w-[400px]">
            <ImageUploader onImageUpload={handleImageUpload} />
            {selectedFile && (
              <AddCouponInfo
                selectedFile={selectedFile}
                onModalClose={() => {
                  console.log("Home: Modal 닫기");
                  setSelectedFile(null);
                }}
              />
            )}
          </div>
        </div>
        <div className="content-wrapper">
          <div className="필터박스 h-40 mb-8 bg-white">
            <div className="필터탭 flex justify-start space-x-12 mb-6">
              {[
                { label: "사용가능", filter: "available" },
                { label: "기간만료", filter: "expired" },
                { label: "공유쿠폰", filter: "shared" },
                { label: "전체쿠폰", filter: "all" },
              ].map(({ label, filter }) => (
                <button
                  key={filter}
                  onClick={(e) => {
                    // 모든 버튼의 크기를 초기화
                    document.querySelectorAll(".필터탭 button").forEach((btn) => {
                      btn.style.transform = "scale(1)";
                    });

                    // 현재 클릭된 버튼의 필터 설정 및 스타일 적용
                    showFilteredCoupons(filter);
                    e.target.style.transform = "scale(1.1)";
                  }}
                  className={`h-10 transition-all duration-300 
                  ${selectedFilter === filter ? "text-emerald-400 font-bold text-2xl scale-110 " : "text-emerald-600 text-lg"}
                  `}
                  style={{
                    transformOrigin: "bottom center", // 아래 중심 기준으로 크기 변경
                  }}
                  onMouseEnter={(e) => {
                    // 호버 시 텍스트 크기와 스타일 변경
                    if (selectedFilter !== filter) {
                      e.target.style.transform = "scale(1.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    // 호버 해제 시 원래 상태로 복구 (클릭된 상태는 유지)
                    if (selectedFilter !== filter) {
                      e.target.style.transform = "scale(1)";
                    }
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="text-sm ">
              <CouponCategory category={category} addCategory={addCategory} handleCategoryClick={handleCategoryClick} refreshCategories={fetchCategories} />
            </div>
          </div>

          {/* <div className=" 필터박스 h-40 mb-16">
            <div className=" 필터탭 flex justify-start space-x-12 mb-4 ">
              <button
                onClick={() => showFilteredCoupons("available")}
                className={` h-10 bg-gray-100 
              ${selectedFilter === "available" ? " text-emerald-400 font-bold text-2xl" : " text-emerald-600 text-lg hover:"}`}
              >
                사용가능
              </button>
              <button
                onClick={() => showFilteredCoupons("expired")}
                className={` h-10 bg-gray-100 
              ${selectedFilter === "expired" ? " text-emerald-400 font-bold text-2xl" : "  text-emerald-600 text-lg hover:"}`}
              >
                기간만료
              </button>
              <button
                onClick={() => showFilteredCoupons("shared")}
                className={` h-10  bg-gray-100 
              ${selectedFilter === "shared" ? " text-emerald-400 font-bold text-2xl" : "  text-emerald-600 text-lg hover:"}`}
              >
                공유쿠폰
              </button>
              <button
                onClick={() => showFilteredCoupons("all")}
                className={`  h-10  bg-gray-100 
              ${selectedFilter === "all" ? " text-emerald-400 font-bold text-2xl" : "  text-emerald-600 text-lg hover:"}`}
              >
                전체쿠폰
              </button>
            </div>

            <div className="text-sm">
              <CouponCategory category={category} addCategory={addCategory} handleCategoryClick={handleCategoryClick} refreshCategories={fetchCategories} />
            </div>
          </div> */}

          <div className=" mb-32">
            <div className="flex justify-between text-base mb-4 text-gray-500 ">
              <p className="">유효기간순</p>
              <div>
                <span>조회쿠폰 : </span>
                <span className="font-semibold text-black">{filteredCoupons.length}개</span>
              </div>
            </div>
            <div className="쿠폰카드 space-y-4 h-screen overflow-auto no-scrollbar ">
              {filteredCoupons.length === 0 && <div>쿠폰이 없습니다.</div>}
              {filteredCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </div>

          {/* md 이상 : 4section */}
          {/* <div className="4section hidden md:block bg-slate-100">{selectedCoupon && <CouponDetail setIsDetailModalOpen={setIsDetailModalOpen} setSelectedCoupon={setSelectedCoupon} coupon={selectedCoupon} isMdView={true} />}</div> */}
        </div>
        <AddCoupon />
      </div>

      {/* 모바일 모달 */}
      {/* {isDetailModalOpen && <CouponDetail setIsDetailModalOpen={setIsDetailModalOpen} setSelectedCoupon={setSelectedCoupon} coupon={selectedCoupon} />} */}
    </div>
  );
}

export default Home;
