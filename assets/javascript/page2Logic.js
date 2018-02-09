// run weatherQuery for that city

// populate DOM with day icons, high temp, low temp

var currentCity = "San Francisco";

var latitude = "37.7749"
var longitude = "-122.4194";

var documentWidth = $(document).width();
var documentHeight = $(document).height();
var imageWidth = .6 * documentWidth;
var imageHeight = .4 * documentHeight;

var playingImageSlideshow = 0;

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

function playImageSlideshow() {
	$("#images").empty();
	setTimeout(function() {
		var date = new Date();
		$("#images").append("<img class = 'display-none' id = '" + "img-" + 0 + "' src = 'https://source.unsplash.com/" + imageWidth + "x" + imageHeight + "/?" + currentCity + "/?" + date.getTime() + "'>");
	}, 100);
	setTimeout(function() {
		var date = new Date();
		$("#images").append("<img class = 'display-none' id = '" + "img-" + 1 + "' src = 'https://source.unsplash.com/" + imageWidth + "x" + imageHeight + "/?" + currentCity + "/?" + date.getTime() + "'>");
	}, 200);
	setTimeout(function() {
		var date = new Date();
		$("#images").append("<img class = 'display-none' id = '" + "img-" + 2 + "' src = 'https://source.unsplash.com/" + imageWidth + "x" + imageHeight + "/?" + currentCity + "/?" + date.getTime() + "'>");
	}, 300);

	var j = 0;
	var slideshow = setInterval(function(){
		if(playingImageSlideshow !== 1)
			clearInterval(slideshow);
		var image = $("#img-" + j);
		image.removeClass("display-none");
		image.addClass("display-block");
		image.addClass("fadeIn");
		setTimeout(function(){
			image.addClass("fadeOut");
			var date = new Date();
			$("#images").append("<img class = 'display-none' id = '" + "img-" + j + "' src = 'https://source.unsplash.com/" + imageWidth + "x" + imageHeight + "/?" + currentCity + "/?" + date.getTime() + "'>");
			j = (j + 1) % 3;
		}, 6500);
		setTimeout(function(){
			image.remove();
		}, 8500);
	}, 9000);
} 

$(document).ready(function() {
	$(".city").text(currentCity);
	$("body").css("background-image", "url('https://source.unsplash.com/" + documentWidth + "x" + documentHeight + "/?" + currentCity + "')");
	
	$(document).on("click", ".info", function(){
		var value = $(this).attr("value");
		$("#main-content").removeClass("display-none");
		$(".content").addClass("display-none");
		$("#" + value).removeClass("display-none");
		if(value === "slideshow") {
			playingImageSlideshow = 1;
			playImageSlideshow();
		}
		else {
			playingImageSlideshow = 0;
		}
	})

	$(document).on("click", "#close-button", function(){
		$("#main-content").addClass("display-none");
		$(".content").addClass("display-none");
		playingImageSlideshow = 0;
	})

	findForecast(latitude, longitude);

});
