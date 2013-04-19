(function($) {

  $.fn.likeBtn = function() {
    $(this).each(function() {
      var $el = $(this);
      var url = $el.data('url'),
          $indicator, $innerBtn, $heart;

      var hoverTimer;

      function createBtn(data) {
        $indicator = $('<div class="like-btn-indicator"></div>');
        $innerBtn = $('<div class="like-btn"></div>');
        $heart = $('<div class="like-btn-heart">&hearts;</div>');
        $indicator.appendTo($innerBtn);
        $innerBtn.append($heart);
        $el.append($innerBtn);
        updateCountLiked(data);
        $innerBtn.on('click', clickBtn);
        $innerBtn.hover(function() {
          console.log('Hovering');
          hoverTimer = window.setTimeout(clickBtn, 800);
        }, function() {
          console.log('Cancelled');
          try {
            clearTimeout(hoverTimer);
          } catch (err) {}
        });
      }

      function updateCountLiked(data) {
        if (data.liked) {
          $innerBtn.addClass('user-liked');
        }
        $indicator.text(+data.likes);
      }

      function clickBtn() {
        $.ajax({
          url: '/like/?url=' + encodeURI(url),
          type: 'POST',
          success: updateCountLiked
        })
      }

      $.ajax({
        url: '/like/?url=' + encodeURI(url),
        success: function(result) {
          createBtn(result);
        }
      });
    });
  }

  $(document).ready(function() {

    var $els = $('.outline-like-btn');
    $els.likeBtn();

  });

})(jQuery)
