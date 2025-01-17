import { Link } from "react-router-dom";
import CouponCard from "../components/CouponCard";
import { useState, useEffect } from "react";
import AddCoupon from "../components/coupon/AddCoupon";
import CouponCategory from "../components/CouponCategory";
import axios from "axios";
import ImageUploader from "../components/coupon/ImageUploader";
import AddCouponInfo from "../components/coupon/AddCouponInfo";
import Footer from "../components/Footer";
function Home({ coupons, setCoupons }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  const [category, setCategory] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImageInfoModalOpen, setIsImageInfoModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const handleImageUpload = (file) => {
    console.log("Home: ImageUploader에서 전달된 파일:", file);
    setSelectedFile(file);
  };

  // 선택한 카테고리 필터링
  const handleCategoryClick = (item) => {
    const filteredCoupons = coupons.filter((coupon) => {
      console.log("coupon.category : ", coupon.category, item);
      if (coupon.category.includes(item.name)) {
        return true;
      }
      return false;
    });
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

  const
    addCategory = async (input) => {
      console.log("addCategory : ", input);
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
        fetchCategories();
      } else {
        alert("카테고리 추가 실패");
      }
    };

  useEffect(() => {
    fetchCoupons();
    fetchCategories();
  }, [setCoupons]);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/coupons`, {
        params: {
          user_id: localStorage.getItem("userId"),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const coupons = response.data.map((coupon) => ({
        name: coupon.name,
        note: coupon.note,
        deadline: coupon.deadline,
        category: coupon.categories,
        status: coupon.status,
        image: coupon.image,
        id: coupon.id,
        usage_location: coupon.usage_location,
        user_id: localStorage.getItem("userId"),
        barcode: coupon.barcode
      }));
      console.log("coupons : ", coupons);
      setCoupons(coupons);
    } catch (error) {
      console.error("쿠폰 조회 오류:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const userId = localStorage.getItem("userId");
      console.log("fetchCategories userId:", userId);

      if (!userId) {
        console.error("userId가 없습니다!");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`, {
        params: {
          user_id: userId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("response.data : ", response.data);
      setCategory(response.data);
    } catch (error) {
      console.error("카테고리 조회 실패:", error);
    }
  };

  // coupons가 변경될 때 filteredCoupons도 업데이트
  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredCoupons(coupons);
    } else {
      const filtered = coupons.filter((coupon) => coupon.status === selectedFilter);
      setFilteredCoupons(filtered);
    }
  }, [coupons, selectedFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="main body flex-grow">

        <div className="hidden md:flex justify-center bg-white">
          <div className="이미지업로더창 w-full mx-[20%] mt-40 mb-52 min-w-[400px]">
            <ImageUploader onImageUpload={handleImageUpload} />
            {selectedFile && (
              <AddCouponInfo
                selectedFile={selectedFile}
                onModalClose={() => {
                  console.log("Home: Modal 닫기");
                  setSelectedFile(null);
                }}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
              />
            )}
          </div>
        </div>
        <div className="content-wrapper ">
          <div className="필터박스 sticky top-[16px] z-20 h-40 pt-2 bg-white">
            <div className="필터탭 flex justify-start space-x-4 sm:space-x-12 mb-6">
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
                    e.target.style.transform = "scale(1)";
                  }}
                  className={`h-10 transition-all duration-300 
                  ${selectedFilter === filter ? "text-emerald-400 font-semibold text-xl scale-100 " : "text-emerald-600 text-lg"}
                  `}
                  style={{
                    transformOrigin: "bottom center", // 아래 중심 기준으로 크기 변경
                  }}
                  onMouseEnter={(e) => {
                    // 호버 시 텍스트 크기와 스타일 변경
                    if (selectedFilter !== filter) {
                      e.target.style.transform = "scale(1)";
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

            <div className="text-sm">
              <CouponCategory category={category} addCategory={addCategory} handleCategoryClick={handleCategoryClick} refreshCategories={fetchCategories} />
            </div>
          </div>

          <div className="mb-32">
            <div className="sticky top-[160px] z-10 flex justify-between text-base text-gray-500 bg-white p-4">
              <p>유효기간순</p>
              <div>
                <span>조회쿠폰 : </span>
                <span className="font-semibold text-black">{filteredCoupons.length}개</span>
              </div>
            </div>
            <div className="쿠폰카드 pb-4 space-y-4 h-screen overflow-auto no-scrollbar">
              {filteredCoupons.length === 0 && <div>쿠폰이 없습니다.</div>}
              {filteredCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon}  />
              ))}
            </div>
          </div>
        </div>
        <AddCoupon setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
