var slides = document.querySelectorAll('.rsl-slide');
var hash = document.location.hash;
var slideIndex = +hash.replace('#', '');

function processHash() {
  hash = document.location.hash;
  slideIndex = +hash.replace('#', '');
  showSlide(slideIndex);
}

function showSlide(index) {
  console.log(index);
  slides[index].scrollIntoView({behavior: "smooth"});
}

processHash();

document.onkeydown = function (e) {
  e = e || window.event;

  if (e.keyCode === 37 || e.keyCode === 38) {
    // left || up
    if (slideIndex > 0) {
      slideIndex -= 1;
      window.location.hash = slideIndex;
    }
  }
  else if (e.keyCode === 39 || e.keyCode === 40) {
    // right || down
    if (slideIndex < slides.length - 1) {
      slideIndex += 1;
      window.location.hash = slideIndex;
    }
  }
};

window.onhashchange = function () {
  processHash();
};