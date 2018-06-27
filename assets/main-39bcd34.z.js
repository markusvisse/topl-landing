;(function($) {
  var mobileMediaQuery = '(max-width: ' + (window.ub.page.dimensions.mobileMaxWidth || 0) + 'px)';

  function getBreakpointName() {
    var mainPage = pageIsLightbox() ? window.parent : window;
    var breakpointNameFromMediaQuery = mainPage.matchMedia(mobileMediaQuery).matches ? 'mobile' : 'desktop';

    if (window.ub.page.dimensions[breakpointNameFromMediaQuery]) {
      return breakpointNameFromMediaQuery;
    } else {
      // If the breakpoint that matches the current viewport size was not enabled in the builder,
      // return the other breakpoint.
      return breakpointNameFromMediaQuery === 'desktop' ? 'mobile' : 'desktop';
    }
  }

  function getSrc($image, breakpointName, resolution) {
    return $image.attr('data-src-' + breakpointName + '-' + resolution + 'x') || '';
  }

  function getSrcSet($image, breakpointName) {
    if (getSrc($image, breakpointName, 3)) {
      return (
        getSrc($image, breakpointName, 1) + ' 1x, ' +
        getSrc($image, breakpointName, 2) + ' 2x, ' +
        getSrc($image, breakpointName, 3) + ' 3x'
      );
    } else if (getSrc($image, breakpointName, 2)) {
      return (
        getSrc($image, breakpointName, 1) + ' 1x, ' +
        getSrc($image, breakpointName, 2) + ' 2x'
      );
    } else {
      return '';
    }
  }

  function setImageAttributes() {
    var breakpointName = getBreakpointName();

    $('.lp-pom-image img').each(function(index, image) {
      var $image = $(image);

      $image.attr('src', getSrc($image, breakpointName, 1));
      $image.attr('srcset', getSrcSet($image, breakpointName));
    });
  }

  function pageIsLightbox() {
    // The try/catch is necessary to avoid an exception being thrown if the parent is on
    // a different domain - e.g. when in preview.
    try {
      return (
        window.ub &&
        window.ub.page &&
        window.ub.page.usedAs === 'lightbox' &&
        window.parent !== window &&
        window.parent.lp &&
        window.parent.lp.jQuery
      );
    } catch (err) {
      return false;
    }
  };

  $(document).ready(function() {
    // Set image src and srcset initially
    setImageAttributes();

    // Update image src and srcset if the breakpoint changes
    window.matchMedia(mobileMediaQuery).addListener(setImageAttributes);
  });
})(window.lp.jQuery);
