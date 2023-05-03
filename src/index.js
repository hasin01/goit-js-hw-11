import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './fetch';


const input = document.querySelector('input');
const form = document.querySelector('form#search-form');
const imagesBox = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const renderImages = images => {
  const { webformatURL, tags, likes, views, comments, downloads } = images;
  return `<div class="photo-card">
   <a href="${webformatURL}"> <img class="render-img" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
    <p class="info-item"> 
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`;
};

const searchImages = async e => {
  e.preventDefault();
  const q = input.value.trim();
  try {
    const response = await fetchImages(q);
    const images = response.data.hits;
    const imageCount = response.data.totalHits;
    console.log(imageCount);
    imagesBox.innerHTML = '';
    images.forEach(image => {
      imagesBox.insertAdjacentHTML('beforeend', renderImages(image));
      ligthBoxGallery.refresh();
    });
    if (!q) {
      loadMore.classList.add('is-hidden');
    }
    if (imageCount > 40 && q) {
      loadMore.classList.remove('is-hidden');
    }
    if (imageCount < 40 && q) {
      loadMore.classList.add('is-hidden');
    }
    if (q && imageCount > 0) {
      Notify.success(`Hurray! We found ${imageCount}`);
      return;
    } else
      Notify.failure(
        'Sorry, there are no images matching your query. Please try again.'
      );

    imagesBox.innerHTML = '';
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your query. Please try again.'
    );
  }
};

function pictureClickHandler(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'IMG') {
    return;
  }
}

form.addEventListener('submit', searchImages);
imagesBox.addEventListener('click', pictureClickHandler);

const ligthBoxGallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let page = 1;
const onLoadMoreBtnClick = async e => {
  loadMore.classList.remove('is-hidden');
  page += 1;
  console.log(page);
  const q = input.value.trim();
  try {
    const response = await fetchImages(q, page);
    const images = response.data.hits;
    const imageCount = response.data.totalHits;
    console.log(imageCount);
    images.forEach(image => {
      imagesBox.insertAdjacentHTML('beforeend', renderImages(image));
      ligthBoxGallery.refresh();
    });
    if (page === Math.ceil(imageCount / 40)) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMore.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
};

loadMore.addEventListener('click', onLoadMoreBtnClick);