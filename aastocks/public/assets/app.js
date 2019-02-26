$(document).ready(function () {
  $("#update").on("click", function(event) {
    event.preventDefault();
    console.log('clicked!');
    $.get("/api/update"
    , function() {
      window.location.reload;
      }
    )
  });
})