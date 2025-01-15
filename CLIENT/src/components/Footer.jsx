// import { useLocation } from "react-router-dom";

const Footer = () => {
  // const location = useLocation();

  return (
    <footer className="flex grid-flow-col text-xs space-x-10 px-[15%] py-2 bg-gray-50 text-emerald-600"> 
     <div className="flex text-lg font-bold justify-end items-start text-emerald-600">Saver</div>     
     <div className="flex w-full justify-end items-end">
        <p>{new Date().getFullYear()} &copy; Saver-All rights reserved.</p>
     </div>
       

    </footer>
  );
};

export default Footer;

    {/* <div className="flex w-full space-x-2 items-center">
        <h4>
           <a href="https://github.com/LimJ2023">임요한</a>
        </h4>
        <h4>
           <a href="https://github.com/dohyounLee">이도윤</a>
        </h4>
        <h4>
           <a href="https://github.com/hyemi11">최혜미</a>
        </h4>
        <h4>
           <a href="https://github.com/minkyoungwon">민경원</a>
        </h4>
      </div> */}