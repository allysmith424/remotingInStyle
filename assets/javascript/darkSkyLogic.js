// take weather type inputted

// run 30(?) ajax queries

	// cities stored in an array

		// objects with name, latitude, longitude

	// for loop that runs through array

		// match results with weather type inputted

			// IF match

				// add to list

				// run hotel search for that location

				// run wifi search for that location

				// run picture search for that location

var cities = [
	{
		"name": "Austin",
		"latitude": "30.287144",
		"longitude": "-97.728885"
	},
	{
		"name": "New York",
		"latitude": "40.712775",
		"longitude": "-74.005973"
	},
	{
		"name": "Rio de Janiero",
		"latitude": "-22.906847",
		"longitude": "-43.172896"
	},
	{
		"name": "Beijing",
		"latitude": "39.9042",
		"longitude": "116.407396"
	},
	{
		"name": "Mexico City",
		"latitude": "19.432608",
		"longitude": "-99.133208"
	},
	{
		"name": "Vancouver",
		"latitude": "49.282729",
		"longitude": "-123.120738"
	},
	{
		"name": "Copenhagen",
		"latitude": "55.676097",
		"longitude": "12.568337"
	}
];

var desiredWeather;

var name;
var latitude;
var longitude;

function weatherQuery(name) {

	var queryURL = "https://api.darksky.net/forecast/7c1ee8ce08e3d4210e427e13b9b51926/" + latitude + "," + longitude;

	$.ajax({
		url: queryURL,
		method: "GET"
		}).then(function(response){

			if (response.daily.icon === desiredWeather) {
				var matchingCity = $("<p>");
				matchingCity.append(name);
				$("#cityList").append(matchingCity);
			}

		});
}

function matchWeatherType() {

	for (var i = 0; i < cities.length; i++) {

		name = cities[i].name;
		latitude = cities[i].latitude;
		longitude = cities[i].longitude;

		weatherQuery(name);

	};	
};

$("#submitBtn").on("click", function(e) {

	e.preventDefault();

	desiredWeather = $("#weatherType").val().trim();

	$("#cityList").empty();

	matchWeatherType();

})