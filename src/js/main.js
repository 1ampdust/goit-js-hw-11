import searchingSystem from './search';
import { createMarkup, check } from './gallery';

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
  searchValue = searchQuery.value;
  loadMore.addEventListener('click', handleClick);
  search();
}

function handleClick() {
  page += 1;
  searchingSystem(page, searchValue, per_page)
    .then(data => {
      console.log(data.data.hits);
      gallery.insertAdjacentHTML('beforeend', createMarkup(data.data.hits));
      check(data.data.hits.length, data.data.totalHits, loadMore, currentSum);
    })
    .catch(error => console.log(error));
}

async function search() {
  try {
    const data = await searchingSystem(page, searchValue, per_page);
    if (data.data.totalHits === 0) {
      loadMore.style.display = 'none';
    } else {
      loadMore.style.display = 'block';
    }
    gallery.innerHTML = createMarkup(data.data.hits);
    check(data.data.hits.length, data.data.totalHits, loadMore, currentSum);
  } catch (error) {
    console.log(error);
  }
}
