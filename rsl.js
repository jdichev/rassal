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
    if (slideElement.classList.contains('skip-fit')) {
      console.log('skipping fit for slide ', slideElement);
      return
    }

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
        // slideStyle.marginTop = ((viewPortHeight - slideElement.offsetHeight) / 2) + 'px';
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
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      // left || up
      if (slideIndex > 0) {
        slideIndex -= 1;
        w.location.hash = slideIndex;
      }
    }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      // right || down
      if (slideIndex < slides.length - 1) {
        slideIndex += 1;
        w.location.hash = slideIndex;
      }
    }
  };

  // d.onmouseup = function (e) {
  //   if (slideIndex < slides.length - 1) {
  //     slideIndex += 1;
  //     w.location.hash = slideIndex;
  //   }
  // };

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

async function injectSVGs() {
  // 1. Select all images ending in .svg
  const svgImages = document.querySelectorAll('img[src$=".svg"]');

  for (const img of svgImages) {
    const imgURL = img.src;
    const imgID = img.id;
    const imgClass = img.className;

    try {
      // 2. Fetch the SVG file content
      const response = await fetch(imgURL);
      const data = await response.text();

      // 3. Parse the text into an SVG DOM element
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "image/svg+xml");
      const svg = xmlDoc.querySelector("svg");

      if (svg) {
        // 4. Transfer attributes from the original <img> to the new <svg>
        if (imgID) svg.id = imgID;
        if (imgClass) svg.setAttribute("class", imgClass + " replaced-svg");
        
        // Remove some attributes
        svg.removeAttribute("width");
        svg.removeAttribute("height");

        // 5. Replace the image with the new inline SVG
        img.replaceWith(svg);
      }
    } catch (error) {
      console.error(`Failed to inject SVG from ${imgURL}:`, error);
    }
  }
}



  w.onload = function () {
    viewPortWidth = d.documentElement.clientWidth;
    viewPortHeight = d.documentElement.clientHeight;

    slides = d.querySelectorAll('.rsl-slide');

    for (var i = 0, slidesLength = slides.length; i < slidesLength; i += 1) {
      slides[i].classList.remove('rsl-visible');
    }

    processHash();

    injectSVGs();
  };
})(window, document);
