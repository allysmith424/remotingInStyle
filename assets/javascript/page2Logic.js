// run weatherQuery for that city

// populate DOM with day icons, high temp, low temp

var hotelCounter = 0;

var currentCity = "San Francsico";

var latitude = "37.7749"
var longitude = "-122.4194";

//calculates dimensions for images in slideshow
var documentWidth = $(document).width();
var documentHeight = $(document).height();
var imageWidth = .6 * documentWidth;
var imageHeight = .4 * documentHeight;

//switch to turn off setInterval function that plays image slideshow
var playingImageSlideshow = 0;

//gets today's date and the date eight days from now (used to limit user input in event form)
var today = new Date();
var todaymm = today.getMonth() + 1;
var todaydd = today.getDate();
var todayyy = today.getFullYear();
var beginning = todaymm + "/" + todaydd + "/" + todayyy;

var eightDaysFromToday = new Date();
eightDaysFromToday.setDate(eightDaysFromToday.getDate() + 8);
var endmm = eightDaysFromToday.getMonth() + 1;
var enddd = eightDaysFromToday.getDate();
var endyy = eightDaysFromToday.getFullYear();
var end = endmm + "/" + enddd + "/" + endyy;

//eventfulAPIKey
var eventfulKey = "6MjJmgvxws8Mw9hz";

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

//Limits dates user can select in event form
$(function() {
	$('[data-toggle="datepicker"]').datepicker({
		startDate: beginning,
		endDate: end
	});
});

//Collects user's inputs in the event form
function parseEventForm(){
	var startTemp = beginning;
	var endTemp = end;

	$("#start-date").focus(function(){
		$("#start-date").blur();
	});
	$("#end-date").focus(function(){
		$("#end-date").blur();
	});

	$(document).on("click", "#submit-event-form", function(){
		event.preventDefault();
		$("#date-validation").addClass("display-none");
		$("#date-order-validation").addClass("display-none");
		$("#category-validation").addClass("display-none");
		var startDate = $("#start-date").val().trim();
		var endDate = $("#end-date").val().trim();
		var categoriesString = "";
		var eventfulDate = convertToEventfulDateFormat(startDate) + "-" + convertToEventfulDateFormat(endDate);

		$("#event-form input:checkbox").each(function(){
			if($(this).is(":checked")){
				if(categoriesString === "")
					categoriesString = $(this).attr("id");
				else
					categoriesString = categoriesString + "+" + $(this).attr("id");
			}
		});

		if(startDate === "" || endDate === "")
			$("#date-validation").removeClass("display-none");
		else if (categoriesString === "")
			$("#category-validation").removeClass("display-none");
		else if (verifyDateOrder(startDate, endDate) === false)
			$("#date-order-validation").removeClass("display-none");
		else {
			$("#start-date").val("");
			$("#end-date").val("");
			$("#event-form input:checkbox").each(function(){
				if($(this).is(":checked")){
					$(this).prop("checked", false);
				}
			});
			
			$.ajax({
				url: "https://api.eventful.com/json/events/search?app_key=" + eventfulKey + 
				"&date=" + eventfulDate + "&c=" + categoriesString + "&l=" + currentCity,
				jsonpCallback: "callback",
				dataType: "JSONP",
				method: "GET"  
			}).then(function(response){
				console.log(response.events.event);
			});
		}
	});
}

//Verifies that start date is before end date
function verifyDateOrder(start, end){
	var startYear = parseInt(start.substr(6, 4));
	var startMonth = parseInt(start.substr(3, 2));
	var startDay = parseInt(start.substr(0, 2));
	var endYear = parseInt(end.substr(6, 4));
	var endMonth = parseInt(end.substr(3, 2));
	var endDay = parseInt(end.substr(0, 2));

	if(startYear > endYear)
		return false;
	else if(startYear < endYear)
		return true;
	else if(startMonth > endMonth)
		return false;
	else if(startMonth < endMonth)
		return true;
	else if(startDay > endDay)
		return false;
	else
		return true;
}

//Converts input to proper date format required by Eventful API
function convertToEventfulDateFormat(dateString){
	var day;
	var month;
	var year;
	day = dateString.substr(0, 2);
	month = dateString.substr(3, 2);
	year = dateString.substr(6, 4);
	return year + month + day + "00";
}

function loadHotels(latitude, longitude) {

	var queryURL = "https://api.sandbox.amadeus.com/v1.2/hotels/search-circle?apikey=iD5zJSk96ckruurDP9FraQIVA5ROplcG&latitude=" + latitude + "&longitude=" + longitude + "&radius=40&check_in=2018-02-10&check_out=2018-02-11&number_of_results=5";

	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response) {

		$(".hotel-name").text(response.results[hotelCounter].property_name);

		$(".hotel-address").append(response.results[hotelCounter].address.line1).append("<br>").append(response.results[hotelCounter].address.city).append("<br>").append(response.results[hotelCounter].address.postal_code);

		$(".hotel-website").append("<a href='" + response.results[hotelCounter]._links.href + "'>Website</a>");

	});

};

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

		if(value === "events") {
			parseEventForm();
		}
		if (value === "hotels") {
			$(".hotel-choices").empty();
			loadHotels(latitude, longitude);
		}
	});

	$(document).on("click", "#next-btn", function() {



	});

	$(document).on("click", "#close-button", function(){
		$("#main-content").addClass("display-none");
		$(".content").addClass("display-none");
		playingImageSlideshow = 0;
	});

	findForecast(latitude, longitude);

});
