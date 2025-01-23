import { useState, useEffect } from "react";
import axios from "axios";

const DM = () => {
  // 사용자 정보는 로컬 스토리지에서 가져와 state로 관리
  const [currentUser, setCurrentUser] = useState(null);

  // 검색 관련
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // 대화 관련
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // 웹소켓 관련
  const [socket, setSocket] = useState(null);

  // 1) 로컬 스토리지에서 로그인 사용자 정보를 꺼내서 currentUser에 저장
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    if (userId && userEmail) {
      setCurrentUser({ id: userId, email: userEmail });
    } else {
      setCurrentUser(null);
    }
  }, []);

  // 2) WebSocket 연결
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); 
    setSocket(ws);

    // 서버로부터 메시지를 받으면 messages 상태에 추가
    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, parsedData]);
    };

    ws.onclose = () => {
      console.log("WebSocket 연결이 종료되었습니다.");
    };

    return () => {
      ws.close();
    };
  }, []);

  // 3) 유저 검색 기능
  const searchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/dm/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSearchTriggered(true);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("검색 오류:", error);
      setSearchTriggered(true);
      setSearchResults([]);
    }
  };

  // 4) 유저 선택 시 대화 기록 불러오기
  const selectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user.email);
  };
  
  const fetchMessages = async (receiverEmail) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/dm/${receiverEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error("대화 기록 조회 중 오류 발생:", error);
    }
  };

  // 5) 메시지 전송
  const sendMessage = async () => {
    if (!selectedUser?.email) {
      console.error("수신자의 이메일 정보가 없습니다.");
      return;
    }
    if (!message) {
      console.error("메시지 내용이 비어 있습니다.");
      return;
    }

    // (1) DB 저장용: axios
    try {
      const token = localStorage.getItem("token");
      const messageData = {
        receiverId: selectedUser.email,
        content: message,
      };
      await axios.post(`/api/dm/send`, messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // (2) 실시간 갱신용: WebSocket도 함께 전송(옵션)
      if (socket && socket.readyState === WebSocket.OPEN) {
        const wsMessage = {
          senderId: currentUser.email,  // DB에서는 sender_id 가 email이므로 통일
          receiverId: selectedUser.email,
          content: message,
        };
        socket.send(JSON.stringify(wsMessage));
      }

      // 프론트 상태 즉시 업데이트
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender_id: currentUser.email,
          receiver_id: selectedUser.email,
          content: message,
          sent_at: "방금",
        },
      ]);
      setMessage("");
    } catch (error) {
      console.error("메시지 전송 중 오류 발생:", error);
    }
  };

  // 6) 화면 렌더링
  return (
    <div>
      {! selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-center items-center gap-4">
          <h2 className="text-2xl font-bold mb-4">메시지 보내기</h2>
          {/* 유저 검색 섹션 */}
          <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="유저 이메일 혹은 아이디 앞부분 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-emerald-500 font-semibold text-white py-2 px-3"
            onClick={searchUser}
          >
            검색
          </button>
        </div>
        <ul>
          {searchTriggered ? (
            Array.isArray(searchResults) && searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div key={user.id}>
                  <li className="text-emerald-700 font-medium">
                    {user.email}님이 확인 되었습니다.
                  </li>
                  <button
                    onClick={() => selectUser(user)}
                    className="bg-emerald-400 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                  >
                    {user.email} 님과 대화하기
                  </button>
                </div>
              ))
            ) : (
              <li className="text-gray-500 font-medium">
                검색하신 결과가 나오지 않습니다.
              </li>
            )
          ) : null}
        </ul>
        </div>
      )}

      {/* 선택된 유저와의 대화 섹션 */}
      {selectedUser && (
        <div>
          <div className="flex flex-col items-center justify-center bg-gray-100">
            <h3 className="text-lg font-bold mb-4">
              {selectedUser.email}님과의 대화 내용
            </h3>

            {/* 메시지 내용 섹션 */}
            <div className="w-full max-w-md bg-white p-4 rounded shadow mb-4 overflow-y-auto h-64">
              {messages.map((msg, idx) => {
                // DB에서 넘어올 때 필드는 sender_id, receiver_id이므로 체크
                const isCurrentUser = msg.sender_id === currentUser?.email;
                return (
                  <div
                    key={idx}
                    className={`${isCurrentUser ? "text-right" : "text-left"} mb-2`}
                  >
                    <p className="p-2 rounded-lg inline-block bg-gray-200">
                      {msg.content}
                    </p>
                    <span className="text-sm text-gray-500 block">
                      {msg.sent_at || "방금"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 텍스트 입력 섹션 */}
            <div className="w-full max-w-md flex items-center">
              <input
                type="text"
                placeholder="메시지를 입력하세요"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-r-lg"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DM;
