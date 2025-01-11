import { useState, useEffect } from "react";
import axios from "axios";

const DM = () => {
  // 사용자 정보는 로컬 스토리지에서 가져와 state로 관리
  const [currentUser, setCurrentUser] = useState(null);

  // 검색 관련
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // 대화 관련
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // 웹소켓 관련
  const [socket, setSocket] = useState(null);

  // ---------------------------
  // 1) 로컬 스토리지에서 로그인 사용자 정보를 꺼내서 currentUser에 저장
  // ---------------------------
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");

    if (userId && userEmail) {
      setCurrentUser({ id: userId, email: userEmail });
    } else {
      setCurrentUser(null);
    }
  }, []);

  // ---------------------------
  // 2) WebSocket 연결
  // ---------------------------
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

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

  // ---------------------------
  // 3) 유저 검색 기능
  // ---------------------------
  const searchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/dm/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(response.data)) {
        setSearchResults(response.data);
      } else {
        console.error("Unexpected API response 형식:", response.data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("검색 오류:", error);
      setSearchResults([]);
    }
  };

  // ---------------------------
  // 4) 유저 선택 시 대화 기록 불러오기
  // ---------------------------
  const selectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user.id);
  };

  const fetchMessages = async (receiverId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/dm/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error("대화 기록 조회 중 오류 발생:", error);
    }
  };

  // ---------------------------
  // 5) 메시지 전송
  // ---------------------------
  const sendMessage = async () => {
    if (!socket) {
      console.error("WebSocket 연결이 설정되지 않았습니다.");
      return;
    }
    if (!selectedUser || !selectedUser.id) {
      console.error("선택된 사용자가 없습니다.");
      return;
    }
    if (!currentUser || !currentUser.id) {
      console.error("로그인된 사용자가 없습니다.");
      return;
    }
    if (!message) {
      console.error("메시지가 비어 있습니다.");
      return;
    }

    const messageData = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content: message,
    };

    try {
      const token = localStorage.getItem("token");
      // REST API로 메시지 저장 요청
      await axios.post(`/api/dm/send`, messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // WebSocket으로 메시지 전송
      socket.send(JSON.stringify(messageData));

      // 전송 성공 후 상태 업데이트
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage("");
    } catch (error) {
      console.error("메시지 전송 중 오류 발생:", error);
    }
  };

  // ---------------------------
  // 6) 화면 렌더링
  // ---------------------------
  return (
    <div>
      <h2>Direct Message</h2>
      {/* 유저 검색 섹션 */}
      <div>
        <input
          type="text"
          placeholder="유저 이메일 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={searchUser}>검색</button>
      </div>
      <ul>
        {Array.isArray(searchResults) &&
          searchResults.map((user) => (
            <li key={user.id} onClick={() => selectUser(user)}>
              {user.email}
            </li>
          ))}
      </ul>

      {/* 선택된 유저와의 대화 섹션 */}
      {selectedUser && (
        <div>
          <h3>{selectedUser.email}님과의 대화</h3>
          <div>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.senderId === (currentUser?.id || "") ? "sent" : "received"
                }
              >
                <p>{msg.content}</p>
                <span>{msg.sent_at || "방금"}</span>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>전송</button>
        </div>
      )}
    </div>
  );
};

export default DM;
