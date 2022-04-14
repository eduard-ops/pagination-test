import GalleryApiService from './components/galleryApi';

import Notiflix from 'notiflix';

import Pagination from 'tui-pagination';

import 'tui-pagination/dist/tui-pagination.css';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

import galleryTpl from '../templates/gallery.hbs';

const galleryApiService = new GalleryApiService();

const options = {
  totalItems: 40,
  itemsPerPage: 7,
  visiblePages: 7,
  page: 1,
  centerAlign: false,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
};

const pagination = new Pagination('pagination', options);

pagination.on('afterMove', async e => {
  clearHitsContainer();
  const a = await galleryApiService.fetchGallery();
  const { data } = a;
  const { page } = e;

  appendHitsMarkup(data.hits);
});

const refs = {
  formEl: document.querySelector('#search-form'),
  btnSubmit: document.querySelector('.btn-submit'),
  divGallery: document.querySelector('.gallery'),
  containerEl: document.querySelector('.container'),
  // animLoad: document.querySelector('.loading'),
};

refs.formEl.addEventListener('submit', onClickSubmit);

// refs.animLoad.classList.add('is-hidden');

async function onClickSubmit(e) {
  e.preventDefault();
  clearHitsContainer();
  galleryApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  if (galleryApiService.query === '') {
    Notiflix.Notify.info('Please enter something');
    // refs.animLoad.classList.add('is-hidden');
    return;
  }
  galleryApiService.resetPage();
  try {
    const urlObj = await galleryApiService.fetchGallery();
    const { data } = urlObj;
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
    appendHitsMarkup(data.hits);
    lightbox.refresh();
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

// async function onLoadMore() {
//   try {
//     const urlObj = await galleryApiService.fetchGallery();
//     const {
//       data: { hits },
//     } = urlObj;
//     appendHitsMarkup(hits);
//     lightbox.refresh();
//     const { height: cardHeight } = refs.divGallery.firstElementChild.getBoundingClientRect();
//     window.scrollBy({
//       top: cardHeight * 2,
//       behavior: 'smooth',
//     });

//     if (galleryApiService.page > urlObj.data.totalHits / galleryApiService.per_page) {
//       refs.brtMore.classList.add('is-hidden');
//       return Notiflix.Notify.success('Your search has come to an end');
//     }
//   } catch (error) {
//     Notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.',
//     );
//   }
// }

function appendHitsMarkup(hits) {
  refs.divGallery.insertAdjacentHTML('beforeend', galleryTpl(hits));
}

function clearHitsContainer() {
  refs.divGallery.innerHTML = '';
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// const onEntry = entries => {
//   entries.forEach(async entry => {
//     if (entry.isIntersecting && galleryApiService.query !== '') {
//       try {
//         const urlObj = await galleryApiService.fetchGallery();
//         const { data } = urlObj;
//         // refs.animLoad.classList.remove('is-hidden');
//         appendHitsMarkup(data.hits);
//         lightbox.refresh();
//         if (galleryApiService.page > urlObj.data.totalHits / galleryApiService.per_page) {
//           // refs.animLoad.classList.add('is-hidden');
//           return Notiflix.Notify.info('Your search has come to an end');
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   });
// };

// const observer = new IntersectionObserver(onEntry, {
//   rootMargin: '50px',
// });

// observer.observe(refs.containerEl);
