var app = app || {};

(function () {

    "use strict";

    app.LinksTableView = Backbone.View.extend({

	el: "#links",
	
	initialize: function () {
	    var config = {
		data: app.conf.LINKS,
		paging: false,
		ordering: false,
		info: false,
		searching: false,
		aoColumns: [
		    { "sTitle": "道場" },
		    { "sTitle": "URL" }
		]
	    };
	    $('#links_table').DataTable(config);
	},

	render: function () {
	}
    });
    
    app.FeeTableView = Backbone.View.extend({

	el: "#regular_fee",

	initialize: function (options) {
	    var config = {
		data: app.conf.FEE.regular,
		paging: false,
		ordering: false,
		info: false,
		searching: false,
		aoColumns: [
		    { "sTitle": "", "width": "120%" },
		    { "sTitle": "小学生以下", "width": "120%", "sClass": "right"},
		    { "sTitle": "女子・学生","width": "120%", "sClass": "right"},
		    { "sTitle": "成年男子","width": "120%", "sClass": "right"}
		]
	    };
	    this.$el.DataTable(config);
	}
    });

    app.CircleFeeTableView = Backbone.View.extend({

	el: "#circle_fee",

	initialize: function (options) {
	    var config = {
		data: app.conf.FEE.circle,
		paging: false,
		ordering: false,
		info: false,
		searching: false,
		aoColumns: [
		    { "sTitle": "", "width": "120%" },
		    { "sTitle": "小学生以下", "width": "120%", "sClass": "right"},
		    { "sTitle": "女子・学生","width": "120%", "sClass": "right"},
		    { "sTitle": "成年男子","width": "120%", "sClass": "right"}
		]
	    };
	    this.$el.DataTable(config);
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

	// Free Tables
	var regularFee = new app.FeeTableView();
	var circleFee = new app.CircleFeeTableView();

	// Links
	new app.LinksTableView();
    };
})();
