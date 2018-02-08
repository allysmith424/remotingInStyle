// run weatherQuery for that city

// populate DOM with day icons, high temp, low temp

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

$(document).ready(function() {

	findForecast(latitude, longitude);

});
