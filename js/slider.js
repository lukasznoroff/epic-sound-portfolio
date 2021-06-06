const sliderPosts = document.querySelector(".slider");
const errorBox = document.querySelector(".error-box");
let slides;
let slidesPerPage = 4;

if(isMobile()){
    slidesPerPage = 1;
}

function initSlider() {

    const sliderButtons = document.querySelectorAll(".slider-btn");
    let totalPosts;

    getPosts().then(response => {
 
        if (!response) {
            errorBox.style.display = "block";
            return;
        }

        const posts = response.posts;
        totalPosts = posts.length;
        posts.forEach((post) => {
            let dateFromPost = post.date;
            dateFromPost = dateFromPost.split("T")[0];

            const sliderImage = post["_embedded"]["wp:featuredmedia"][0].source_url;
            const category = post["_embedded"]["wp:term"][0][0]["name"];
            const sliderTitle = post.title.rendered;
            const sliderText = post.content.rendered;
            const textValue = sliderText.split(" ").length;
            const excerpt = post.content.rendered.substr(0, 90) + "...";
            const sliderId = post.id;
            const postTitle = post["_embedded"]["wp:featuredmedia"][0]["alt_text"];

            let wordCounter = 0;

            function getWords() {
                const wordsOnMinute = 150;
                wordCounter = textValue / wordsOnMinute;
            }

            getWords();

            sliderPosts.innerHTML += `

                                    <div class="post post-1">
                                        <img class="post-image" src="${sliderImage}" alt="${postTitle}">
                                        <div class="content-wrap">
                                            <div class="category-date-wrap">
                                                <h3 class="slider-post-category">${category.toUpperCase()}</h3>
                                                <h3 class="slider-post-date">${dateFromPost}</h3>
                                            </div>
                                            <h3 class="slider-post-header">${sliderTitle}</h3>
                                        <div class="slider-post-text">${excerpt}</div>
                                            <a class="read-more" href="/pages/article.html?id=${sliderId}">Read more</a>
                                        <div class="read-time-wrapper">
                                            <p class="read-time">${wordCounter.toFixed(0)} min read</p>
                                        </div>
                                    </div>
            `;
        })
        
        slides = sliderPosts.querySelectorAll(".post");
        for(let slide of slides) {
            if (!isMobile) {
                slide.style.minWidth = `${100 / slidesPerPage}%`;
            }
        }

        let imageIndex = 1;
        let translateX = 0;

        const sliderWidth = document.querySelector(".slider").offsetWidth;
        const btnNext = document.querySelector(".slider-btn-next");
     
        sliderButtons.forEach((button) => {
    
            button.addEventListener("click", (ev) => {
                
                if (ev.target.classList.contains("slider-btn-prev")) {
                    if (imageIndex !== 1) {
                        imageIndex--;
                        translateX += sliderWidth;
                        btnNext.classList.remove("btn-next-off")
                    }
                    
                } else if (imageIndex !== totalPosts) {
                    imageIndex++;
                    translateX -= sliderWidth;

                } if (imageIndex >= (totalPosts / slidesPerPage)) {
                    btnNext.classList.add("btn-next-off");
                }
    
                sliderPosts.style.transform = `translateX(${translateX}px)`;
    
            })
        })
    })
}



function init() {
    if (sliderPosts) {
        initSlider();
    }
}
window.addEventListener("DOMContentLoaded", () => {
    init();
})
