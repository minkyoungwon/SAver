
const MyProfile = ({user}) => {
  const user2 = {
    email: "test@test.com",
    image: "https://via.placeholder.com/150"
  }
  return (
    <div>
        <h4>회원정보</h4>
        
        <div>
          <img src={user2.image} alt="프로필 이미지" />
            <p>이메일 : {user2.email}</p>
        </div>
    </div>
  )
}

export default MyProfile