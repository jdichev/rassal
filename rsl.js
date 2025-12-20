(function (w, d) {
  var slides,
    slide,
    style,
    slideIndex,
    step = 5,
    fontSizeUnit = 'px',
    viewPortWidth,
    viewPortHeight;

  function fitSlideToViewport(slideElement) {
    var slideStyle = slideElement.style;
    var currentFontSize = 1;
    var maxIterations = 1000;
    var iterations = 0;

    slideStyle.fontSize = currentFontSize + fontSizeUnit;
    slideStyle.width = 'auto';

    while (iterations < maxIterations) {
      currentFontSize += step;
      slideStyle.fontSize = currentFontSize + fontSizeUnit;

      if (viewPortHeight < slideElement.offsetHeight || viewPortWidth < slideElement.offsetWidth) {
        currentFontSize -= step;
        slideStyle.fontSize = currentFontSize + fontSizeUnit;
        slideStyle.marginTop = ((viewPortHeight - slideElement.offsetHeight) / 2) + 'px';
        break;
      }
      
      iterations++;
    }
  }

  function showSlide(index) {
    if (slide !== undefined) {
      slide.classList.remove('rsl-visible');
    }

    // re-assign slide to be pointing to current one
    slide = slides[index];
    style = slide.style;

    fitSlideToViewport(slide);

    slide.classList.add('rsl-visible');
  }

  function processHash() {
    var hash = d.location.hash;

    slideIndex = +hash.replace('#', '');
    hash = '' + slideIndex;

    showSlide(slideIndex);
  }

  d.onkeyup = function (e) {
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

  d.onmouseup = function (e) {
    if (slideIndex < slides.length - 1) {
      slideIndex += 1;
      w.location.hash = slideIndex;
    }
  };

  d.ontouchend = function (e) {
    if (slideIndex < slides.length - 1) {
      slideIndex += 1;
      w.location.hash = slideIndex;
    }
  };

  w.onhashchange = function () {
    processHash();
  };

  window.handleResize = function () {
    viewPortWidth = d.documentElement.clientWidth;
    viewPortHeight = d.documentElement.clientHeight;

    // re-assign slide to be pointing to current one
    slide = document.querySelector('.rsl-visible');
    style = slide.style;

    fitSlideToViewport(slide);
  }

  window.addEventListener('resize', function (event) {
    window.handleResize();
  });

  w.onload = function () {
    viewPortWidth = d.documentElement.clientWidth;
    viewPortHeight = d.documentElement.clientHeight;

    slides = d.querySelectorAll('.rsl-slide');

    for (var i = 0, slidesLength = slides.length; i < slidesLength; i += 1) {
      slides[i].classList.remove('rsl-visible');
    }

    processHash();
  };
})(window, document);
