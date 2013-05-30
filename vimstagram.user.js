// ==UserScript==
// @name       Vimstagram
// @namespace  http://www.instagram.com/
// @version    1.0
// @description  Enables Vim-style keys on the Instagram timeline.
// @description  j/k: scroll down/up a post
// @description  l:   like the current post
// @match      http://www.instagram.com/
// @match      http://instagram.com/
// @copyright  2013 Eli Wenig <eli@csh.rit.edu>
// ==/UserScript==

var $ = unsafeWindow.jQuery;
var offsets;
var state = -1;
var scrolled = 0;

var populate_offsets = function() { // grab the offsets of all timeline elements
  offsets = new Array();
  $('div.timelineItem').each(function() {
    offsets.push($(this).offset().top-40);
  });
}

var adjust_state = function() { // all adjustments to `state` should only happen in this function
  var scroll = $(unsafeWindow).scrollTop();
  while (scroll < offsets[state]) state--;
  while (scroll >= offsets[state+1]) state++;
}

var load_more = function() { // load more 
  if ($(unsafeWindow).scrollTop() + $(unsafeWindow).height() > $('div.timelineLast').offset().top) {
    $("div.timelineLast").find('a')[0].click();
  }
}

var on_scroll = function() { // touch the 'scrolled' flag
  if (!scrolled) scrolled = 1;
}

MutationObserver = unsafeWindow.MutationObserver || unsafeWindow.WebKitMutationObserver;
var obs = new MutationObserver(populate_offsets);
obs.observe(document.body, {subtree: true, childList: true});

$(document).scroll(on_scroll);

$(document).keydown(function(e){
  if ($.inArray(e.keyCode,[74,75,76]) == -1 || unsafeWindow.location.pathname != "/" || $(":focus").prop("tagName") == "INPUT") return;
  if (scrolled) adjust_state();
  var y = $(unsafeWindow).scrollTop();
  console.log(y,state);
  if (e.keyCode == 76) { // like current post
    if ((i = $.inArray(y,offsets)) != -1) $('a.timelineLikeButton')[i].click();
  }
  
  if (e.keyCode == 74) $('body').animate({scrollTop:offsets[state+1]},100); // scroll down
  else if (e.keyCode == 75) $('body').animate({scrollTop:offsets[(y == offsets[state] && state != 0) ? state-1 : state]},100); // scroll up
  
  scrolled = 0;
  setTimeout(load_more,150);
});
