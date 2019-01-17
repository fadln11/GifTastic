
$(document).ready(function () {

  // Initial event listeners
  $(document).on('click', '#add-topic', addTopic);
  $(document).on('click', '.gif-btn', displayGifs);
  $(document).on('click', '.gif-img', pauseGif);

  // Render initial buttons
  renderButtons();

  // Add topic on 'Enter'
  $('#topic-input').keypress(function (e) {
    if (e.keyCode == 13) {
      addTopic(e);
    }
  });

});


// Vars
// ------------

// Initial array of themes
var themes = [
  "Barrack Obama", "Hillary Clinton",
  "Theresa May", "Nancy Pelosi",
  "Donald Trump", "Angela Merkel",
  "James Comey", "Michael Cohen"
  ];



// Main Logic and Functions
// ------------------------

function displayGifs() {

  $("#gifs-view").empty()

  // In this case, the "this" keyword refers to the button that was clicked
  var topic = $(this).attr("data-name");

  // Constructing a URL to search Giphy for the name of the person who said the quote
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    topic + "&api_key=dc6zaTOxFJmzC&limit=10";

  // Performing our AJAX GET request
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

      var results = response.data;

      for (var i = 0; i < results.length; i++) {

        // Only taking action if the photo has an appropriate rating
        if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
          var gifDiv = $("<div>");
          var rating = results[i].rating;
          var p = $("<p>").text("Rating: " + rating);
          var gifImage = $("<img>");
          gifImage.attr("src", results[i].images.fixed_height.url);

          gifImage.attr("data-state", "animate");
          gifImage.attr("data-animate", results[i].images.fixed_height.url);
          gifImage.attr("data-still", results[i].images.fixed_height_still.url);

          gifImage.addClass('gif-img');

          // Add styling
          p.css('margin-top', '5px');
          gifImage.css('padding', '2px 7px 2 px');

          gifDiv.append(p);
          gifDiv.append(gifImage);

          $("#gifs-view").prepend(gifDiv);
        }

      }
    });
}

// Function for displaying themes
function renderButtons() {

  // Deleting the movies prior to adding new movies
  // (this is necessary otherwise you will have repeat buttons)
  $("#buttons-view").empty();

  // Looping through the array of themes
  for (var i = 0; i < themes.length; i++) {

    // Dynamicaly generating buttons for each topic in the array
    var a = $("<button>");
    a.addClass("gif-btn btn btn-secondary");
    // Adding a data attribute
    a.attr("data-name", themes[i]);
    // Providing the initial button text
    a.text(themes[i]);

    // Add styling
    a.css({
      'margin': '5px',
      'padding': '2px 7px 2 px'
      });

    // Adding the button to the buttons-view div
    $("#buttons-view").append(a);
  }
}


function addTopic(event) {
  event.preventDefault();
  // Get input from the textbox
  var topic = $("#topic-input").val().trim();

  if (topic != '') {
    // Adding topic to themes array
    themes.push(topic);
    // Clear textbox
    $("#topic-input").val('');
    renderButtons();
  }
}




function pauseGif() {
  // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
  var state = $(this).attr("data-state");
  // If the clicked image's state is still, update its src attribute to what its data-animate value is.
  // Then, set the image's data-state to animate
  // Else set src to the data-still value
  if (state === "still") {
    $(this).attr("src", $(this).attr("data-animate"));
    $(this).attr("data-state", "animate");
  } else {
    $(this).attr("src", $(this).attr("data-still"));
    $(this).attr("data-state", "still");
  }

}