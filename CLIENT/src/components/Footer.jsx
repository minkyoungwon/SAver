import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  return (
    <footer className=" bg-gray-800 text-white text-center py-4 mt-8">
      <p>&copy; {new Date().getFullYear()} My Board App. All rights reserved.</p>
      <h4>
        {" "}
        임요한 <a href="https://github.com/LimJ2023"> Github </a>
      </h4>
      <h4>
        {" "}
        이도윤 <a href="https://github.com/dohyounLee"> giThub </a>
      </h4>
      <h4>
        {" "}
        최혜미 <a href="https://github.com/hyemi11"> gitHub </a>
      </h4>
      <h4>
        {" "}
        민경원 <a href="https://github.com/minkyoungwon"> GithUB </a>
      </h4>
    </footer>
  );
};

export default Footer;
