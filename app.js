const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');

// selected image 
let sliders = [];

// Pixabay API key
const KEY = '20270758-da3b85107630527b3793e7bd3';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
    loadingSpinner(false);
  })
}

const getImages = async (query) => {
  loadingSpinner(true);
  const url = `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`
  try {
    const res = await fetch(url);
    const data = await res.json();
    showImages(data.hits);
  }
  catch (error) {
    displayError("Something went wrong! Please try again later!");
  }
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    element.classList.remove('added');
    sliders.splice(item, 1);
  }
}

var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value;
  if (duration < 1000) {
    duration = 1000
  }
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}
// search enter button
document.getElementById("search")
  .addEventListener("keypress", function (event) {
    if (event.key == 'Enter') {
      document.getElementById("search-btn").click();
    }
  });
// search click button
searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

// spinner (extra section - 1)

const loadingSpinner = (show) => {
  const spinner = document.getElementById('loading-spinner')
  if (show) {
    spinner.classList.remove('d-none');
  } else {
    spinner.classList.add('d-none');
  }
}

// display error message (extra section - 2)

const displayError = error => {
  const errorMessage = document.getElementById('display-error');
  errorMessage.innerText = error;
}