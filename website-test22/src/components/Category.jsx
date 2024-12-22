const categories = [
    { name: "전체보기", icon: "⬜" },
    { name: "이사/청소", icon: "🚚" },
    { name: "설치/수리", icon: "🔧" },
    { name: "인테리어", icon: "🛋️" },
    { name: "외주", icon: "💼" },
    { name: "이벤트/뷰티", icon: "📅" },
    { name: "취업/직무", icon: "📚" },
    { name: "과외", icon: "🎓" },
    { name: "취미/자기계발", icon: "🎨" },
    { name: "자동차", icon: "🚗" },
    { name: "법률/금융", icon: "⚖️" },
    { name: "기타", icon: "👔" },
];

function Category() {
    return (
        <div className="p-4 bg-white grid grid-cols-4 gap-4">
            {categories.map((category) => (
                <div
                    key={category.name}
                    className="flex flex-col items-center text-center"
                >
                    <div className="text-2xl">{category.icon}</div>
                    <span className="text-sm text-gray-600">
                        {category.name}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default Category;
