// run weatherQuery for that city

// populate DOM with day icons, high temp, low temp

var hotelCounter = 0;

var currentCity = "San Francsico";

var latitude = "37.7749"
var longitude = "-122.4194";

function findForecast(latitude, longitude) {

	$("#weather-stats").empty();

	var queryURL = "https://api.darksky.net/forecast/7c1ee8ce08e3d4210e427e13b9b51926/" + latitude + "," + longitude;

	$.ajax({
		url: queryURL,
		method: "GET"
		}).then(function(response) {

		for (var i = 0; i < 8; i++) {

			var weatherDay = $("<div>");
			weatherDay.addClass("weather-day");

			var dayAndDate = $("<p>");
			dayAndDate.addClass("day-and-date");
			var day = $("<span>");
			day.addClass("day");
				if (i === 0) {
					day.append("Today<br>");
				}
				else if (i === 1) {
					day.append("Tomorrow<br>");
				}
				else {
					var today = moment();
					today.add(i, "days");
					day.append(today.format("dddd")).append("<br>");
				}
			var date = $("<span>");
			date.addClass("date");
				var today = moment();
				today.add(i, "days");
				date.append(today.format("MMM D"));

			dayAndDate.append(day, date)

			var dailyWeatherImage = $("<img>");
			// if (response.daily.data[i].icon)
			// dailyWeatherImage.addClass("daily-weather-image");

			var temperatures = $("<p>");
			temperatures.addClass("temperatures");
			var tempHigh = $("<span>");
			tempHigh.addClass("temp-high");
			tempHigh.append(Math.round(response.daily.data[i].temperatureHigh)).append(" / ");
			var tempLow = $("<span>");
			tempLow.addClass("temp-low");
			tempLow.append(Math.round(response.daily.data[i].temperatureLow));

			temperatures.append(tempHigh, tempLow);

			weatherDay.append(dayAndDate, dailyWeatherImage, temperatures);

			$("#weather-stats").append(weatherDay);

		}


		});

};

function loadHotels(latitude, longitude) {

	var queryURL = "https://api.sandbox.amadeus.com/v1.2/hotels/search-circle?apikey=iD5zJSk96ckruurDP9FraQIVA5ROplcG&latitude=" + latitude + "&longitude=" + longitude + "&radius=40&check_in=2018-02-10&check_out=2018-02-11&number_of_results=5";

	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response) {

		$("#main-content").append("<div class='pure-u-1-5'>&nbsp;</div>");

		var hotelDiv = $("<div>");
		hotelDiv.attr("id", "hotel-div").addClass("pure-u-3-5");

		var img = $("<img>");
		img.attr("src", "assets/images/hotel.png");
		img.addClass("hotel-image");

		var hotelInfo = $("<div>");
		hotelInfo.addClass("hotel-info");

		var hotelName = $("<h4>");
		hotelName.text(response.results[hotelCounter].property_name);

		var hotelAddress = $("<p>");
		hotelAddress.addClass("hotel-address").append(response.results[hotelCounter].address.line1).append("<br>").append(response.results[hotelCounter].address.city).append("<br>").append(response.results[hotelCounter].address.postal_code);

		var hotelWebsite = $("<p>");
		var hotelLink = $("<a>");
		var link = response.results[hotelCounter]._links.href;
		console.log(link);
		hotelLink.attr("href", link);

		hotelLink.text("Website");
		hotelWebsite.append(hotelLink);

		hotelInfo.append(hotelName, hotelAddress, hotelWebsite);

		var nextBtn = $("<button>");
		nextBtn.addClass("next-btn").text("next");

		hotelDiv.append(img, hotelInfo, nextBtn);

		$("#main-content").append(hotelDiv);

		$("#main-content").append("<div class='pure-u-1-5'>&nbsp;</div>");

	});

};

$(document).ready(function() {

	$(".hotel-options").on("click", function() {

		$("#main-content").empty();

		loadHotels(latitude, longitude);

	});

	findForecast(latitude, longitude);

});
