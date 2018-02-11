// run weatherQuery for that city

// populate DOM with day icons, high temp, low temp

var hotelCounter = 0;

var currentCity;
var latitude;
var longitude;

var daysShown = 7;

//calculates dimensions for images in slideshow
var documentWidth = $(document).width();
var documentHeight = $(document).height();
var imageWidth = .5 * documentWidth;
var imageHeight = .4 * documentHeight;

//switch to turn off setInterval function that plays image slideshow
var playingImageSlideshow = 0;
//keeps track of which div is showing
var divOpened = "none";

//gets today's date and the date eight days from now (used to limit user input in event form)
var today = new Date();
var todaymm = today.getMonth() + 1;
var todaydd = today.getDate();
var todayyy = today.getFullYear();
var beginning = todaymm + "/" + todaydd + "/" + todayyy;

var sevenDaysFromToday = new Date();
sevenDaysFromToday.setDate(sevenDaysFromToday.getDate() + daysShown - 1);
var endmm = sevenDaysFromToday.getMonth() + 1;
var enddd = sevenDaysFromToday.getDate();
var endyy = sevenDaysFromToday.getFullYear();
var end = endmm + "/" + enddd + "/" + endyy;

//eventfulAPIKey
var eventfulKey = "6MjJmgvxws8Mw9hz";
var googleMapsKey = "AIzaSyC4wHmmK9UQ73Dt3GhziiwysbQdSS-5cSE";

