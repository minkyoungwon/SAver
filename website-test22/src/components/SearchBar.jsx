// components/SearchBar.js

function SearchBar() {
    return (
        <div className="p-4 bg-gray-100">
            <input
                type="text"
                placeholder="어떤 서비스가 필요하세요?"
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-teal-500"
            />
        </div>
    );
}

export default SearchBar;
