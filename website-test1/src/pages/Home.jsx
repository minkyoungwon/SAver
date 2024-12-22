const Home = () => {
    const latestNews = [
        {
            id: 1,
            title: "젤다의 전설: 왕국의 눈물 DLC",
            category: "Nintendo",
            date: "2024-03-20",
            thumbnail: "/images/news1.jpg",
        },
        {
            id: 2,
            title: "GTA 6 새로운 트레일러 공개",
            category: "PC/Console",
            date: "2024-03-19",
            thumbnail: "/images/news2.jpg",
        },
        // 더미 데이터입니다. 실제 데이터로 교체해주세요
    ];

    const popularGames = [
        {
            id: 1,
            title: "발더스 게이트 3",
            rating: 4.9,
            thumbnail: "/images/game1.jpg",
        },
        {
            id: 2,
            title: "사이버펑크 2077",
            rating: 4.5,
            thumbnail: "/images/game2.jpg",
        },
        // 더미 데이터입니다
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 히어로 섹션 */}
            <section className="mb-12">
                <div className="bg-gray-800 rounded-lg p-8 text-white">
                    <h1 className="text-4xl font-bold mb-4">최신 게임 뉴스</h1>
                    <p className="text-xl">최신 소식을 만나보세요</p>
                </div>
            </section>

            {/* 최신 뉴스 섹션 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">최신 게임 뉴스</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestNews.map((news) => (
                        <div
                            key={news.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <img
                                src={news.thumbnail}
                                alt={news.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <span className="text-sm text-blue-600">
                                    {news.category}
                                </span>
                                <h3 className="text-xl font-semibold mt-2">
                                    {news.title}
                                </h3>
                                <p className="text-gray-500 text-sm mt-2">
                                    {news.date}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 인기 게임 섹션 */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">인기 게임</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {popularGames.map((game) => (
                        <div
                            key={game.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <img
                                src={game.thumbnail}
                                alt={game.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">
                                    {game.title}
                                </h3>
                                <div className="flex items-center mt-2">
                                    <span className="text-yellow-500">★</span>
                                    <span className="ml-1">{game.rating}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 뉴스레터 구독 섹션 */}
            <section className="bg-gray-100 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">뉴스레터 구독</h2>
                <p className="mb-4">최신 게임 소식을 이메일로 받아보세요!</p>
                <div className="flex gap-4">
                    <input
                        type="email"
                        placeholder="이메일을 입력하세요"
                        className="flex-1 p-2 rounded-lg border border-gray-300"
                    />
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        구독하기
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
