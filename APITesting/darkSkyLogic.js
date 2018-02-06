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
		"country": "USA",
		"latitude": "30.287144",
		"longitude": "-97.728885"
	},
	{
		"name": "New York",
		"country": "USA",
		"latitude": "40.712775",
		"longitude": "-74.005973"
	},
	{
		"name": "Rio de Janiero",
		"country": "Brazil",
		"latitude": "-22.906847",
		"longitude": "-43.172896"
	},
	{
		"name": "Beijing",
		"country": "China",
		"latitude": "39.9042",
		"longitude": "116.407396"
	},
	{
		"name": "Mexico City",
		"country": "Mexico",
		"latitude": "19.432608",
		"longitude": "-99.133208"
	},
	{
		"name": "Vancouver",
		"country":" Canada",
		"latitude": "49.282729",
		"longitude": "-123.120738"
	},
	{
		"name": "Copenhagen",
		"country":" Denmark",
		"latitude": "55.676097",
		"longitude": "12.568337"
	},
	{
		"name": "Canggu",
		"country": "Bali",
		"latitude": "-8.39217",
		"longitude": "115.083"
	},
	{
		"name": "Munich",
		"country": "Germany",
		"latitude": "48.08",
		"longitude": "11.34"
	},
	{
		"name": "Seoul",
		"country": "South Korea",
		"latitude": "37.34",
		"longitude": "-126.58"
	},
	{
		"name": "Barcelona",
		"country": "Spain",
		"latitude": "41.23",
		"longitude": "2.11"
	},
	{
		"name": "Phuket",
		"country": "Thailand",
		"latitude": "7.5324",
		"longitude": "98.2354"
	},
	{
		"name": "Riga",
		"country": "Latvia",
		"latitude": "56.5656",
		"longitude": "98.2354"
	},
	{
		"name": "Budapest",
		"country": "Hungary",
		"latitude": "47.2933",
		"longitude": "19.0305"
	},
	{
		"name": "Auckland",
		"country": "New Zealand",
		"latitude": "-36.5026",
		"longitude": "174.4424"
	},
	{
		"name": "Porto",
		"country": "Portugal",
		"latitude": "41.94371",
		"longitude": "-8.371903"
	},
	{
		"name": "Bangkok",
		"country": "Thailand",
		"latitude": "13.4509",
		"longitude": "100.2939"
	}
];

var desiredWeather;

var name;
var latitude;
var longitude;

var matchingCities = [];

function matchWeatherType() {

	for (var i = 0; i < cities.length; i++) {

		name = cities[i].name;
		latitude = cities[i].latitude;
		longitude = cities[i].longitude;

		weatherQuery(name, latitude, longitude);

	};	
};

function weatherQuery(name, latitude, longitude) {

	var queryURL = "https://api.darksky.net/forecast/7c1ee8ce08e3d4210e427e13b9b51926/" + latitude + "," + longitude;

	$.ajax({
		url: queryURL,
		method: "GET"
		}).then(function(response){

			if (response.daily.icon === desiredWeather) {
				matchingCities.push(name);
			}

		});
};

// function addToPage() {

// 	console.log("trying to add to page");

// 	console.log(matchingCities);

// 	for (var i = 0; i < 6; i++) {

// 		console.log(matchingCities[i]);

// 		$("#cityList").append("<p>" + matchingCities[i] + "</p>");
// 	}

// };

$("#submitBtn").on("click", function(e) {

	e.preventDefault();

	matchingCities = [];

	desiredWeather = $("#weatherType").val().trim();

	$("#cityList").empty();

	matchWeatherType();

	console.log(matchingCities);

	// addToPage();

})