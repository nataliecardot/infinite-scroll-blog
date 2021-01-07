const postsContainer = document.getElementById('posts-container');
const loading = document.querySelector('.loader');
const filter = document.getElementById('filter');

let limit = 5;
let page = 1;

// Fetch posts from API
async function getPosts() {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );

  const data = await res.json();

  // Note data returned is also a promise; use await when calling getPosts()
  return data;
}

// Show posts in DOM
async function showPosts() {
  const posts = await getPosts();

  posts.forEach((post) => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `
      <div class="number">${post.id}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.body}</p>
      </div>
    `;

    postsContainer.appendChild(postEl);
  });
}

// Show loader and fetch more posts
function showLoading() {
  loading.classList.add('show');

  // So, after half a second, class is removed so animated loader dots have opacity set to 0, then after .3 seconds, the next page of posts are fetched
  setTimeout(() => {
    loading.classList.remove('show');

    setTimeout(() => {
      page++;
      showPosts();
    }, 300);
  }, 500);
}

// Filter posts by input (this only works for posts currently in the DOM [already fetched])
function filterPosts(e) {
  const term = e.target.value.toLowerCase().trim();
  const posts = document.querySelectorAll('.post');

  posts.forEach((post) => {
    const title = post.querySelector('.post-title').innerText.toLowerCase();
    const body = post.querySelector('.post-body').innerText.toLowerCase();

    title.includes(term) || body.includes(term)
      ? (post.style.display = 'flex')
      : (post.style.display = 'none');
  });
}

// Display initial posts
showPosts();

window.addEventListener('scroll', () => {
  // scrollTop: number of pixels an element's content is scrolled vertically
  // clientHeight: viewable height of an element in pixels, including padding, but not border, scrollbar or margin
  // scrollHeight: entire height of an element in pixels, including padding, but not border, scrollbar or margin - including content not visible on screen
  // Document.documentElement returns the Element that is the root element of the document (for HTML documents, this is the <html> element)
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading();
  }
});

filter.addEventListener('input', filterPosts);
