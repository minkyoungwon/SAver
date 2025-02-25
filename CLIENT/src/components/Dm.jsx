import { useState, useEffect } from "react";
import axios from "axios";

const DM = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    if (userId && userEmail) {
      setCurrentUser({ id: userId, email: userEmail });
    } else {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL || "ws://localhost:8080");
    setSocket(ws);
  
    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      // 메시지 중복 확인 후 추가
      setMessages((prevMessages) => {
        // 중복 메시지 확인
        const isDuplicate = prevMessages.some(
          (msg) =>
            msg.sender_id === parsedData.senderId &&
            msg.receiver_id === parsedData.receiverId &&
            msg.content === parsedData.content
        );
  
        // 중복이 없다면 추가
        if (isDuplicate) {
          return prevMessages;
        }
        return [...prevMessages, parsedData];
      });
    };
  
    ws.onclose = () => {
      console.log("WebSocket 연결이 종료되었습니다.");
    };
  
    return () => {
      ws.close();
    };
  }, []);
  

  const searchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dm/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSearchTriggered(true);
      setSearchResults(response.data.length > 0 ? response.data : []);
    } catch (error) {
      console.error("검색 오류:", error);
      setSearchTriggered(true);
      setSearchResults([]);
    }
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    setSearchResults([]);
    setSearchQuery("");
    await fetchMessages(user.email);
  };

  const fetchMessages = async (receiverEmail) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dm/${receiverEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("대화 기록 조회 중 오류 발생:", error);
    }
  };
  const sendMessage = async () => {
    if (!selectedUser?.email) return console.error("수신자의 이메일 정보가 없습니다.");
    if (!message.trim()) return console.error("메시지 내용이 비어 있습니다.");
  
    try {
      const token = localStorage.getItem("token");
      const messageData = {
        receiverId: selectedUser.email,
        content: message,
      };
  
      // 소켓으로 메시지를 전송
      if (socket && socket.readyState === WebSocket.OPEN) {
        const wsMessage = {
          senderId: currentUser.email,
          receiverId: selectedUser.email,
          content: message,
        };
        socket.send(JSON.stringify(wsMessage));
      }
  
      // 화면에 바로 반영, 중복 메시지 방지
      setMessages((prevMessages) => {
        // 중복 메시지 확인
        const isDuplicate = prevMessages.some(
          (msg) =>
            msg.sender_id === currentUser.email &&
            msg.receiver_id === selectedUser.email &&
            msg.content === message
        );
  
        // 중복된 메시지라면 업데이트하지 않음
        if (isDuplicate) {
          return prevMessages;
        }
        return [
          ...prevMessages,
          {
            sender_id: currentUser.email,
            receiver_id: selectedUser.email,
            content: message,
            sent_at: "방금",
          },
        ];
      });
    } catch (error) {
      console.error("메시지 전송 중 오류 발생:", error);
    }
  };
  


  return (
    <div>
      {!selectedUser && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">메시지 보내기</h2>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              placeholder="유저 이메일 혹은 아이디 앞부분 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-md"
            />
            <button className="bg-emerald-500 font-semibold text-white py-2 px-3 rounded-md" onClick={searchUser}>
              검색
            </button>
          </div>
          <ul className="mt-4">
            {searchTriggered ? (
              searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div key={user.id} className="mb-2">
                    <li className="text-emerald-700 font-medium">{user.email}님이 확인 되었습니다.</li>
                    <button
                      onClick={() => selectUser(user)}
                      className="bg-emerald-400 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                    >
                      {user.email} 님과 대화하기
                    </button>
                  </div>
                ))
              ) : (
                <li className="text-gray-500 font-medium">검색 결과가 없습니다.</li>
              )
            ) : null}
          </ul>
        </div>
      )}

      {selectedUser && (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
          <h3 className="text-lg font-bold mb-4">{selectedUser.email}님과의 대화 내용</h3>
          <div className="w-full max-w-md bg-white p-4 rounded shadow mb-4 overflow-y-auto h-64">
            {messages.map((msg, idx) => {
              const isCurrentUser = msg.sender_id === currentUser?.email;
              return (
                <div key={idx} className={`${isCurrentUser ? "text-right" : "text-left"} mb-2`}>
                  <p className="p-2 rounded-lg inline-block bg-gray-200">{msg.content}</p>
                  <span className="text-sm text-gray-500 block">
                    {msg.sent_at && msg.sent_at !== "방금"
                      ? new Date(msg.sent_at).toLocaleString()
                      : "방금"}
                  </span>
                </div>
              );
            })}
          </div>
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
      )}
    </div>
  );
};

export default DM;
