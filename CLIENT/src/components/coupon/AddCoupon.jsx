import AddCouponModal from "./AddCouponModal";
import ImageUploader from "./ImageUploader";
import AddCouponInfo from "./AddCouponInfo";
const AddCoupon = ({setIsModalOpen, isModalOpen}) => {
    const floatModal = () => {
        setIsModalOpen(!isModalOpen);
    }
  return (
    <>
    <div className="fixed bottom-10 right-10 z-50">
      <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 border-none font-bold text-2xl cursor-pointer shadow-md flex items-center justify-center"
      onClick={floatModal}>
        +
      </button>
    </div>
    {isModalOpen && <AddCouponInfo setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen}/>}
    </>)
}

export default AddCoupon