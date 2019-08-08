// ==UserScript==
// @name     Mojo Workflow enhancements
// @description  Fixes some rough edges in Mojo and improves the workflow - by Mike Cordeiro
// @version  1.3.5
// @grant    none
// @match 	 *://admin.gotmojo.com/conjure2/*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require  https://media.thanedirect.com/js/jquery-clickout-min.js
// @downloadURL https://github.com/fyreflyt/gotmojo-keyboard-shortcuts/raw/master/mojo-userscript.user.js
// ==/UserScript==

/* Set jQuery to noConflict mode, allowing us to use the $ */
this.$ = this.jQuery = jQuery.noConflict(true);

// Function to reverse the order of child elements ex: $('#con').reverseChildren();
$.fn.reverseChildren = function() {
  return this.each(function() {
    var $this = $(this);
    $this.children().each(function() {
      $this.prepend(this);
    });
  });
};

// Extend jquery to search for attributes that start with a string. ex: $('a:attrStartsWith("data-v-")'); finds <div class="data-v-123198">
jQuery.extend(jQuery.expr[":"], {
  attrStartsWith: function(el, _, b) {
    for (var i = 0, atts = el.attributes, n = atts.length; i < n; i++) {
      if (atts[i].nodeName.toLowerCase().indexOf(b[3].toLowerCase()) === 0) {
        return true;
      }
    }
    return false;
  }
});

// Add a pseudo function that behaves like :contain, but searchs for an exact match. Ex: $('p:textEquals("Hello World")');
// https://stackoverflow.com/questions/15364298/select-element-by-exact-match-of-its-content
$.expr[":"].textEquals = function(el, i, m) {
  var searchText = m[3];
  var match = $(el)
    .text()
    .trim()
    .match("^" + searchText + "$");
  return match && match.length > 0;
};

//http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/* Keyboard Shortcut reference. Future work. */
$(
  '<button type="button" class="a-button-icon" title="Not ready yet"><span class="a-button__container"><span class="a-button__text"></span><i class="fa fa-keyboard-o" aria-hidden="true" style="font-size: 22px;"></i></span></button>'
).insertBefore(".a-button--second");

/* Keyboard Shortcuts */

jQuery(document).keyup(function(e) {
  // Esc key to close windows
  if (e.keyCode === 27) {
    jQuery(".a-icon-close")
      .closest("button")
      .click();
  }
});

$(window).bind("keydown", function(event) {
  if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
    switch (String.fromCharCode(event.which)) {
      case "Z":
        event.preventDefault();
        $(".a-button-icon[title='Redo']").click(); // Ctrl/Cmd-Shift-Z to Redo
        break;
    }
  } else if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case "s":
        event.preventDefault();
        $(".a-button--save").click(); // Ctrl/Cmd-S to Save
        break;
      case "e":
        event.preventDefault();
        $(".a-button--second").click(); // Ctrl/Cmd-P to Preview
        break;
      case "1":
        event.preventDefault();
        $(".a-button-icon--view[title='Mobile View']").click(); // Ctrl/Cmd-1-5 to view Mobile through Large Desktop View
        break;
      case "2":
        event.preventDefault();
        $(".a-button-icon--view[title='Tablet View']").click();
        break;
      case "3":
        event.preventDefault();
        $(".a-button-icon--view[title='Desktop View']").click();
        break;
      case "4":
        event.preventDefault();
        $(".a-button-icon--view[title='Large Desktop View']").click();
        break;
      case "5":
        event.preventDefault();
        $(".a-button-icon--view[title='Extra Large Desktop View']").click();
        break;
      case "z":
        event.preventDefault();
        $(".a-button-icon[title='Undo']").click(); // Ctrl/Cmd-Z to Undo
        break;
      case "y":
        event.preventDefault();
        $(".a-button-icon[title='Redo']").click(); // Ctrl/Cmd-Y to Redo
        break;
    }
  }
});

/* Detecting when the DOM changes */
var observer = new MutationObserver(function(mutations) {
  for (var i = 0; i < mutations.length; i++) {
    for (var j = 0; j < mutations[i].addedNodes.length; j++) {
      checkNode(mutations[i].addedNodes[j]);
    }
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

/* Watches for a specific node to be added */
checkNode = function(addedNode) {
  if (addedNode.nodeType === 1) {
    if (addedNode.matches(".a-modal")) {
      if (document.querySelector(".resource-items-container") !== null) {
        $(".resource-items-container")
          .attr("id", "resource-items-container")
          .reverseChildren(); // Shows newest images first and adds an id
        $(".a-tabs-nav:contains('User')").append(
          '<form class="a-search-box a-filter-line__search" style="margin-left:auto;"><input type="text" placeholder="Search by image filename" class="a-search-box__field" id="searchImages"><i class="a-icon-search a-search-box__icon"></i></form>'
        ); // Adds a search input to the right in the images dialog

        // Filter function for images.
        $("#searchImages").keyup(
          debounce(function() {
            // Search text
            var text = $(this)
              .val()
              .toLowerCase();

            // Hide all content class element
            $(".resource-item").hide();

            // Search
            $(".resource-item .resource-title").each(function() {
              if (
                $(this)
                  .text()
                  .toLowerCase()
                  .indexOf("" + text + "") != -1
              ) {
                $(this)
                  .closest(".resource-item")
                  .show();
              }
            });
          }, 300)
        ); //search items end
      }

      if (document.querySelector(".a-table") !== null) {
        var bk_pagename = $(".breadcrumb-item:first-child")
          .text()
          .trim();
        $(".a-table__cell-name>a:textEquals(" + bk_pagename + ")")
          .attr("id", "current-page")
          .append("\u25C0"); //Adds an indicator to the current page being edited. Needs to be an exact match though.
        $("#current-page")
          .parent()[0]
          .scrollIntoView({
            // Scrolls current page into view in modal.
            behavior: "instant", // or "auto" or "instant"
            block: "start" // or "end"
          });
      }
    } else if (addedNode.matches(".a-modal-item")) {
      if (document.querySelector(".color-picker") !== null) {
        console.log("color picker opened");
      }
      console.log("item modal opened");
    } /* else if (addedNode.matches(".a-modal-item .color-picker")) {

      $(".color-picker").clickout(function() {
        console.log("you clicked");
        $(".color-picker")
          .prev(".input-group")
          .find(".form-input")
          .click();
      });
      // $(document).click(function(e) {
      //   var container = $(".color-picker"); // YOUR CONTAINER SELECTOR
      //
      //   if (
      //     !container.is(e.target) && // if the target of the click isn't the container...
      //     container.has(e.target).length === 0
      //   ) {
      //     // ... nor a descendant of the container
      //     console.log("clicked outside");
      // $(".color-picker")
      //   .prev(".input-group")
      //   .find(".form-input")
      //   .click();
      //   }
      // });
      // $(document).click(function(event) {
      //   $target = $(event.target);
      //   if (
      //     !$target.closest(".color-picker").length &&
      //     $(".color-picker").is(":visible")
      //   ) {
      //     $('.input-group .form-input[placeholder="#Color"]').click();
      //     $(".color-picker").prev('.input-group').find('.form-input').click();
      //   }
      // });
    } */
  }
};

// $('.form-input[placeholder="#Color"]').click(); -- Step 1 of hiding the colour modal when clicked outside of the box.
