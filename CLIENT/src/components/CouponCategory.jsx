import { useState } from "react";
import axios from "axios";

const CouponCategory = ({ category, addCategory, handleCategoryClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInput("");
  };

  const addCategoryFunction = () => {
    addCategory(input);
    closeModal();
    setInput("");
  };

  const handleCategoryButtonClick = (item) => {
    if (selectedCategory === item) {
      // 이미 선택된 카테고리를 다시 클릭하면 수정 모달 열기
      setEditingCategory(item);
      setInput(item.name);
      setIsEditModalOpen(true);
    } else {
      // 새로운 카테고리 선택 시 필터링
      setSelectedCategory(item);
      handleCategoryClick(item);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setInput("");
    setEditingCategory(null);
    setSelectedCategory(null); // 선택 해제
    handleCategoryClick(null); // 필터 초기화 (Home 컴포넌트에서 처리 필요)
  };

  const editCategoryFunction = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/category/${editingCategory.id}`,
        { name: input },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        alert("카테고리가 수정되었습니다.");
        closeEditModal();
      }
    } catch (error) {
      alert("카테고리 수정에 실패했습니다.");
      console.error(error);
    }
  };
  const deleteCategoryFunction = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/category/${editingCategory.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if(response.status === 200) {
        alert("카테고리 삭제 완료");
        closeEditModal();
      }
    } catch (error) {
      alert("카테고리 삭제 실패");
      console.error(error);
    }
  }
  return (
    <>
      <div className="justify-center items-center">
        <button 
          onClick={() => openModal()} 
          className="rounded-full bg-gray-100 hover:bg-gray-200 mr-4 w-16 h-7 text-gray-600 inline-block"
        >
          +
        </button>
        {category.map((item) => (
          <button 
            key={item.id} 
            onClick={() => handleCategoryButtonClick(item)} 
            className={`rounded-full mr-4 px-3 py-1 mb-2 inline-block
              ${selectedCategory === item 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* 추가 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 top-0 flex items-center justify-center">
          <div className="bg-gray-100 p-6 rounded-lg">
            <input 
              type="text" 
              placeholder="카테고리 추가" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              className="border p-2 rounded"
            />
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={addCategoryFunction} className="bg-gray-100 hover:bg-gray-200 w-20 h-7 text-gray-600">
                추가
              </button>
              <button onClick={closeModal} className="bg-gray-100 hover:bg-gray-200 w-20 h-7 text-gray-600">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">카테고리 수정</h3>
            <input 
              type="text" 
              placeholder="카테고리 수정" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              className="border p-2 rounded w-full mb-4"
            />
            <button onClick={deleteCategoryFunction} className="bg-gray-100 hover:bg-gray-200 w-20 h-7 text-gray-600">
              삭제
            </button>
            <div className="flex justify-end gap-4">
              <button onClick={editCategoryFunction} className="bg-gray-100 hover:bg-gray-200 w-20 h-7 text-gray-600">
                수정
              </button>
              <button onClick={closeEditModal} className="bg-gray-100 hover:bg-gray-200 w-20 h-7 text-gray-600">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CouponCategory;
