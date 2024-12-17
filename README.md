# GDT - project saver
감다팀의 쿠폰 모아보기 saver 프로젝트

> 기획 노션 페이지 : https://lovehyun.notion.site/1-1516ebae57e180faa9cec3f138f17efc
> ## 초기 프로젝트 세팅 하는 법. 
> - 터미널 키고 파일 받아올 폴더로 이동 후
>  ```shell
>  git clone https://github.com/LimJ2023/GDT.git
>  cd GDT
>  cd SAVER
>  npm install
>   ```
>  
>  
> ## 실행법
> ```shell
> npm run dev
> ```
> 
>   
> ## 만약 프로젝트에 문제 생길 시 이렇게 초기화 하세요
> 1. vite 사이트에 접속하기 https://ko.vite.dev/guide/
> 2. 터미널에서 명령어 사용 $ npm create vite@latest
> 3.  ![1번](image/1번.png)
> 4.  ![2번](image/2번.png)
> 4.  ![3번](image/3번.png)
> 5.  사진대로 따라하면 끝


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
        <td>/api/uses</td>
        <td>GET</td>
        <td>모든 유저 정보 가져오기</td>
        <td>javascript
          { success: true, data: [{id: 1, email: “hi@gmail.com”}, {id: 2, email: “bye@gmail.com”}] }
          </td>
        <td>404</td>
      </tr>
    </tbody>
  </table>


  # 회의록
  
