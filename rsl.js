(function (w, d) {
  var slides,
    slide,
    slideIndex;

  var initialFontSize = 1,
      step = 10,
  initialFontUnit = 'px';

  function showSlide(index) {
    if (slide !== undefined) {
      slide.style.display = 'none';
    }

    slide = slides[index];

    initialFontSize = 1;

    d.body.style.fontSize = initialFontSize + initialFontUnit;

    slide.style.display = 'inline-block';

    var w = d.documentElement.clientWidth;
    console.log('w', w);
    var h = d.documentElement.clientHeight;
    console.log('h', h);

    while (true) {
      initialFontSize += step;
      slide.style.fontSize = initialFontSize + initialFontUnit;

      if (h < slide.offsetHeight || w < slide.offsetWidth) {
        console.log('hit', initialFontSize, slide.offsetWidth, slide.offsetHeight);
        initialFontSize -= step;
        slide.style.fontSize = initialFontSize + initialFontUnit;
        console.log('fix', initialFontSize, slide.offsetWidth, slide.offsetHeight);
        slide.style.marginTop = ((h - slide.offsetHeight) / 2) + 'px';
        break;
      }
    }
  }

  function processHash() {
    slideIndex = +d.location.hash.replace('#', '');
    console.log('slideIndex', slideIndex);
    d.location.hash = '' + slideIndex;
  }

  d.onkeydown = function (e) {

    e = e || window.event;

    if (e.keyCode == '37') {
      // left
      if (slideIndex > 0) {
        slideIndex -= 1;
        w.location.hash = slideIndex;
      }
    }
    else if (e.keyCode == '39') {
      // right
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
    slides = d.querySelectorAll('.rsl-slide');

    for (var i = 0, slidesLength = slides.length; i < slidesLength; i += 1) {
      slides[i].style['display'] = 'none';
    }

    processHash();

    showSlide(slideIndex);
  };
})(window, document);
