import { useState } from "react";
import axios from "axios";

const CouponCategory = ({ category, addCategory, handleCategoryClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setInput("");
  };

  const addCategoryFunction = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/category`, {
        name: input,
      });
      closeModal();
      window.location.reload(); // 카테고리 추가 후 새로고침
    } catch (error) {
      alert("카테고리 추가 실패");
      console.error(error);
    }
  };

  const handleCategoryButtonClick = (item) => {
    if (selectedCategory === item) {
      setEditingCategory(item);
      setInput(item.name);
      setIsEditModalOpen(true);
    } else {
      setSelectedCategory(item);
      handleCategoryClick(item);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setInput("");
    setEditingCategory(null);
    setSelectedCategory(null);
    handleCategoryClick(null);
  };

  const editCategoryFunction = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/category/${editingCategory.id}`,
        { name: input }
      );
      alert("카테고리가 수정되었습니다.");
      closeEditModal();
      window.location.reload(); // 수정 후 새로고침
    } catch (error) {
      alert("카테고리 수정 실패");
      console.error(error);
    }
  };

  const deleteCategoryFunction = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/category/${editingCategory.id}`);
      alert("카테고리 삭제 완료");
      closeEditModal();
      window.location.reload(); // 삭제 후 새로고침
    } catch (error) {
      alert("카테고리 삭제 실패");
      console.error(error);
    }
  };

  return (
    <>
      <div className="relative justify-stretch items-center pt-2">
        <button
          onClick={openModal}
          className="rounded-full border hover:bg-gray-200 mr-4 w-16 h-7 text-gray-500 font-bold inline-block"
        >
          +
        </button>
        {category.map((item) => (
          <button
            key={item.id}
            onClick={() => handleCategoryButtonClick(item)}
            className={`rounded-full mr-3 p-3 py-1 mb-2 inline-block 
              ${selectedCategory === item
                ? 'bg-emerald-500 text-white font-medium'
                : 'bg-emerald-100 hover:bg-emerald-500 hover:text-white text-emerald-700'
              }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* 추가 모달 */}
      {isModalOpen && (
        <div className="absolute left-0 mt-2 flex">
          <div className="CategoryAddModal bg-white p-4 rounded-lg shadow-md">
            <input
              type="text"
              placeholder="카테고리 추가"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border p-2 rounded-md"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={addCategoryFunction} className="modal-btn-add bg-green-500 text-white p-2 rounded-md">
                추가
              </button>
              <button onClick={closeModal} className="modal-btn-close bg-gray-400 text-white p-2 rounded-md">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium mb-4">카테고리 수정</h3>
            <input
              type="text"
              placeholder="카테고리 수정"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-between">
              <button onClick={deleteCategoryFunction} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md">
                삭제
              </button>
              <div className="flex gap-4">
                <button onClick={editCategoryFunction} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md">
                  수정
                </button>
                <button onClick={closeEditModal} className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-md">
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CouponCategory;
