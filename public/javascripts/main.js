const myMongoDB = require('../../db/myMongoDB');

const ulPosts = document.querySelector('#posts');
const divErr = document.querySelector('#err');

function populatePosts(posts) {
  for (let p of posts) {
    const liP = document.createElement('li');
    liP.innerHTML = `By: ${p.author} <br/> ${p.text}`;
    ulPosts.appendChild(liP);
  }
}

function populateData(apartments) {
  for (let a of apartments) {
    const liP = document.createElement('li');
    liP.innerHTML = `By: ${a.image} <br/> ${a.housing}`;
    ulPosts.appendChild(liP);
  }
}

// AJAX request
// fetch('/posts')
//   .then((res) => res.json())
//   .then(populatePosts)
//   .catch((err) => {
//     divErr.textContent = err.message;
//     divErr.style.display = 'block';
//   });

fetch('/apartments')
  .then((res) => res.json())
  .then(populateData(res))
  .catch((err) => {
    divErr.textContent = err.message;
    divErr.style.display = 'block';
  });
