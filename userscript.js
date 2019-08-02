// ==UserScript==
// @name         Seller Contact
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tiny improvements to the seller contact page
// @author       Tuni-Soft
// @match        https://addons.prestashop.com/*/seller-contact.php*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jQuery-linkify/2.1.8/linkify.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jQuery-linkify/2.1.8/linkify-jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var isLoadingThread = false;
  var requestedThread = false;

  if (/\?ict=\d+/.test(location.search)) {
    isLoadingThread = true;
  }

  $(document).ajaxComplete(function(event, xhr, settings) {

    // threads list loaded
    if (settings.data && settings.data.includes("action=getThreads")) {
      if($('.list li>a').length > 1) {
        if ($('.list .unread:last').length) {
          if (!isLoadingThread && !requestedThread) {
            $('.list .unread:last').trigger("click", ["triggered"]);
          }
        }
      }
      isLoadingThread = false;
      requestedThread = false;
    }

    // thread loaded
    if (settings.url && settings.url.includes("action=getThread&")) {
      window.editor.focus();
      window.editor.setSelection(0, window.editor.getLength());
      stickyHeader();
      scrollToLastMessage();
      linkify();
    }

  });

  $('a[href*="ict="]').on('click', function(e, data){
    var a = $(this);
    var id_thread = a.data('id-thread');
    var link = `https://addons.prestashop.com/${iso_lang}/seller-contact.php?ict=${id_thread}`;
    location.href = link;
    if (data !== 'triggered') {
      requestedThread = true;
    }
  });

  function stickyHeader() {
    $('li.thread-details').css({
      position: "fixed",
      top: 55,
      right: 0,
      zIndex: 1,
      maxWidth: "calc(100% - 250px)",
    });
  }

  function scrollToLastMessage() {
    var parent = $('.list-panel');
    var lastMessage = $('[rv-class="message.from"]:last');
    parent.scrollTop(parent.scrollTop() + lastMessage.position().top - 100);
  }

  function linkify() {
    if (typeof $.fn.linkify === "function") {
      $('.list-panel').linkify({
        target: "_blank",
        linkClass: "blue",
      });
    }
  }
})();
