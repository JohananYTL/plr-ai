/*global jQuery, window*/
(function ($) {
  $.fn.embedstagram = function (options) {

    var $this = this,
      next_url = '';

    var settings = $.extend({
      client_id: '',
      username: '',
      hashtag: '',
      count: 20,
      responsive: true,
      load_more: true,
      thumb: 'default',
      theme: 'default'
    }, options);

    settings.hashtag = settings.hashtag.replace('#', '');

    $this
      .addClass('embedstagram')
      .addClass('thumb-' + settings.thumb)
      .addClass('theme-' + settings.theme)
      .append('<ul></ul>')
      .append('<a href="#" id="function-button" class="function-button">Loading..</a>');

    var $photos = $this.find('ul'),
      $button = $this.find('#function-button');

    function resize() {
      if (settings.responsive) {
        var e = $this.width();
        var $photo = $('.photo');
        if (1280 >= e && e > 768) {
          $photo.css({'width': '16.6%', 'padding-bottom': '16.6%'});
        } else if (768 >= e && e > 570) {
          $photo.css({'width': '33.3%', 'padding-bottom': '33.3%'});
        } else if (570 >= e && e > 400) {
          $photo.css({'width': '50%', 'padding-bottom': '50%'});
        } else if (400 > e) {
          $photo.css({'width': '33.3%', 'padding-bottom': '33.3%'});
        } else {
          $photo.css({'width': '20%', 'padding-bottom': '20%'});
        }
      }
    }


    function renderPhotos(data) {
      $.each(data.data, function (i, photo) {
        photo = '<li class="photo"><a href="' + photo.link + '" target="_blank"><img src="' + photo.images.standard_resolution.url + '"></a></li>';

        $photos.append(photo);
        return i <= (settings.count);
      });
    }

    function getUrl(user_id) {
      var modifier;
      if (user_id) {
        modifier = 'users/' + user_id;
      } else if (settings.hashtag) {
        modifier = 'tags/' + settings.hashtag;
      }
      if (next_url) {
        return next_url;
      }
      return 'https://api.instagram.com/v1/' + modifier + '/media/recent/?&client_id=' + settings.client_id + '&count=' + settings.count;
    }

    function getPhotos(user_id) {
      $button.text('Loading..');
      $.ajax({
        type: "GET",
        dataType: 'jsonp',
        url: getUrl(user_id),
        success: function (data) {

          if (data.meta.error_message) {
            var error_message = 'Error: ' + data.meta.error_message.toLowerCase();
            $button.text(error_message).addClass('error');
            return false;
          }

          if (!settings.load_more) {
            $this.addClass('hide-load-more');
          }
          $button.text('Load More');
          renderPhotos(data);
          next_url = data.pagination.next_url;
          if (!next_url) {
            $button.text('No more images').addClass('disabled');
          }
          resize();
        },
        error: function () {
          $button.text('Error: unknown').addClass('error');
        }
      });
    }

    if (settings.username) {
      $.ajax({
        type: "GET",
        dataType: 'jsonp',
        url: 'https://api.instagram.com/v1/users/search?q=' + settings.username + '&client_id=' + settings.client_id,
        success: function (data) {

          if (data.meta.error_message) {
            var error_message = 'Error: ' + data.meta.error_message.toLowerCase();
            $button.text(error_message).addClass('error');
            return false;
          }

          if (data.data.length) {

            var num_items = data.data.length - 1;
            $.each(data.data, function (i, user) {
              if (settings.username === user.username) {
                var user_id = user.id;
                getPhotos(user_id);
                return false;
              }
              if (i === num_items) {
                $button.text('Error: no users found').addClass('error');
              }
            });

          } else {
            $button.text('Error: no users found').addClass('error');
          }
        },
        error: function () {
          $button.text('Error: unknown').addClass('error');
        }
      });
    } else if (settings.hashtag) {
      getPhotos();
    } else {
      $button.text('Error: missing username or hashtag').addClass('error');
    }

    $button.click(function (e) {
      e.preventDefault();
      if (!$(this).is('.disabled, .error')) {
        getPhotos();
      }
    });

    $(window).on('load resize', resize);

  };
}(jQuery));