(function (w, d) {
  var slides,
    slide,
    slideIndex,
    fontSize = 1,
    step = 5,
    fontSizeUnit = 'px',
    viewPortWidth,
    viewPortHeight;

  function showSlide(index) {
    if (slide !== undefined) {
      slide.classList.remove('rsl-visible');
    }

    // re-assign slide to be pointing to current one
    slide = slides[index];

    // reset font-size
    fontSize = 1;

    slide.style.fontSize = fontSize + fontSizeUnit;
    slide.style.width = 'auto';

    while (true) {
      fontSize += step;
      slide.style.fontSize = fontSize + fontSizeUnit;

      if (viewPortHeight < slide.offsetHeight || viewPortWidth < slide.offsetWidth) {
        fontSize -= step;
        slide.style.fontSize = fontSize + fontSizeUnit;
        slide.style.marginTop = ((viewPortHeight - slide.offsetHeight) / 2) + 'px';
        break;
      }
    }

    slide.classList.add('rsl-visible');
  }

  function processHash() {
    slideIndex = +d.location.hash.replace('#', '');
    d.location.hash = '' + slideIndex;

    showSlide(slideIndex);
  }

  d.onkeydown = function (e) {
    e = e || window.event;

    if (e.keyCode === 37 || e.keyCode === 38) {
      // left || up
      if (slideIndex > 0) {
        slideIndex -= 1;
        w.location.hash = slideIndex;
      }
    }
    else if (e.keyCode === 39 || e.keyCode === 40) {
      // right || down
      if (slideIndex < slides.length - 1) {
        slideIndex += 1;
        w.location.hash = slideIndex;
      }
    }
  };

  w.onhashchange = function () {
    processHash();
  };

  w.onload = function () {
    viewPortWidth = d.documentElement.clientWidth;
    viewPortHeight = d.documentElement.clientHeight;

    slides = d.querySelectorAll('.rsl-slide');

    for (var i = 0, slidesLength = slides.length; i < slidesLength; i += 1) {
      slides[i].classList.remove('rsl-visible');
    }

    processHash();

    d.querySelector('body').addEventListener('dblclick', function () {

      d.querySelector('.rsl-visible').contentEditable = true
    });
  };
})(window, document);
