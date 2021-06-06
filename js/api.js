const apiUrl = "https://blog-lukas.lukaswebdeveloper.com/wp-json/wp/v2";
let total;


function getPosts(numberPosts = 10, page = 1, categories = null) {
  let url = `${apiUrl}/posts?_embed&per_page=${numberPosts}&page=${page}`;
  if (categories) {
    url += `&categories=${categories}`;
  }
  return fetch(url)
    .then(res => {
      total = res.headers.get("X-WP-Total");
      //  console.log(total);
      return res.json()
    })
    .then(posts => {
      return {
        total,
        posts
      };
    })
    .catch(() => {
      return false;
    })
}


function getPost(id) {
  return fetch(`${apiUrl}/posts/${id}?_embed`)
    .then(res => res.json())
    .then(post => {
      return post;
    })
}


function getToken() {
  if (localStorage.getItem("wp-token") !== null) {
    const token = localStorage.getItem("wp-token");
    return fetch("https://blog-lukas.lukaswebdeveloper.com/wp-json/jwt-auth/v1/token/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        
        if(data.data.status !== 200){
          return getTokenFromApi();
        }
      })
  }
  else {
    return getTokenFromApi();
  }
}

function getTokenFromApi() {
  return fetch(`https://blog-lukas.lukaswebdeveloper.com/wp-json/jwt-auth/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: "kfaute",
      password: "^pTIMi1gt(^6"
    })
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      window.localStorage.setItem("wp-token", data.token);

    })
}

function sendFormToWordpress(formData) {
  return getToken()
    .then(() => {
      let url = `${apiUrl}/contact`;
      return fetch(url, {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          status: "publish",
          fields: {
            "email": formData.email,
            "subject": formData.subject,
            "message": formData.message
          }
        }),
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("wp-token")}`,
          "Content-Type": "application/json"
        }

      })
    })
    .then((res) => {
      console.log(res);
      return res.ok;
      
    })
}


function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function strip(html) {
  let doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isMobile() {
  return window.matchMedia(`(max-width:800px)`).matches
};


const hamburger = document.querySelector(".hamburger");
const headerLinks = document.querySelector(".header-links");
const nav = document.querySelector("nav");

hamburger.addEventListener("click", () => {

  hamburger.classList.toggle("rotate");

  if (!headerLinks.classList.contains("active")) {
    headerLinks.classList.add("active");
    nav.style.position = "fixed";
  } else {
    headerLinks.classList.remove("active");
  }
})

