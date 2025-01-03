import { Link } from 'react-router-dom';

const Intro = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            모든 쿠폰을 한눈에
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            다양한 브랜드의 쿠폰을 쉽고 빠르게 모아보세요
          </p>
          <Link
            to="/login"
            className="bg-gray-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition duration-300"
          >
            시작하기
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-blue-600 text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">할인 혜택 모아보기</h3>
            <p className="text-gray-600">
              다양한 브랜드의 할인 쿠폰을 한 곳에서 확인하세요
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-blue-600 text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">쿠폰 공유</h3>
            <p className="text-gray-600">
              내 쿠폰을 다른 사용자에게 공유해보세요
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-blue-600 text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">간편한 사용</h3>
            <p className="text-gray-600">
              클릭 한 번으로 쿠폰을 저장하고 사용하세요
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#74C79E] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 시작하세요!
          </h2>
          <p className="text-xl mb-8">
            매일 업데이트되는 다양한 쿠폰을 놓치지 마세요
          </p>
          <Link
            to="/signup"
            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300"
          >
            무료로 가입하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Intro;
