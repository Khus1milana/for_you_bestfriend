$(function() {
  var book = $('.bk-book');
  var bookBlock = $('.bb-bookblock');
  
  // Создаем 3D состояния книги
  var bookDefault = function() {
    book.data({ opened: false, flip: false })
        .removeClass('bk-viewback bk-viewinside')
        .addClass('bk-bookdefault');
  };
  
  var bookInside = function() {
    book.data({ opened: true, flip: false })
        .removeClass('bk-viewback bk-bookdefault')
        .addClass('bk-viewinside');
  };
  
  var bookBack = function() {
    book.data({ opened: false, flip: true })
        .removeClass('bk-viewinside bk-bookdefault')
        .addClass('bk-viewback');
  };

  // Инициализируем книгу в закрытом виде
  bookDefault();

  // Клонируем BookBlock для задней обложки (нужно для корректной работы 3D библиотеки)
  var backCover = bookBlock.parents('.bk-book').find('.bk-cover-back');
  var backCoverBookBlock = bookBlock.clone();
  backCoverBookBlock.appendTo(backCover);

  var bookBlockFirst = function() {
    bookBlock.bookblock('first');
    backCoverBookBlock.bookblock('first');
  };
  
  var bookBlockLast = function() {
    bookBlock.bookblock('last');
    backCoverBookBlock.bookblock('last');
  };

  var bookBlockLastIndex = bookBlock.children().length - 1;

  // Логика перелистывания ВПЕРЕД
  var bookBlockNext = function() {
    if (book.data('flip')) {
      return bookDefault();
    }
    if (!book.data('opened')) {
      return bookInside();
    }
    // Если мы на последней странице — закрываем книгу и показываем задник
    if (bookBlock.find('.bb-item:visible').index() === bookBlockLastIndex) {
      bookBack();
      bookBlockFirst();
      return;
    }
    bookBlock.bookblock('next');
    backCoverBookBlock.bookblock('next');
  };

  // Логика перелистывания НАЗАД
  var bookBlockPrev = function() {
    if (book.data('flip')) {
      bookBlockLast();
      bookInside();
      return;
    }
    if (!book.data('opened')) {
      return bookBack();
    }
    if (bookBlock.find('.bb-item:visible').index() === 0) {
      return bookDefault();
    }
    bookBlock.bookblock('prev');
    backCoverBookBlock.bookblock('prev');
  };

  // Инициализация плагина BookBlock
  bookBlock.bookblock({
    speed: 700,
    shadow: true
  });
  backCoverBookBlock.bookblock({
    speed: 700,
    shadow: false
  });

  // ГЛАВНОЕ: Клик по самой обложке или страницам для автопереворота
  book.on('click', function(event) {
    // Предотвращаем баги, если кликнули по текстовым ссылкам внутри (если они будут)
    if ($(event.target).is('a')) return true;

    // Если кликнули по задней обложке — листаем назад, иначе — вперед
    if ($(event.target).parents('.bk-cover-back').length > 0) {
      bookBlockPrev();
    } else {
      bookBlockNext();
    }
    return false;
  });

  // Закрывать журнал, если кликнули в любое пустое место экрана
  $('html').on('click', function(event) {
    if ($(event.target).parents('.bk-book').length === 0) {
      bookDefault();
    }
  });

  // Управление стрелочками на клавиатуре (опционально, пусть будет)
  $(document).keydown(function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 37) { // Стрелка влево
      bookBlockPrev();
    } else if (keyCode === 39) { // Стрелка вправо
      bookBlockNext();
    }
  });
});
