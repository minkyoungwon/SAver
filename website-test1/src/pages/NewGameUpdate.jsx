const NewGameUpdate = () => {
    return (
        <div>
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">게임 업데이트 소식</h1>

                <div className="space-y-8">
                    {/* 페이트/그랜드 오더 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold mb-4">
                                페이트/그랜드 오더 (Fate/Grand Order)
                            </h2>
                            <div className="flex gap-2">
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    업데이트
                                </span>
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                    행사
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src="/images/fgo.jpg"
                                alt="페이트/그랜드 오더"
                                className="w-full md:w-64 h-48 object-cover rounded-lg"
                            />
                            <div>
                                <p className="text-gray-700 mb-4">
                                    넷마블은 '페이트/그랜드 오더'의 7주년을
                                    기념하여 다양한 이벤트를 준비했습니다. 특히,
                                    12월 7일과 8일에 일산 킨텍스에서 열린 'AGF
                                    2024' 행사에서 메인 시나리오 2부 7장을
                                    테마로 한 부스를 운영하였으며, 성우 타나카
                                    미나미(니토크리스 역), 아카바네 켄지(카독
                                    젬루푸스 역)와 개발 디렉터 카노 요시키가
                                    참석하여 팬들과 소통했습니다.
                                </p>
                                <span className="text-sm text-gray-500">
                                    출처: ETNEWS
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 에픽세븐 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold mb-4">
                                에픽세븐 (Epic Seven)
                            </h2>
                            <div className="flex gap-2">
                                <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                    굿즈
                                </span>
                                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                    이벤트
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src="/images/epic7.jpg"
                                alt="에픽세븐"
                                className="w-full md:w-64 h-48 object-cover rounded-lg"
                            />
                            <div>
                                <p className="text-gray-700 mb-4">
                                    스마일게이트는 'AGF 2024'에서 '에픽세븐'의
                                    부스를 운영하며 다양한 이벤트와 한정 굿즈를
                                    선보였습니다. 특히, 어린 셰나와 알렌시아의
                                    일러스트를 담은 '프리미엄 오르골 패키지'를
                                    500개 한정으로 예약 판매하였습니다.
                                </p>
                                <span className="text-sm text-gray-500">
                                    출처: ETNEWS
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 아우터플레인 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            아우터플레인 (Outerplane)
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src="/images/outerplane.jpg"
                                alt="아우터플레인"
                                className="w-full md:w-64 h-48 object-cover rounded-lg"
                            />
                            <div>
                                <p className="text-gray-700 mb-4">
                                    스마일게이트는 'AGF 2024'에서
                                    '아우터플레인'의 부스를 운영하며 다양한
                                    이벤트와 한정 굿즈를 선보였습니다.
                                </p>
                                <span className="text-sm text-gray-500">
                                    출처: ETNEWS
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 브라운더스트2 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            브라운더스트2 (Brown Dust 2)
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src="/images/browndust2.jpg"
                                alt="브라운더스트2"
                                className="w-full md:w-64 h-48 object-cover rounded-lg"
                            />
                            <div>
                                <p className="text-gray-700 mb-4">
                                    네오위즈는 12월에 1.5주년을 맞이하는
                                    '브라운더스트2'의 업데이트를 준비 중입니다.
                                    'AGF 2024' 행사에서 부스를 운영하며 다양한
                                    이벤트를 진행하였습니다.
                                </p>
                                <span className="text-sm text-gray-500">
                                    출처: ETNEWS
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 테르비스 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            테르비스 (Tervys)
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src="/images/tervys.jpg"
                                alt="테르비스"
                                className="w-full md:w-64 h-48 object-cover rounded-lg"
                            />
                            <div>
                                <p className="text-gray-700 mb-4">
                                    웹젠은 신작 '테르비스'를 'AGF 2024'에서
                                    공개하며, 출시 전 이용자들의 관심을
                                    모았습니다.
                                </p>
                                <span className="text-sm text-gray-500">
                                    출처: ETNEWS
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 나 혼자만 레벨업: 어라이즈 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            나 혼자만 레벨업: 어라이즈 (Solo Leveling: Arise)
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src="/images/sololeveling.jpg"
                                alt="나 혼자만 레벨업: 어라이즈"
                                className="w-full md:w-64 h-48 object-cover rounded-lg"
                            />
                            <div>
                                <p className="text-gray-700 mb-4">
                                    넷마블은 '나 혼자만 레벨업: 어라이즈'의
                                    출시를 준비 중이며, 'AGF 2024'에서 관련
                                    정보를 공개하였습니다.
                                </p>
                                <span className="text-sm text-gray-500">
                                    출처: ETNEWS
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 신의 탑 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            신의 탑: 새로운 세계 (Tower of God: New World)
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src="/images/towerofgod.jpg"
                                alt="신의 탑: 새로운 세계"
                                className="w-full md:w-64 h-48 object-cover rounded-lg"
                            />
                            <div>
                                <p className="text-gray-700 mb-4">
                                    넷마블은 '신의 탑: 새로운 세계'의 출시를
                                    준비 중이며, 'AGF 2024'에서 관련 정보를
                                    공개하였습니다.
                                </p>
                                <span className="text-sm text-gray-500">
                                    출처: ETNEWS
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewGameUpdate;
