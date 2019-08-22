(function (w, d) {
  var slides,
    slide,
    style,
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
    style = slide.style;

    // reset font-size
    fontSize = 1;

    style.fontSize = fontSize + fontSizeUnit;
    style.width = 'auto';

    while (true) {
      fontSize += step;
      style.fontSize = fontSize + fontSizeUnit;

      if (viewPortHeight < slide.offsetHeight || viewPortWidth < slide.offsetWidth) {
        fontSize -= step;
        style.fontSize = fontSize + fontSizeUnit;
        style.marginTop = ((viewPortHeight - slide.offsetHeight) / 2) + 'px';
        break;
      }
    }

    slide.classList.add('rsl-visible');
  }

  function processHash() {
    var hash = d.location.hash;

    slideIndex = +hash.replace('#', '');
    hash = '' + slideIndex;

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

  window.handleResize = function () {
        viewPortWidth = d.documentElement.clientWidth;
        viewPortHeight = d.documentElement.clientHeight;

        // re-assign slide to be pointing to current one
        slide = document.querySelector('.rsl-visible');
        style = slide.style;
    
        // reset font-size
        var fontSize = 1;
    
        style.fontSize = fontSize + fontSizeUnit;
        style.width = 'auto';
    
        while (true) {
          fontSize += step;
          style.fontSize = fontSize + fontSizeUnit;
    
          if (viewPortHeight < slide.offsetHeight || viewPortWidth < slide.offsetWidth) {
            fontSize -= step;
            style.fontSize = fontSize + fontSizeUnit;
            style.marginTop = ((viewPortHeight - slide.offsetHeight) / 2) + 'px';
            break;
          }
        }
    
    
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
