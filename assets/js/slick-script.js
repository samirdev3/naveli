jQuery(document).ready(function () {
  /** project slider */
  jQuery(".project-slide-thumb").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: ".project-slide",
  });
  jQuery(".project-slide").slick({
    autoplay: false,
    autoplaySpeed: 3000,
    dots: false,
    prevArrow: jQuery(".project-arrow ._left"),
    nextArrow: jQuery(".project-arrow ._right"),
    asNavFor: ".project-slide-thumb",
  });
  /** news slider */
  jQuery(".news-slide-thumb").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: ".news-slide",
  });
  jQuery(".news-slide").slick({
    autoplay: false,
    autoplaySpeed: 3000,
    dots: false,
    prevArrow: jQuery(".news-arrow ._left"),
    nextArrow: jQuery(".news-arrow ._right"),
    asNavFor: ".news-slide-thumb",
  });
});
