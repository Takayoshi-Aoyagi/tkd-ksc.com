var app = app || {};

(function () {

    "use strict";
    
    app.FeeTableView = Backbone.View.extend({
	initialize: function (options) {
	    var config = {
		data: options.dataset,
		paging: false,
		ordering: false,
		info: false,
		searching: false,
		aoColumns: [
		    { "sTitle": "", "width": "120%" },
		    { "sTitle": "幼年・少年部", "width": "120%", "sClass": "right"},
		    { "sTitle": "女子部","width": "120%", "sClass": "right"},
		    { "sTitle": "学生部","width": "120%", "sClass": "right"},
		    { "sTitle": "成年部","width": "120%", "sClass": "right"}
		]
	    };
	    this.el = options.el;
	    this.$el.DataTable(config);
	}
    });

    app.FeeView = Backbone.View.extend({

	el: '#fee_tabs',

	initialize: function () {
	    var fee1 = new app.FeeTableView({
		el: "#fee1",
		dataset: app.conf.FEE["month"]
	    });
	    var fee2 = new app.FeeTableView({
		el: "#fee2",
		dataset: app.conf.FEE["half"]
	    });
	    var fee3 = new app.FeeTableView({
		el: "#fee3",
		dataset: app.conf.FEE["year"]
	    });
	    $("#fee_tabs").tabs();
	}
    });

    app.GoogleMapView = Backbone.View.extend({

	initialize: function (options) {
	    this.addr = options.addr;
	    this.el = options.el;
	},

	render: function () {
	    var that = this,
		geocoder = new google.maps.Geocoder();
	    async.waterfall([
		function (cb) {
		    geocoder.geocode({
			'address': that.addr,
			'region': 'jp'
		    }, function (results, status) {
			var err;
			if (status !== google.maps.GeocoderStatus.OK) {
			    err = status;
			}
			cb(err, results);
		    });
		}, function (results, cb) {
		    Object.keys(results).forEach(function (key) {
			var result = results[key];
			if (!result.geometry) {
			    cb(null);
			    return;
			}
			var latlng = result.geometry.location;
			var bounds = new google.maps.LatLngBounds();
			var opts = {
			    zoom: 15,
			    center: latlng,
			    mapTypeId: google.maps.MapTypeId.ROADMAP,
			    mapTypeControl: false
			};
			bounds.extend(latlng);
			var map = new google.maps.Map(document.getElementById(that.el), opts);
			var marker = new google.maps.Marker({
			    position: latlng,
			    map: map
			});
		    });
		}
	    ], function (err) {
		return that;
	    });
	}
    });
    
    app.init = function () {

	
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-25444755-1']);
	_gaq.push(['_trackPageview']);

	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

	// google maps
        var m1 = new app.GoogleMapView({
	    addr: '埼玉県蕨市中央4-21',
	    el: "warabi_map"
	});
	m1.render();
        var m2 = new app.GoogleMapView({
	    addr: '埼玉県川口市並木２－８－２',
	    el: "kawaguchi_map"
	});
	m2.render();
	// Menu Tabs
        $('#tabs').tabs();

	// Free Tabs
	new app.FeeView();
    };
})();
