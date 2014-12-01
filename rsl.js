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
      slide.style.display = 'none';
    }

    slide = slides[index];
    fontSize = 1;

    slide.style.fontSize = fontSize + fontSizeUnit;
    slide.style.width = 'auto';
    slide.style.display = '';

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
  }

  function processHash() {
    slideIndex = +d.location.hash.replace('#', '');
    d.location.hash = '' + slideIndex;
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
    showSlide(slideIndex);
  };

  w.onload = function () {
    viewPortWidth = d.documentElement.clientWidth;
    viewPortHeight = d.documentElement.clientHeight;

    slides = d.querySelectorAll('.rsl-slide');

    for (var i = 0, slidesLength = slides.length; i < slidesLength; i += 1) {
      slides[i].style['display'] = 'none';
    }

    processHash();
    showSlide(slideIndex);
  };
})(window, document);
