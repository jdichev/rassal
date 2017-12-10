
let viewPortWidth = document.documentElement.clientWidth;

let viewPortHeight = document.documentElement.clientHeight;

function styleSlide(slide) {
  slide.style.height = viewPortHeight + 'px';
}

let slides = document.querySelectorAll('.rsl-slide');

for (var i = 0, slidesLength = slides.length; i < slidesLength; i += 1) {
  let slide = slides[i];

  styleSlide(slide);
}
