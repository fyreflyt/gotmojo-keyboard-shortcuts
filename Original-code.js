$(document).keyup(function(e) {
  if (e.keyCode === 27) {
    $(".a-icon-close")
      .closest("button")
      .click();
  }
});
$(window).bind("keydown", function(event) {
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case "s":
        event.preventDefault();
        $(".a-button--save").click();
        break;
    }
  }
});

jQuery(".a-icon-images")
  .closest("button")
  .bind("click", function() {
    setTimeout(function() {
      jQuery(".resource-items-container").css("flex-flow", "row wrap-reverse");
    }, 50);
  });

// Adds a left pointing triangle to the current page in the Pages Dialog
jQuery(".a-icon-pages")
  .closest("button")
  .bind("click", function() {
    var bk_pagename = $(".breadcrumb-item:first-child").text();

    setTimeout(function() {
      jQuery(".a-table__cell-name>a:contains(" + bk_pagename + ")").append(
        "\u25C0"
      );
    }, 50);
  });
