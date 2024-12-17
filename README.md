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


# 회의록
### 12월 17일(화)

 #### Git 
- 내 작업은 내 이름 브랜치에 커밋한다
- 통합 브랜치에 병합하면, 기존에 사용한 브랜치는 삭제한다
- 병합후 작업은 통합 브랜치에서 새로 브랜칭해서 한다

#### git commit convention
`[ ] description #이슈번호` 

`fix` : 코드 고침  
`add` : 코드 추가  

#### 기술조사 : 이번주 task 
- 이미지 가져오는 방식 조사 → 갤러리에서? 사이트 링크에서? 기타 등등  
- ocr은 자바스크립트로 된다를 확인함 → 각자 테스트해보기  
- 바코드 사용 인식 방식 어떤 api들이 있는가  

#### 기타
중간중간 commit 까지는 많이 하기. 기록이 많이 남을 수록 좋으니까  


  
