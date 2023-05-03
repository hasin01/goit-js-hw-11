import axios from 'axios';
export default function fetchImages(q, page) {
  const URL = 'https://pixabay.com/api/';
  const API_KEY = '35986982-1e91609b0f68cd8c4b5293b55';
  const FIELDS = `?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  return axios.get(`${URL}${FIELDS}`).catch(error => {
    console.log(error.toJSON());
  });
}
