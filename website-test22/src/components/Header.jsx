function Header() {
    return (
        <div className="flex items-center justify-between p-4 bg-white shadow-md">
            <h1 className="text-teal-700 font-bold text-xl">재능교환</h1>
            <div className="flex items-center space-x-4">
                <button className="text-gray-500">🔔</button>
                <button className="text-gray-500">👤</button>
                <button className="text-teal-500 border rounded px-2 py-1">
                    내 재능
                </button>
                <button className="text-red-400 border rounded px-2 py-1">
                    자동 매칭
                </button>
            </div>
        </div>
    );
}

export default Header;
