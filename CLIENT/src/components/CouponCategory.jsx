
const CouponCategory = ({category, handleCategoryClick}) => {

  return (
    <div>
        <button onClick={() => handleCategoryClick("all")} className="rounded-full bg-gray-100 hover:bg-gray-200 h-7 w-21 text-gray-600">+</button>
        {category.map((item) => (
            <button onClick={handleCategoryClick(item)} className="rounded-full bg-gray-100 hover:bg-gray-200 h-7 w-21 text-gray-600">{item}</button>
        ))}
    </div>
  )
}

export default CouponCategory