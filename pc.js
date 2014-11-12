var app = app || {};

(function () {

    app.FEE = {
	"month": [
	    ["入会金", "￥6,000", "￥6,000"," ￥6,000", "￥6,000"],
	    ["一般会員", "￥5,000", "￥6,500", "￥6,500", "￥7,500"],
	    ["家族会員(二人目)", "￥4,000", "￥5,500", "￥5,500", "￥6,500"],
	    ["家族会員(三人目)", "￥3,000", "￥4,500", "￥4,500", "￥5,500"],
	    ["サークル会員", "￥5,000", "￥6,000", "￥6,000", "￥7,000"]
	],
	"half": [
	    ["入会金", "￥6,000", "￥6,000"," ￥6,000", "￥6,000"],
	    ["一般会員", "￥25,000", "￥32,500", "￥32,500", "￥37,500"],
	    ["家族会員(二人目)", "￥20,000", "￥27,500", "￥27,500", "￥32,500"],
	    ["家族会員(三人目)", "￥15,000", "￥22,500", "￥22,500", "￥27,500"],
	    ["サークル会員", "-", "-", "-", "-"]
	],
	"year": [
	    ["入会金", "￥6,000", "￥6,000"," ￥6,000", "￥6,000"],
	    ["一般会員", "￥50,000", "￥65,000", "￥65,000", "￥75,000"],
	    ["家族会員(二人目)", "￥40,000", "￥55,000", "￥55,000", "￥65,000"],
	    ["家族会員(三人目)", "￥30,000", "￥45,000", "￥45,000", "￥55,000"],
	    ["サークル会員", "-", "-", "-", "-"]
	],
    };
    
    app.FeeTableView = Backbone.View.extend({
	initialize: function (options) {
	    var config = {
		data: options.dataset,
		paging: false,
		ordering: false,
		info: false,
		searching: false,
		columns: [
		    { "title": " " },
		    { "title": "幼年・少年部" },
		    { "title": "女子部" },
		    { "title": "学生部" },
		    { "title": "成年部" }
		],
		"columnDefs": [
		    {
			"width": "20%",
			"targets": 0
		    }
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
		dataset: app.FEE["month"]
	    });
	    var fee2 = new app.FeeTableView({
		el: "#fee2",
		dataset: app.FEE["half"]
	    });
	    var fee3 = new app.FeeTableView({
		el: "#fee3",
		dataset: app.FEE["year"]
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
			map = new google.maps.Map(document.getElementById(that.el), opts);
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
