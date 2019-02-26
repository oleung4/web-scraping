$(document).ready(function () {
  $("#update").on("click", function (event) {
    event.preventDefault();
    console.log('clicked!');
    $.get("/api/update", setTimeout(function () {
      window.location = "/";
    }, 1000)
    )
  });
})