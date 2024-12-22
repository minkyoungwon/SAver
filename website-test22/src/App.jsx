// App.js
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Category from "./components/Category";
import PopularService from "./components/PopularService";

function App() {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <SearchBar />
            <Category />
            <PopularService />
        </div>
    );
}

export default App;
