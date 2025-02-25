import { Link } from "react-router-dom";
import CouponCard from "../components/CouponCard";
import { useState, useEffect } from "react";
import CouponAdd from "../components/coupon/CouponAdd";
import CouponCategory from "../components/CouponCategory";
import axios from "axios";
import ImageUploader from "../components/coupon/ImageUploader";
import AddCouponInfo from "../components/coupon/AddCouponInfo";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import ImageUploaderModal from "../components/coupon/ImageUploaderModal";

function Home({ coupons, setCoupons }) {
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  const [category, setCategory] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImageInfoModalOpen, setIsImageInfoModalOpen] = useState(false);

  const handleImageUpload = (file) => {
    setSelectedFile(file);
  };

  // 선택한 카테고리 필터링
  const handleCategoryClick = (item) => {
    setFilteredCoupons(coupons.filter((coupon) => coupon.category.includes(item.name)));
  };

  const showFilteredCoupons = (filter) => {
    setSelectedFilter(filter);
    setFilteredCoupons(filter === "all" ? coupons : coupons.filter((coupon) => coupon.status === filter));
  };

  const addCategory = async (input) => {
    if (!input.trim()) {
      Swal.fire({ title: "카테고리 입력 실패", text: "카테고리를 입력해주세요.", icon: "error" });
      return;
    }

    if (category.some((cat) => cat.name === input.trim())) {
      Swal.fire({ title: "카테고리 중복", text: "이미 존재하는 카테고리입니다.", icon: "error" });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/category`,
        { name: input, user_id: localStorage.getItem("userId") },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      Swal.fire({ title: "카테고리 추가 완료", icon: "success" });
      fetchCategories();
    } catch (error) {
      Swal.fire({ title: "카테고리 추가 실패", text: "카테고리 추가에 실패했습니다.", icon: "error" });
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchCategories();
  }, [setCoupons]);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/coupons`, {
        params: { user_id: localStorage.getItem("userId") },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const sortedCoupons = response.data
        .map((coupon) => ({
          ...coupon,
          user_id: localStorage.getItem("userId"),
        }))
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

      setCoupons(sortedCoupons);
      setFilteredCoupons(sortedCoupons);
    } catch (error) {
      console.error("쿠폰 조회 오류:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`, {
        params: { user_id: userId },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCategory(response.data);
    } catch (error) {
      console.error("카테고리 조회 실패:", error);
    }
  };

  useEffect(() => {
    setFilteredCoupons(selectedFilter === "all" ? coupons : coupons.filter((coupon) => coupon.status === selectedFilter));
  }, [coupons, selectedFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="main body flex-grow">
        {/* 이미지 업로더 */}
        <div className="hidden md:flex justify-center bg-neutral-100 shadow-md">
          <div className="w-full mx-[30%] mt-[30px] mb-[22px] min-w-[400px] space-y-4">
            <p className="text-3xl text-center text-gray-600 font-extrabold">
              쿠폰을 구하다 <span className="text-gray-600">세이버</span>
            </p>
            <ImageUploader onImageUpload={handleImageUpload} />
            {selectedFile && <AddCouponInfo selectedFile={selectedFile} />}
          </div>
        </div>

        {/* 필터 및 카테고리 선택 */}
        <div className="sticky top-[8px] z-20 pb-2 bg-white">
          <div className="flex justify-center space-x-10 my-2">
            {["available", "used", "expired", "all"].map((filter) => (
              <button
                key={filter}
                onClick={() => showFilteredCoupons(filter)}
                className={`h-10 transition ${
                  selectedFilter === filter ? "text-emerald-400 font-semibold text-xl" : "text-emerald-600 text-lg"
                }`}
              >
                {filter === "available" ? "사용가능" : filter === "used" ? "사용완료" : filter === "expired" ? "기간만료" : "전체쿠폰"}
              </button>
            ))}
          </div>
          <CouponCategory category={category} addCategory={addCategory} handleCategoryClick={handleCategoryClick} refreshCategories={fetchCategories} />
        </div>

        {/* 쿠폰 목록 */}
        <div className="mb-4">
          <div className="sticky top-[120px] md:top-[100px] z-10 flex justify-between text-base text-gray-500 bg-white py-4">
            <p>유효기간순</p>
            <div>
              <span>조회쿠폰 : </span>
              <span className="font-semibold text-black">{filteredCoupons.length}개</span>
            </div>
          </div>
          <div className="pb-4 space-y-4 h-screen overflow-auto no-scrollbar">
            {filteredCoupons.length === 0 ? (
              <div className="text-center text-gray-500">쿠폰이 없습니다.</div>
            ) : (
              filteredCoupons.map((coupon) => <CouponCard key={coupon.id} coupon={coupon} />)
            )}
          </div>
        </div>
      </div>

      {/* 모바일 쿠폰 추가 버튼 */}
      <div className="md:hidden">
        <button onClick={() => setIsImageInfoModalOpen(true)} className="fixed bottom-20 right-4 w-14 h-14 bg-emerald-500 rounded-full shadow-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        {isImageInfoModalOpen && <ImageUploaderModal onClose={() => setIsImageInfoModalOpen(false)} onImageUpload={handleImageUpload} />}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
