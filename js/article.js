const articleWrap = document.querySelector(".article-wrap");
const articleId = parseInt(getParameterByName("id"));

getPost(articleId)
.then((post)=>{

    document.querySelector("title").innerHTML = `Epic Sound | ${post.title.rendered}`;
    const articleEl = document.createElement("div");
    articleEl.classList.add("article-element");

    const sliderImage = post["_embedded"]["wp:featuredmedia"][0].source_url;
    const category = post["_embedded"]["wp:term"][0][0]["name"];
    const sliderTitle = post.title.rendered;
    const sliderText = post.content.rendered;
    const postTitle = post["_embedded"]["wp:featuredmedia"][0]["alt_text"];
        
    

    articleEl.innerHTML = `
                            <div class="article-container">
                                <h1 class="slider-post-category article-post-category">Category: <span class="article-category">${category.toUpperCase()}</span></h1>
                                <img class="post-image article-image" src="${sliderImage}" alt="${postTitle}">
                                <div class="content-wrap">
                                    <h3 class="slider-post-header article-post-header">${sliderTitle}</h3>
                                    <div class="slider-post-text article-post-text">${sliderText}</div>
                                </div>
                            </div>  
    `;
    articleWrap.appendChild(articleEl);
})


document.body.addEventListener("click", (ev)=>{
    
    if(!ev.target.matches(".article-wrap img")){
        return;
    }
    const imgElm = ev.target;
    const imgElmSrc = imgElm.src;
    const newImgElm = new Image();
    newImgElm.src = imgElmSrc;
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `<div class="close-popup">close</div>`;
    popup.appendChild(newImgElm);
    document.body.appendChild(popup);
})

document.body.addEventListener("click", (ev)=>{
    if(!ev.target.matches(".popup")){
        return;
    }
    const popup = ev.target;
    popup.style.display = "none";
    popup.remove();
})

