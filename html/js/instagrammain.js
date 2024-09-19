$(document).ready(function () {

  $('#embedstagram').embedstagram({
    client_id: '6f3244d01df94bb98785d04861561307',
   	//username: 'ytlhotels',
    hashtag: 'pangkorlautresort',
    count: 12,
    theme: 'light',
  });

  $('#thumb a').click(function (e) {
    e.preventDefault();
    var href = $(this).attr('href');

    $('.embedstagram, body').removeClass('thumb-default thumb-border thumb-tile thumb-circle');
    $('.embedstagram, body').addClass(href);
  });

  $('#theme a').click(function (e) {
    e.preventDefault();
    var href = $(this).attr('href');

    $('.embedstagram, body').removeClass('theme-default theme-light theme-dark');
    $('.embedstagram, body').addClass(href);
  });

});