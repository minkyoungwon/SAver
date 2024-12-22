import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Header from "./pages/Header";
import NewGameUpdate from "./pages/NewGameUpdate";
import { AuthProvider } from "./context/AuthProvider";
import Board from "./pages/Board";
import Event from "./pages/Event";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/update-news" element={<NewGameUpdate />} />
                    <Route
                        path="/board"
                        element={
                            <Board
                                posts={[
                                    {
                                        id: 1,
                                        title: "게시판 이용 안내",
                                        author: "관리자",
                                        date: "2024-03-20",
                                        views: 245,
                                    },
                                    {
                                        id: 2,
                                        title: "젤다의 전설 신작 소식",
                                        author: "게임매니아",
                                        date: "2024-03-19",
                                        views: 152,
                                    },
                                    {
                                        id: 3,
                                        title: "이번 달 신작 게임 추천",
                                        author: "게임러버",
                                        date: "2024-03-18",
                                        views: 98,
                                    },
                                    {
                                        id: 4,
                                        title: "게임 할인 정보 공유",
                                        author: "세일러",
                                        date: "2024-03-17",
                                        views: 324,
                                    },
                                    {
                                        id: 5,
                                        title: "게임 패치 소식",
                                        author: "뉴스봇",
                                        date: "2024-03-16",
                                        views: 167,
                                    },
                                ]}
                                user={null}
                            />
                        }
                    />
                    <Route path="/event" element={<Event />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
