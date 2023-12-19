import axios from 'axios';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let page = 1;
let searchValue;
let per_page = 40;
let currentSum = 0;
loadMore.style.display = 'none';

searchForm.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  page = 1;

  const { searchQuery } = event.currentTarget.elements;
  searchValue = searchQuery.value.trim();

  if (searchValue === '') {
    loadMore.style.display = 'none';
    Notiflix.Notify.failure('All fields must be filled!');
    return;
  }

  loadMore.addEventListener('click', handleClick);
  search();
}

async function handleClick() {
  try {
    page += 1;
    const data = await searchingSystem(page);
    console.log(data.data.hits);
    gallery.insertAdjacentHTML('beforeend', createMarkup(data.data.hits));
    check(data.data.hits.length, data.data.totalHits);
  } catch (error) {
    console.log(error);
  }
}

async function search() {
  try {
    currentSum = 0;
    const data = await searchingSystem(page, per_page);

    if (!data) {
      loadMore.style.display = 'none';
      Notiflix.Notify.failure(
        'Sorry, there was an error with your search query. Please try again.'
      );
      return;
    }

    if (data.data.totalHits === 0) {
      loadMore.style.display = 'none';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      loadMore.style.display = 'block';
      gallery.innerHTML = createMarkup(data.data.hits);
      check(data.data.hits.length, data.data.totalHits);
    }
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
      return null;
    }

    if (results.data.hits.length === 0) {
      loadMore.style.display = 'none';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    return results;
  } catch (error) {
    loadMore.style.display = 'none';
    Notiflix.Notify.failure(
      'Sorry, there was an error with your search query. Please try again.'
    );
    console.log(error);
    return null;
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) => `
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

function check(current, total) {
  currentSum += current;
  if (currentSum >= total) {
    loadMore.style.display = 'none';
    return Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  Notiflix.Notify.success(`Hooray! We found ${currentSum} of ${total} images`);
  loadMore.style.display = 'block';
}
