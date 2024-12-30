
const MyProfile = ({user}) => {
  
  return (
    <div>
        <h4>회원정보</h4>
        
        <div>
          <img src={user.image} alt="프로필 이미지" />
            <p>이메일 : {user.email}</p>
        </div>
    </div>
  )
}

export default MyProfile