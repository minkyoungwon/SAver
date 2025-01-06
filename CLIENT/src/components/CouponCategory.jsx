import { useState } from "react";
const CouponCategory = ({ category, addCategory, handleCategoryClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState("");
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
  return (
    <>
      <div className="justify-center items-center ">
        <button onClick={() => openModal()} className="rounded-full bg-gray-100 hover:bg-gray-200 mr-4 w-16 h-7 text-gray-600 inline-block">
          +
        </button>
        {category.map((item) => (
          <button onClick={() => handleCategoryClick(item)} className="rounded-full bg-gray-100 hover:bg-gray-200 mr-4 px-3 py-1 mb-2 text-gray-600 inline-block">
            {item}
          </button>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <input type="text" placeholder="카테고리 추가" value={input} onChange={(e) => setInput(e.target.value)} />
            <div className="flex justify-end gap-4">
              <button onClick={() => addCategoryFunction(input)} className="bg-gray-100 hover:bg-gray-200 w-20 h-7 text-gray-600">
                추가
              </button>
              <button onClick={closeModal} className="bg-gray-100 hover:bg-gray-200 w-20 h-7 text-gray-600">
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
