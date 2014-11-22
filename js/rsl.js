(function (w, d) {
	var slides,
		slide,
		slideIndex;

	var initialFontSize = 1,
		initialFontUnit = 'rem';

	function showSlide(index) {
		if (slide !== undefined) {
			slide.style.display = 'none';
		}

		slide = slides[index];

		initialFontSize = 1;

		d.body.style.fontSize = initialFontSize + initialFontUnit;

		slide.style.display = '';

		var w = d.documentElement.clientWidth;
		console.log('w', w);

		var h = d.documentElement.clientHeight;
		console.log('h', h);

		var sw = slide.offsetWidth;
		console.log('sw', sw);

		var sh = slide.offsetHeight;
		console.log('sh', sh);

		var bodyPadding = (w - sw) / 2;
		var totalHeight = h - (bodyPadding * 2);

		while (true) {
			initialFontSize += 1;
			d.body.style.fontSize = initialFontSize + initialFontUnit;

			if (totalHeight < slide.offsetHeight || sw < slide.offsetWidth) {
				initialFontSize -= 1;
				d.body.style.fontSize = initialFontSize + initialFontUnit;
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
