import axios from 'axios';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let page = 1;
let searchValue;
let per_page = 40;
loadMore.style.display = 'none';

searchForm.addEventListener('submit', handleSubmit);
function handleSubmit(event) {
  event.preventDefault();
  page = 1;

  const { searchQuery } = event.currentTarget.elements;
  searchValue = searchQuery.value;
  loadMore.addEventListener('click', handleClick);
  search();
}

function handleClick() {
  page += 1;
  searchingSystem(page)
    .then(data => {
      console.log(data.data.hits);
      gallery.insertAdjacentHTML('beforeend', createMarkup(data.data.hits));
    })
    .catch(error => console.log(error));
}

async function search() {
  try {
    const data = await searchingSystem(page, per_page);
    if (data.data.totalHits === 0) {
      loadMore.style.display = 'none';
    } else {
      loadMore.style.display = 'block';
      Notiflix.Notify.success(
        `Hooray! We found ${data.data.totalHits} images.`
      );
    }
    if (per_page >= data.data.totalHits) {
      loadMore.style.display = 'none';
    }
    gallery.innerHTML = createMarkup(data.data.hits);
  } catch (error) {
    console.log(error);
  }
}

async function searchingSystem(page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const key = '41168195-d63dcd7c5ed901c12bfe9d8da';
  const q = searchValue;

  try {
    const results = await axios.get(`${BASE_URL}`, {
      params: {
        key,
        q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page,
      },
    });
    if (q === '') {
      return;
    }
    if (per_page >= results.data.hits) {
      loadMore.style.display = 'none';
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    return results;
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <div class="photo-card">
<img class="imag-card" src="${webformatURL}" alt="${tags}" loading="lazy"/>
<div class="info">
<p class="info-item">
  <b>Likes: ${likes}</b>
</p>
<p class="info-item">
  <b>Views: ${views}</b>
</p>
<p class="info-item">
  <b>Comments: ${comments}</b>
</p>
<p class="info-item">
  <b>Downloads: ${downloads}</b>
</p>
</div>
</div>
    `
    )
    .join('');
}
