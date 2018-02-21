$(document).ready(function() {

	$('.fb-share').click(function(e) {
		e.preventDefault();
		window.open($(this).attr('href'), 'fbShareWindow', 'height=450, width=550, top=' + ($(window).height() / 2 - 275) + ', left=' + ($(window).width() / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
		return false;
	});

	$('.tw-share').click(function(e) {
		e.preventDefault();
		window.open($(this).attr('href'), 'twShareWindow', 'height=450, width=650, top=' + ($(window).height() / 2 - 275) + ', left=' + ($(window).width() / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
		return false;
	});

	$('.li-share').click(function(e) {
		e.preventDefault();
		window.open($(this).attr('href'), 'liShareWindow', 'height=650, width=650, top=' + ($(window).height() / 2 - 275) + ', left=' + ($(window).width() / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
		return false;
	});

	var width = 870,
	    height = 750,
	    projection = d3.geo.orthographic()
		    .scale(250)
		    .clipAngle(90),
	    canvas = d3.select("#map-globe").append("canvas")
		    .attr("width", width)
		    .attr("height", height),
	    c = canvas.node().getContext("2d"),
		path = d3.geo.path()
		    .projection(projection)
		    .context(c),
	    title = d3.select("#map-globe-country-title"),
		countries,
		country_names,
		previousCountryId = "USA",
		country_demographics,
		m0,
		o0,
		getCountryGeoObject,
		worldTour,
		moveGlobe;
		
	
	queue()
	    .defer(d3.json, "world-110m.json")
	    .defer(d3.json, "world-countries.json")
	    .defer(d3.json, "ocean.json")
	    .defer(d3.json, "country_demographics.json")
	    .await(ready);

	function ready(error, world, countriesData, ocean, demographics) {
		if (error) throw error;

		var globe = {type: "Sphere"},
		land = topojson.feature(world, world.objects.land),
		ocean = topojson.feature(ocean, ocean.objects.ocean),
		borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
		countries = countriesData.features,
		i = -1,
		n = countries.length;
		country_demographics = demographics;

		worldTour = function() {
			i++;
			d3.transition()
			.duration(1250)
			.each("start", function() {
				title.text(countries[i].properties.name);
			})
			.tween("rotate", function() {
				var p = d3.geo.centroid(countries[i]),
				r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
				return function(t) {
					projection.rotate(r(t));
					c.clearRect(0, 0, width, height);
					c.fillStyle = "#f0f0f0", c.beginPath(), path(land), c.fill();
					c.fillStyle = "#f2f9ff", c.beginPath(), path(ocean), c.fill();
					c.fillStyle = " #62c0fe", c.beginPath(), path(countries[i]), c.fill();
					c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
					c.strokeStyle = "transparent", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
				};
			})
			.transition()
			.each("end", worldTour);
		};
		moveGlobe = function(countryId,noHighlight) {
			var countryObj = getCountryGeoObject(countryId);
			d3.transition()
			.duration(1250)
			.each("start", function() {
				title.text(countryObj.properties.name);
			})
			.tween("rotate", function() {
				var p = d3.geo.centroid(countryObj),
					r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);

				return function(t) {
					projection.rotate(r(t));

					c.clearRect(0, 0, width, height);
					c.fillStyle = "#62c0fe", c.beginPath(), path(land), c.fill();
					c.fillStyle = "#f2f9ff", c.beginPath(), path(ocean), c.fill();
					c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
					c.strokeStyle = "transparent", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
					if(!noHighlight) {
						c.fillStyle = " #c1d82e", c.beginPath(), path(countryObj), c.fill();
					}

				};
			})
			.transition()
			.each("end",null);
		};
		//worldTour();
		
		getCountryGeoObject = function(countryId) {
			//assusmes countries is loaded
			var i=0;
			while (i < countries.length) {
				if(countries[i].id === countryId) {
					return countries[i];
				}
				i++;
			}

		}

		
		changeCountry();

	}


	function savePreviousCountry(countryId) {
		previousCountryId = countryId;
	}

	$(".view-all").click(function() {
		$( "#chart-bottom" ).slideToggle( "slow", function() {
			$(".view-all").toggleClass('open');
		});
	});

	function changeCountry() {
		var currentCountryId = $( ".dd" ).val(),
		i=0;


		if ($( ".dd" ).val() === "clear" ) {
			$(".unselect").css( "background-color", "#f0f0f0" );
			$(".rank").html("");
	    	$(".ceo").html("");
	    	$(".managers").html("");
	    	$(".boards").html("");
	    	$(".policy").html("");
	    	$(".rating").html("");
	    	$(".gendered").html("");
	    	$(".overview").html("");
	    	$(".ff1").html("");
	    	$(".ff2").html("");
	    	$('.show-when-country-set').addClass('hide');
	    	$('#Layer_0 path').attr("style","display:none;");
	    	moveGlobe("USA",true);
		} else {
			while (i < country_demographics.length) {
				var countryObj = country_demographics[i];
				if (currentCountryId === countryObj.id ) {
					$("#fbit").attr("href","https://www.facebook.com/sharer/sharer.php?u=https://powermore.dell.com/gwelscorecard/img/"+countryObj.name+".png")
					$("#tweetit").attr("href","https://twitter.com/home?status=https://powermore.dell.com/gwelscorecard/img/"+countryObj.name+".png")
					$("#linkit").attr("href","https://www.linkedin.com/shareArticle?mini=true&url=https://powermore.dell.com/gwelscorecard/img/"+countryObj.name+".png&title=How%20well%20does%20"+countryObj.name+"%20support%20women%20entrepreneurs?%20Take%20a%20look.&summary=&source=https://powermore.dell.com/gwelscorecard/")
					$(".unselect").css( "background-color", "#f0f0f0" );
					$("#"+countryObj.name).css( "background-color", "#c1d82e" );
					$("#"+countryObj.name).css( "stroke", "#c1d82e" );
					$("#"+countryObj.name).css( "color", "#c1d82e" );

					$(".rank").html(countryObj.rank);
					$(".ceo").html(countryObj.ceo);
					$(".managers").html(countryObj.managers);
					$(".boards").html(countryObj.boards);
					$(".policy").html(countryObj.policy);
					$(".rating").html(countryObj.rating);
					$(".gendered").html(countryObj.gendered);
			    	$(".overview").html(countryObj.overview);
			    	$(".ff1").html(countryObj.ff1);
			    	$(".ff2").html(countryObj.ff2);
					$('#Layer_0 path').attr("style","display:none;");
					$('path[id="O'+countryObj.name+'"]').attr("style","display:inline;stroke:#c1d82e;");
					if(i>8) {
						$( "#chart-bottom" ).slideDown( "slow", function() {
							$(".view-all").addClass('open');
						});
					}
					$('.show-when-country-set').removeClass('hide');
					moveGlobe(currentCountryId);
					savePreviousCountry(currentCountryId);
				}
				i++;
			}
		}


	}

	$(".dd").change(function() {
		changeCountry();
	});

	$(".select-country-row, .change-country").on('click',function(evt){
		$(".dd").val($(evt.currentTarget).attr('rel'));
		changeCountry();
	});

	$(".more-less").click(function() {
		$( ".more-info-box" ).slideToggle( "slow", function() {
			$( ".more-less" ).toggle();
		});
	});

});