function findForecast(latitude, longitude) {

	$("#weather-stats").empty();

	var queryURL = "https://api.darksky.net/forecast/7c1ee8ce08e3d4210e427e13b9b51926/" + latitude + "," + longitude;

	$.ajax({
		url: queryURL,
		method: "GET"
		}).then(function(response) {

		for (var i = 0; i < daysShown; i++) {

			var weatherDay = $("<div>");

			if(i + 1 === daysShown)
				weatherDay.addClass("last-weather-day");
			else
				weatherDay.addClass("weather-day");

			var dayAndDate = $("<span>");
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

			var temperatures = $("<span>");
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
		if(playingImageSlideshow !== 1) {
			clearInterval(slideshow);
			return;
		}
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

	$("#event-form").removeClass("display-none");
	$("#validation").empty();

	$("#start-date").focus(function(){
		$("#start-date").blur();
	});
	$("#end-date").focus(function(){
		$("#end-date").blur();
	});

	$(document).on("click", "#submit-event-form", function(){
		event.preventDefault();
		var startDate = $("#start-date").val().trim();
		var endDate = $("#end-date").val().trim();
		var userAddress = $("#address-event-form").val().trim();
		var maximumDistance = $("#maximum-distance").val().trim();
		var categoriesString = "";
		var eventfulDate = convertToEventfulDateFormat(startDate) + "-" + convertToEventfulDateFormat(endDate);
		var queryURL;

		$("#event-form input:checkbox").each(function(){
			if($(this).is(":checked")){
				if(categoriesString === "")
					categoriesString = $(this).attr("id");
				else
					categoriesString = categoriesString + "+" + $(this).attr("id");
			}
		});

		if(startDate === "" || endDate === "")
			$("#validation").text("Please enter a start date and end date");
		else if (categoriesString === "")
			$("#validation").text("Please select at least one category");
		else if (verifyDateOrder(startDate, endDate) === false)
			$("#validation").text("Start date must be on or before end date");
		else if (userAddress !== "" && maximumDistance === "")
			$("#validation").text("Must enter a maximum distance if address is entered");
		else if (maximumDistance !== "" && userAddress === "")
			$("#validation").text("Must enter an address if maximum distance is entered");
		else if(isNaN(maximumDistance) === true || parseInt(maximumDistance) <= 0)
			$("#validation").text("Enter a numeric maximum distance greater than zero");
		else {
			if(userAddress !== "") {
				$.ajax({
					url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + userAddress +
					", " + currentCity + "&key=" + googleMapsKey,
					method: "GET" 
				}).then(function(response){	
					console.log(response);
					if(parseInt(response.results.length) > 0 && !(response.results[0].hasOwnProperty("partial_match"))) {
						var userAddressLatitude = response.results[0].geometry.location.lat;
						var userAddressLongitude = response.results[0].geometry.location.lng;
						queryURL = "https://api.eventful.com/json/events/search?app_key=" + eventfulKey + 
						"&date=" + eventfulDate + "&c=" + categoriesString + "&l=" + currentCity +
						"&page_size=5&sort_order=popularity&where=" + userAddressLatitude + "," + 
						userAddressLongitude + "&within=" + maximumDistance;
						$("#start-date").val("");
						$("#end-date").val("");
						$("#maximum-distance").val("");
						$("#address-event-form").val("");
						$("#event-form input:checkbox").each(function(){
							if($(this).is(":checked"))
								$(this).prop("checked", false);
						});	
						$("#event-form").addClass("display-none");
						populateEvents(queryURL, 1);
					}
					else {
						$("#validation").text("Please enter a valid address");
					}
				});
			}
			else {
				$("#start-date").val("");
				$("#end-date").val("");
				$("#maximum-distance").val("");
				$("#address-event-form").val("");
				$("#event-form input:checkbox").each(function(){
					if($(this).is(":checked")){
						$(this).prop("checked", false);
					}
				});	
				$("#event-form").addClass("display-none");
				queryURL = "https://api.eventful.com/json/events/search?app_key=" + eventfulKey + 
				"&date=" + eventfulDate + "&c=" + categoriesString + "&l=" + currentCity +
				"&page_size=5&sort_order=popularity";
				populateEvents(queryURL, 1);
			}
		}
	});
}

//Populates events div with events
function populateEvents(queryURL, number){
	$("#event-listings").removeClass("display-none");
	$("#back-button").removeClass("display-none");

	$.ajax({
		url: queryURL + "&page_number=" + number,
		jsonpCallback: "callback",
		dataType: "JSONP",
		method: "GET"  
	}).then(function(response){
		var eventArray = response.events.event;
		for(var i = 0; i < eventArray.length; i++) {
			var event = eventArray[i];
			
			var eventDiv = $("<div>");
			eventDiv.addClass("event");
			
			var eventInfoDiv = $("<div>");
			eventInfoDiv.addClass("event-info");
			eventInfoDiv.append("<a target = '_blank' href='" + event.url + "'><p class = 'event-title'>" + event.title + "</p></a>");
			
			var startTime = moment(event.start_time).format('dddd MMM DD, h:mm a');
			eventInfoDiv.append("<p class='event-start-date'>Starts: " + startTime + "</p>");
			eventInfoDiv.append("<p class='event-location'><a target = '_blank' href='" + event.venue_url + "'>" + 
				event.venue_name + "</a> | <a target = '_blank' href='https://www.google.com/maps/search/?api=1&query=" +
				event.latitude + "," + event.longitude + "'>" + event.venue_address + " " + 
				event.city_name + ", " + event.region_abbr + "</a></p>");
			
			eventDiv.append(eventInfoDiv);
			if(i % 2 === 0)
				eventDiv.addClass("event-even");
			else
				eventDiv.addClass("event-odd");
			$("#event-listings").prepend(eventDiv);
		}

		if(parseInt(response.page_number) <= 1)
			$("#left-arrow").addClass("display-none");
		else
			$("#left-arrow").removeClass("display-none");

		if(response.page_number === response.page_count)
			$("#right-arrow").addClass("display-none");
		else
			$("#right-arrow").removeClass("display-none");

		$("#left-arrow").on("click", function(){
			$("#left-arrow").unbind("click");
			$("#right-arrow").unbind("click");
			$(".event").remove();
			populateEvents(queryURL, --number);
		});

		$("#right-arrow").on("click", function(){ 
			$("#left-arrow").unbind("click");
			$("#right-arrow").unbind("click");
			$(".event").remove();
			populateEvents(queryURL, ++number);	
		});
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

	day = dateString.substr(3, 2);
	month = dateString.substr(0, 2);
	year = dateString.substr(6, 4);
	return year + month + day + "00";
}

// finds 5 hotels within 40km of city
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

	currentCity = localStorage.getItem("city");
	latitude = localStorage.getItem("latitude");
	longitude = localStorage.getItem("longitude");

	$(".city").text(currentCity);
	$("body").css("background-image", "url('https://source.unsplash.com/" + documentWidth + "x" + documentHeight + "/?" + currentCity + "')");

	$(document).on("click", ".info", function(){
		var value = $(this).attr("value");
		if(divOpened === value)
			return;
		$("#main-content").removeClass("display-none");
		$(".content").addClass("display-none");
		$(document).off("click", "#submit-event-form");
		$("#left-arrow").unbind("click");
		$("#left-arrow").addClass("display-none");
		$("#right-arrow").unbind("click");
		$("#right-arrow").addClass("display-none");
		divOpened = value;
		$("#" + value).removeClass("display-none");
		
		if(value === "slideshow") {
			playingImageSlideshow = 1;
			playImageSlideshow();
		}
		else {
			playingImageSlideshow = 0;
			$("#images").empty();
		}

		if(value === "events")
			parseEventForm();
		else 
			$(".event").remove();

		if (value === "hotels") {
			$(".hotel-name, .hotel-address, .hotel-website").empty();
			loadHotels(latitude, longitude);
		}
	});

	$(document).on("click", ".next-btn", function(e) {
		e.preventDefault();
		if (hotelCounter < 4) {
			hotelCounter++;
		}
		else {
			hotelCounter = 0;
		}
		$(".hotel-name, .hotel-address, .hotel-website").empty();
		loadHotels(latitude, longitude);
	});

	//Gets rid of all event listeners and clears all elements associated with a ".info" button
	$(document).on("click", "#close-content", function(){
		$("#main-content").addClass("display-none");
		$(".content").addClass("display-none");
		divOpened = "none";
		playingImageSlideshow = 0;
		$("#images").empty();
		$(document).off("click", "#submit-event-form");
		$("#left-arrow").unbind("click");
		$("#left-arrow").addClass("display-none");
		$("#right-arrow").unbind("click");
		$("#right-arrow").addClass("display-none");
		$(".event").remove();
	});

	$(document).on("click", "#log-in", function(){
		$("#login-modal").removeClass("display-none");
	});

	$(document).on("click", "#create-account", function(){
		$("#signup-modal").removeClass("display-none");
	});

	$(document).on("click", "#close-login-modal", function(){
		$("#login-modal").addClass("display-none");
	});

	$(document).on("click", "#close-signup-modal", function(){
		$("#signup-modal").addClass("display-none");
	});

	findForecast(latitude, longitude);

});
