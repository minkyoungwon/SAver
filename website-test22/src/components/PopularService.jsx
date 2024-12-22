const popularServices = [
    {
        name: "피아노/키보드 레슨",
        providers: "1,200명 보유",
        requests: "41,473명 요청",
        image: "piano.jpg",
    },
    {
        name: "골프 레슨",
        providers: "300명 보유",
        requests: "36,000명 요청",
        image: "golf.jpg",
    },
    {
        name: "영어 회화 레슨",
        providers: "1,000명 보유",
        requests: "20,000명 요청",
        image: "english.jpg",
    },
];

function PopularService() {
    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">인기 서비스</h2>
            <div className="grid grid-cols-2 gap-4">
                {popularServices.map((service) => (
                    <div
                        key={service.name}
                        className="bg-white shadow-md rounded-md overflow-hidden"
                    >
                        <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-md font-bold">
                                {service.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {service.providers}
                            </p>
                            <p className="text-sm text-gray-500">
                                {service.requests}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PopularService;
