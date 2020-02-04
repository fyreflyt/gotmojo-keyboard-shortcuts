// ==UserScript==
// @name     Mojo Workflow enhancements
// @description  Fixes some rough edges in Mojo and improves the workflow - by Mike Cordeiro
// @version  1.4.6
// @grant    none
// @match 	 *://admin.gotmojo.com/conjure2/*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require  https://media.thanedirect.com/js/jquery-clickout-min.js
// @require  https://media.thanedirect.com/js/keymaster.min.js
// @require  https://media.thanedirect.com/js/push2.min.js
// @require  https://media.thanedirect.com/js/js.cookie-2.2.1.min.js
// @resource customCSS https://media.thanedirect.com/css/userscript.css
// @downloadURL https://github.com/fyreflyt/gotmojo-keyboard-shortcuts/raw/master/mojo-userscript.user.js
// ==/UserScript==

// var newCSS = GM_getResourceText("customCSS");
// GM_addStyle(newCSS);

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

// Add a pseudo function that finds empty elements with :blank. Ex: $('.thumbnails:blank').addClass('selected');
// https://stackoverflow.com/questions/14198957/jquery-selector-for-a-empty-div
$.expr[":"].blank = function(obj) {
  return obj.innerHTML.trim().length === 0;
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

// Simulates a mouseclick https://stackoverflow.com/questions/20928915/how-to-get-jquery-triggerclick-to-initiate-a-mouse-click
jQuery.fn.simulateClick = function() {
  return this.each(function() {
    if ("createEvent" in document) {
      var doc = this.ownerDocument,
        evt = doc.createEvent("MouseEvents");
      evt.initMouseEvent(
        "click",
        true,
        true,
        doc.defaultView,
        1,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      this.dispatchEvent(evt);
    } else {
      this.click(); // IE Boss!
    }
  });
};

// Request permission to send notifications about Publish's
Push.Permission.request();

/* Keyboard Shortcut reference. */
$(
  '<button type="button" class="a-button-icon" title="View Keyboard shortcuts"><span class="a-button__container"><span class="a-button__text"></span><i class="fa fa-keyboard-o" aria-hidden="true" style="font-size: 22px;"></i></span></button>'
)
  .insertBefore(".a-button--second")
  .click(function() {
    $("body > div > .conjure-ui:empty").prepend(modal_markup);
  });

var modal_markup = `<div class="a-modal key-shortcuts" id="kbd-shortcuts">
    <div class="a-modal__overlay"></div>
    <div class="a-modal-item is-active a-modal-item--full-screen">
      <div class="a-modal-item__header">
        <p class="a-modal-item__title">Keyboard Shortcuts</p>
        <button type="button" class="a-button-area a-modal-item__close">
          <span class="a-button-area__text">Close modal</span>
          <i class="a-icon-close a-button-area__icon"></i>
        </button>
      </div>
      <div class="a-modal-item__body">
        <div class="columns">
          <div class="column col-12">
            <h3>Keyboard Shortcuts</h3>
            <ul style="column-count: 2;">
              <li>Ctrl/Command-E: Preview</li>
              <li>Ctrl/Command-S: Save</li>
              <li>Ctrl/Command-Z: Undo</li>
              <li>Ctrl/Command-Shift-Z or Ctrl/Command-Y: Redo</li>
              <li>Ctrl/Command-1: Mobile View</li>
              <li>Ctrl/Command-2: Tablet View</li>
              <li>Ctrl/Command-3: Desktop View</li>
              <li>Ctrl/Command-4: Wide View</li>
              <li>Ctrl/Command-5: Ultra Wide View</li>
              <li>Esc key: Close dialog Windows</li>
              <li>Delete/Backspace key: Delete selected element (New with 1.4.1)</li>
            </ul>
            <h3>Workflow Enhancements</h3>
            <ul style="column-count: 2;">
              <li>Images library items are displayed newest to oldest</li>
              <li>Search for images by filename</li>
              <li>Pages Dialog highlights current page with an arrow</li>
              <li>Current page in Pages Dialog is moved to the top of the scrollable window</li>
              <li>Click outside colour picker to dismiss (Beta)</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="a-modal-item__footer">
        <div style="display: inline-block;"></div>
        <button type="button" class="a-button a-button--text a-modal-item__footer-button">
          <span class="a-button__container">
            <span class="a-button__text">Close</span>
          </span>
        </button>
      </div>
    </div>
  </div>`;
$(".conjure-ui").on("click", "#kbd-shortcuts button", function() {
  $("#kbd-shortcuts").remove();
});

/* Keyboard Shortcuts via keymaster.js */

key("esc", function() {
  $(".a-icon-close")
    .closest("button")
    .click();
});
key("ctrl+z, command+z", function() {
  $(".a-button-icon[title='Undo']").click(); // Ctrl/Cmd-Z to Undo
});
key("ctrl+shift+z, command+shift+z, ctrl+y, command+y", function() {
  $(".a-button-icon[title='Redo']").click(); // Ctrl/Cmd-Shift-Z to Redo
});
key("ctrl+s, command+s", function() {
  $(".a-button--save").click(); // Ctrl/Cmd-S to Save
  return false; // Prevents the keystroke from reaching the browser
});
key("ctrl+e, command+e", function() {
  $(".a-button--second").click(); // Ctrl/Cmd-E to Preview
  return false;
});
key("ctrl+1, command+1", function() {
  $(".a-button-icon--view[title='Mobile View']").click(); // Ctrl/Cmd-1-5 to view Mobile through Large Desktop View
  return false;
});
key("ctrl+2, command+2", function() {
  $(".a-button-icon--view[title='Tablet View']").click();
  return false;
});
key("ctrl+3, command+3", function() {
  $(".a-button-icon--view[title='Desktop View']").click();
  return false;
});
key("ctrl+4, command+4", function() {
  $(".a-button-icon--view[title='Large Desktop View']").click();
  return false;
});
key("ctrl+5, command+5", function() {
  $(".a-button-icon--view[title='Extra Large Desktop View']").click();
  return false;
});

/* Detecting when the DOM changes */
var observer = new MutationObserver(function(mutations) {
  for (var i = 0; i < mutations.length; i++) {
    for (var j = 0; j < mutations[i].addedNodes.length; j++) {
      checkNode(mutations[i].addedNodes[j]);
    }
  }
  mutations.forEach(function(mutation) {
    if (mutation.attributeName == "id") {
      console.log(mutation + " changed");
      customHTMLDisplay();
    }
  });
  // Code to detect changes in .page__container id should go here. I think
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true
});


/* Watches for a specific node to be added. Update to use a switch statement? */
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
    // } else if (addedNode.matches(".color-picker")) {
    //   if (document.querySelector(".color-picker") !== null) {
    //     $(".color-picker").clickout(function() {
    //       $(".color-picker")
    //         .prev(".input-group")
    //         .find(".form-input")
    //         .simulateClick("click");
    //       $(this).off("clickout");
    //     });
    //   }
    } else if (addedNode.matches(".conjure-selection-box")) {
      if (
        document.querySelector(".conjure-action-panel") !== null &&
        $(".conjure-action-panel>i.fa-trash") !== null
      ) {
        // console.log("editing element");
        key("delete, backspace", function() {
          $(".conjure-action-panel i.fa-trash")
            .parent()
            .click();
          //  return false;
        });
      } else {
        key.unbind("delete, backspace");
      }
    } else if (addedNode.matches(".notification-wrapper")) {
      if ($(".notification-content:contains('Publish')").length > 0) {
        Push.create("Site published", {
          icon: "./Mojo-Logo-transparent-60w.png"
        });
      } else if (
        $(".notification-content:contains('Template Loaded')").length > 0
      ) {
        templateLoaded();
      }
    } else if (addedNode.matches(".a-tabs__item")) {
      // Remembers which library you last selected and sets it back to that
      if (document.querySelector(".library-header") !== null) {
        if (Cookies.get("selectedLibrary") !== null) {
          var openThisLibrary = Cookies.get("selectedLibrary");
          $(
            ".a-filter-line button.a-dropdown__button:contains('" + openThisLibrary + "')"
          ).click();
        }
        $(".a-filter-line button.a-dropdown__button").click(function() {
          var libraryButtonClicked = $.trim($(this).text());
          Cookies.set("selectedLibrary", libraryButtonClicked);
        });
        $("input.a-search-box__field").focus();
      }
    } else if (addedNode.matches(".a-tabs__item")) {
      // Remembers which library you last selected and sets it back to that
      if (document.querySelector(".library-header") !== null) {
        if (Cookies.get("selectedLibrary") !== null) {
          var openThisLibrary = Cookies.get("selectedLibrary");
          $(
            "button.a-dropdown__button:contains('" + openThisLibrary + "')"
          ).click();
        }
        $("button.a-dropdown__button").click(function() {
          var libraryButtonClicked = $.trim($(this).text());
          Cookies.set("selectedLibrary", libraryButtonClicked);
        });
        $("input.a-search-box__field").focus();
      }
    }
  }
};

// Displays Custom HTML fields by adding a texture to div's with 0 height and sets their height to 50.
function customHTMLDisplay() {
  $(".grid__cell > div").each(function() {
    if ($(this).height() === 0) {
      $(this)

        .css({
          "background-color": "#fff",
          "background-image": `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23bfbfbf' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
          "text-align": "center",
          "min-height": "50px"
        })
        .append("<p>Custom HTML</p>");
    }
  });
}

// Executes functions when the Mojo Template has loaded
function templateLoaded() {
  customHTMLDisplay();
}
// $('footer section').load("https://admin.gotmojo.com/conjure2/editor/preview/2063/31255 .template-footer-global");
