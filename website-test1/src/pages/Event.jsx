const Event = () => {
    return (
        <div>
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">진행중인 이벤트</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 이벤트 카드 1 */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                        <img
                            src="/images/event1.jpg"
                            alt="이벤트 1"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">
                                신규 회원 특별 이벤트
                            </h2>
                            <p className="text-gray-600 mb-2">
                                2024.01.01 ~ 2024.12.31
                            </p>
                            <p className="text-gray-700">
                                신규 가입 시 특별 쿠폰 증정!
                            </p>
                        </div>
                    </div>

                    {/* 이벤트 카드 2 */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                        <img
                            src="/images/event2.jpg"
                            alt="이벤트 2"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">
                                겨울 시즌 특별 이벤트
                            </h2>
                            <p className="text-gray-600 mb-2">
                                2024.01.15 ~ 2024.02.15
                            </p>
                            <p className="text-gray-700">겨울 상품 20% 할인!</p>
                        </div>
                    </div>

                    {/* 이벤트 카드 3 */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                        <img
                            src="/images/event3.jpg"
                            alt="이벤트 3"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">
                                출석체크 이벤트
                            </h2>
                            <p className="text-gray-600 mb-2">
                                2024.01.01 ~ 2024.12.31
                            </p>
                            <p className="text-gray-700">
                                매일 출석하고 포인트 받자!
                            </p>
                        </div>
                    </div>

                    {/* 이벤트 카드 4 */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                        <img
                            src="/images/event4.jpg"
                            alt="이벤트 4"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">
                                친구 초대 이벤트
                            </h2>
                            <p className="text-gray-600 mb-2">
                                2024.01.01 ~ 2024.12.31
                            </p>
                            <p className="text-gray-700">
                                친구 초대하고 특별 혜택 받기!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Event;
