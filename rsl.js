(function (w, d) {
  var slides,
    slide,
    style,
    slideIndex,
    step = 5,
    fontSizeUnit = 'px',
    viewPortWidth,
    viewPortHeight;

  var groupFontSizes = {};

  function getOptimalFontSize(slideElement) {
    if (slideElement.classList.contains('skip-fit')) {
      return null;
    }

    // Temporarily make slide visible to calculate size accurately
    var originalVisibility = slideElement.style.visibility;
    var originalDisplay = slideElement.style.display;

    slideElement.style.visibility = 'hidden';
    slideElement.style.display = 'block';

    var slideStyle = slideElement.style;
    var currentFontSize = 1;
    var maxIterations = 1000;
    var iterations = 0;

    slideStyle.fontSize = currentFontSize + fontSizeUnit;
    slideStyle.width = 'auto';

    while (iterations < maxIterations) {
      currentFontSize += step;
      slideStyle.fontSize = currentFontSize + fontSizeUnit;

      if (
        viewPortHeight < slideElement.offsetHeight ||
        viewPortWidth < slideElement.offsetWidth
      ) {
        currentFontSize -= step;
        break;
      }
      iterations++;
    }

    // Restore original styles
    slideElement.style.visibility = originalVisibility;
    slideElement.style.display = originalDisplay;

    return currentFontSize;
  }

  function fitSlideToViewport(slideElement) {
    var group = slideElement.getAttribute('data-rsl-group');

    // Auto-grouping logic
    if (!group && d.body.classList.contains('auto-grouping')) {
      var allSlides = Array.from(slides);
      var index = allSlides.indexOf(slideElement);
      if (index === 0) {
        group = 'rsl-auto-initial';
      } else {
        group = 'rsl-auto-main';
      }
    }

    var fontSize;

    if (group) {
      if (groupFontSizes[group] !== undefined) {
        fontSize = groupFontSizes[group];
      } else {
        var groupSlides = d.querySelectorAll(
          '.rsl-slide[data-rsl-group="' + group + '"]'
        );

        // If auto-grouping, we need to collect the slides differently
        if (groupSlides.length === 0 && group.startsWith('rsl-auto-')) {
          if (group === 'rsl-auto-initial') {
            groupSlides = [slides[0]];
          } else {
            groupSlides = Array.from(slides).slice(1);
          }
        }

        var minFontSize = Infinity;
        for (var i = 0; i < groupSlides.length; i++) {
          var f = getOptimalFontSize(groupSlides[i]);
          if (f !== null && f < minFontSize) {
            minFontSize = f;
          }
        }
        groupFontSizes[group] = minFontSize;
        fontSize = minFontSize;
      }
    } else {
      fontSize = getOptimalFontSize(slideElement);
    }

    if (fontSize !== null && fontSize !== Infinity) {
      slideElement.style.fontSize = fontSize + fontSizeUnit;
    }
  }

  function showSlide(index) {
    if (slide !== undefined) {
      slide.classList.remove('rsl-visible');
    }

    // re-assign slide to be pointing to current one
    slide = slides[index];
    fitSlideToViewport(slide);
    slide.classList.add('rsl-visible');
  }

  function processHash() {
    var hash = d.location.hash;

    slideIndex = +hash.replace('#', '') || 0;
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

    groupFontSizes = {};

    // re-assign slide to be pointing to current one
    slide = document.querySelector('.rsl-visible');
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

  function updateNavButtonStates() {
    var prevBtn = d.getElementById('rsl-prev-btn');
    var nextBtn = d.getElementById('rsl-next-btn');

    if (slideIndex === 0) {
      prevBtn.classList.add('inactive');
    } else {
      prevBtn.classList.remove('inactive');
    }

    if (slideIndex === slides.length - 1) {
      nextBtn.classList.add('inactive');
    } else {
      nextBtn.classList.remove('inactive');
    }
  }

  function createNavOverlay() {
    // Create the overlay container
    var overlay = d.createElement('div');
    overlay.id = 'rsl-nav-overlay';

    // Create left arrow button
    var prevBtn = d.createElement('button');
    prevBtn.innerHTML = '←';
    prevBtn.id = 'rsl-prev-btn';
    prevBtn.onclick = function () {
      if (slideIndex > 0) {
        slideIndex -= 1;
        w.location.hash = slideIndex;
      }
    };

    // Create slide counter
    var counter = d.createElement('span');
    counter.id = 'rsl-slide-counter';
    counter.textContent = (slideIndex + 1) + ' / ' + slides.length;

    // Create right arrow button
    var nextBtn = d.createElement('button');
    nextBtn.innerHTML = '→';
    nextBtn.id = 'rsl-next-btn';
    nextBtn.onclick = function () {
      if (slideIndex < slides.length - 1) {
        slideIndex += 1;
        w.location.hash = slideIndex;
      }
    };

    // Append buttons and counter to overlay
    overlay.appendChild(prevBtn);
    overlay.appendChild(counter);
    overlay.appendChild(nextBtn);

    // Append overlay to document body
    d.body.appendChild(overlay);

    // Update counter and button states when hash changes
    w.addEventListener('hashchange', function () {
      counter.textContent = (slideIndex + 1) + ' / ' + slides.length;
      updateNavButtonStates();
    });

    // Set initial button states
    updateNavButtonStates();
  }

  w.onload = function () {
    viewPortWidth = d.documentElement.clientWidth;
    viewPortHeight = d.documentElement.clientHeight;

    slides = d.querySelectorAll('.rsl-slide');

    for (var i = 0, slidesLength = slides.length; i < slidesLength; i += 1) {
      slides[i].classList.remove('rsl-visible');
    }

    processHash();

    createNavOverlay();

    injectSVGs();
  };
})(window, document);
