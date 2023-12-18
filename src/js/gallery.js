let currentSum = 0;

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
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    loadMore.style.display = 'block';
    Notiflix.Notify.success(
      `Hooray! We found ${currentSum} of ${total} images`
    );
  }
}

export { createMarkup, check };
