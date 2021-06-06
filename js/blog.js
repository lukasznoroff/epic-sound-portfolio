let totalPostsDisplayed = 0;
let categoryFilterBtns = document.querySelectorAll(".js-category-filter");
const postsPerPage = 10;
const blogContainer = document.querySelector(".blog-container");
const errorBox = document.querySelector(".error-box");

function displayPosts(numberPosts = 10, page = 1, categories = null) {

    blogContainer.classList.add("loading");

    appendLoadMoreSvg();

    getPosts(numberPosts, page, categories).then(response => {

       
      if (!response) {
        errorBox.style.display = "block";
      }
       
        const posts = response.posts;
        const total = response.total;
        totalPostsDisplayed += posts.length;


        posts.forEach((post) => {
            const blogImage = post["_embedded"]["wp:featuredmedia"][0].source_url;
            const category = post["_embedded"]["wp:term"][0][0]["name"];
            const blogTitle = post.title.rendered;
            const blogText = post.content.rendered;
            const postTitle = post["_embedded"]["wp:featuredmedia"][0]["alt_text"];
            let dateFromPost = post.date;
            dateFromPost =  dateFromPost.split("T")[0];
            const excerpt = strip(post.content.rendered.substr(0, 70));
            const blogId = post.id;

            blogContainer.innerHTML += `
                
                                        <div class="post-blog">
                                            <img class="blog-image" src="${blogImage}" alt="${postTitle}">
                                            <div class="blog-category-date-wrap">
                                                <h3 class="blog-post-category">${category.toUpperCase()}</h3>
                                                <h3 class="blog-post-date">${dateFromPost}</h3>
                                            </div>    
                                            <h3 class="blog-post-header">${blogTitle}</h3>
                                            <div class="blog-post-text">${excerpt}</div>
                                            <a class="read-more-blog" href="/pages/article.html?id=${blogId}">Read more</a>
                                        </div>
                `;

             
        })

        if (totalPostsDisplayed < total) {

            const btn = document.createElement("button");
            btn.classList.add("btn-load-more");
            btn.dataset.nextPage = page + 1;

            if (categories) {
                btn.dataset.categoryId = categories;
            }
            btn.innerHTML = `Load more`;
            blogContainer.insertAdjacentElement("afterend", btn);
        }
        blogContainer.classList.remove("loading");
        removeLoadMoreSvg();
    })
}


function handleLoadMorePosts() {

    document.body.addEventListener("click", (ev) => {
        const target = ev.target;
        if (!target.matches(".btn-load-more")) {
            return;
        }

        const nextPage = parseInt(target.dataset.nextPage);
        let categories = null;

        if (target.dataset.categoryId !== "undefined") {
            categories = target.dataset.categoryId;
        }
        const loadMoreBtns = document.querySelectorAll(".btn-load-more");
        loadMoreBtns.forEach((btn) => {
            btn.remove();

        });

        displayPosts(postsPerPage, nextPage, categories);
    })
}

function resetPosts() {

    totalPostsDisplayed = 0;
    blogContainer.innerHTML = "";
    removeLoadMore();

}

function removeLoadMore() {
    const btns = document.querySelectorAll(".btn-load-more");
    for (let btn of btns) {
        btn.remove();
    }
}

const circle4 = document.querySelector(".circle4");

function handleFilters() {

    for (let btn of categoryFilterBtns) {
        btn.addEventListener("click", (ev) => {
            ev.preventDefault();

            if(btn.classList.contains("active-category-link")){
                return;
            }

            resetPosts();
            const categotyId = btn.dataset.categoryId;
            clearCssFilters();
            btn.classList.add("active-category-link");

            if (categotyId == "all") {
                displayPosts(postsPerPage, 1);
            } else {
                circle4.innerHTML = `<h4 class="active-category">${btn.innerHTML}</h4>`;
                displayPosts(postsPerPage, 1, categotyId);
            }
        })
    }
}

function appendLoadMoreSvg(){

    const loadMoreCircle = document.createElement("div");
    loadMoreCircle.classList.add("load-more-circle");
    loadMoreCircle.innerHTML = `
                                <svg class="loader" xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 50 50">
                                <path fill="#043850" d="M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,                          20.14,0,0,1,25,5Z">
                                    <animateTransform
                                            attributeName="transform"
                                            type="rotate"
                                            from="0 25 25"
                                            to="360 25 25"
                                            dur=".8s"
                                            repeatCount="indefinite"
                                    />
                                </path>
                                </svg>`;
    

    blogContainer.insertAdjacentElement("afterend", loadMoreCircle);
}

function removeLoadMoreSvg(){
    const circles = document.querySelectorAll(".load-more-circle");
    if(circles.length){
        for(let circle of circles){
            circle.remove();
        }
    }
}


function clearCssFilters(){
    for(let btn of categoryFilterBtns){
        btn.classList.remove("active-category-link");
        circle4.innerHTML = "";
    }
}

function init() {
    handleLoadMorePosts();
    handleFilters();
    displayPosts(postsPerPage, 1);
}

window.addEventListener("DOMContentLoaded", () => {
    init();
})


const arrowBtn = document.querySelector(".arrow-button");

window.addEventListener("scroll", () => {

    if (window.pageYOffset > 900) {
        arrowBtn.classList.add("arrow-button-active");
    } else {
        arrowBtn.classList.remove("arrow-button-active");
    }
})

