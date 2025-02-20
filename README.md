# GDT - project saver

프로젝트

> 기획 노션 페이지 : https://determined-primula-ac4.notion.site/1a0eae425a6980c5a60adf3b9b13cf22?pvs=4
>
> ## 초기 프로젝트 세팅 하는 법.
>
> -   터미널 키고 파일 받아올 폴더로 이동 후
>
> ```shell
> git clone https://github.com/LimJ2023/GDT.git
> cd GDT
> 
> cd server
> npm install cors dotenv express mysql2 bcrypt jsonwebtoken nodemailer tesseract.js ws cookie-parser
> cd ..
> 
> cd client
> npm install --save-dev vite
> npm install @react-oauth/google
> npm install
> ```
>
> ## 실행법
>
> ```shell
> cd client 
> npm run dev
> 다른 터미널 창 여신다음에
> cd server
> node app.js
> ```

<!--
> ## 만약 프로젝트에 문제 생길 시 이렇게 초기화 하세요
> 1. vite 사이트에 접속하기 https://ko.vite.dev/guide/
> 2. 터미널에서 명령어 사용 $ npm create vite@latest
> 3.  ![1번](image/1번.png)
> 4.  ![2번](image/2번.png)
> 4.  ![3번](image/3번.png)
> 5.  사진대로 따라하면 끝
 -->

# API 명세서

  <table>
    <thead>
    <tr>
      <th>
        URL
      </th>
      <th>
        메소드
      </th>
      <th>
        설명
      </th>
      <th>
        응답
      </th>
      <th>
        에러
      </th>
    </tr>
      </thead>
    <tbody>
      <tr>
        <td>/api/users</td>
        <td>GET</td>
        <td>모든 유저 정보 가져오기</td>
        <td>javascript
          { success: true, data: [{id: 1, email: “hi@gmail.com”}, {id: 2, email: “bye@gmail.com”}] }
          </td>
        <td>404</td>
      </tr>
    </tbody>
  </table>

#### Git

-   내 작업은 내 이름 브랜치에 커밋한다
-   통합 브랜치에 병합하면, 기존에 사용한 브랜치는 삭제한다
-   병합후 작업은 통합 브랜치에서 새로 브랜칭해서 한다

#### git commit convention

`[ ] description #이슈번호`

`fix` : 코드 고침  
`add` : 코드 추가
