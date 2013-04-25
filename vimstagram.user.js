// ==UserScript==
// @name       Vimstagram
// @namespace  http://www.instagram.com/
// @version    0.1
// @description  Enables Vim-style keys on the Instagram timeline.
// @description  j/k: scroll down/up a post
// @description  l:   like the current post
// @match      http://www.instagram.com/
// @match      http://instagram.com/
// @copyright  2013 Eli Wenig <eli@csh.rit.edu>
// ==/UserScript==

var $ = unsafeWindow.jQuery;
var offsets = new Array();
var populate_offsets = function() {
  $('div.timelineItem').each(function() {
		offsets.push($(this).offset().top-40);
	});
	if (offsets.length && obs != null) { obs.disconnect(); obs = null; $(document).ajaxSuccess(populate_offsets); }
}

MutationObserver = unsafeWindow.MutationObserver || unsafeWindow.WebKitMutationObserver;
var obs = new MutationObserver(populate_offsets);
obs.observe(document.body, {subtree: true, childList: true});

$(document).keydown(function(e){
	if (!$.inArray(e.keyCode,(74,75,76)) || unsafeWindow.location.pathname != "/") return;
	var y = $(unsafeWindow).scrollTop()
	var load_y = $('div.timelineLast').offset().top;
	if (e.keyCode == 76) { // like current post
		try {$('a.timelineLikeButton')[$.inArray(y,offsets)].click()}
		catch (TypeError) {}
	}
	
	var doneFlag = 0;
	$.each(offsets,function(i,v) {
		if (doneFlag) return;
		if (e.keyCode == 74) { // scroll down
			if (y < offsets[0]) { $('body').animate({scrollTop:offsets[0]},100); doneFlag = 1; }
			if (y >= v && y < offsets[i+1]) {
				$('body').animate({scrollTop:offsets[i+1]},100);
				doneFlag = 1;
			}
		} else if (e.keyCode == 75) { // scroll up
			if (y <= v && y > offsets[i-1]) {
				$('body').animate({scrollTop:offsets[i-1]},100);
				doneFlag = 1;
			}
		}
	});
	
	setTimeout(function() {if ($(unsafeWindow).scrollTop() + $(unsafeWindow).height() > load_y) {
		$("div.timelineLast").find('a')[0].click()
	}},100);
});
