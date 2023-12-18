import axios from 'axios';
import Notiflix from 'notiflix';

async function searchingSystem(page, searchValue, per_page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const key = '41168195-d63dcd7c5ed901c12bfe9d8da';

  try {
    const results = await axios.get(`${BASE_URL}`, {
      params: {
        key,
        q: searchValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page,
      },
    });

    if (searchValue === '') {
      return;
    }

    if (per_page >= results.data.hits) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }

    return results;
  } catch (error) {
    console.log(error);
  }
}

export default searchingSystem;
