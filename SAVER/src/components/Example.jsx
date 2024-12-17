import React from 'react'

function Example() {
  return (
    <div>
        
    <header>
    </header>

    <figure class="my-card">

        <div class="intro-box">
            <h3>안녕하세요. <span>저희는</span></h3>
            <h1>감 다 팀</h1>
            <h3>입니다.</h3>
        </div>
    </figure>
    <main>
        <section class="intro-container">
            <article class="intro-card">
                <a href="aboutMe.html">
                    <h3>소개</h3>
                    <p>열정, 성장, 협동</p>
                </a>
            </article>
            <article class="intro-card">
                <a href="ability.html">
                    <h3>기술</h3>
                    <p>개발 언어와 다양한 개발 지식을 배우고 있습니다.</p>
                </a>
            </article>
            <article class="intro-card">
                <a href="contact.html">
                    <h3>연락처</h3>
                    <p>많은 연락 바랍니다.</p>
                </a>
            </article>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 새싹. All rights reserved</p>
    </footer>
    </div>
  )
}

export default Example