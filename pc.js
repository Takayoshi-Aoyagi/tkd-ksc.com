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

        app.OverlayView = Backbone.View.extend({
	
	el: '#overlay',

	initialize: function () {
	},

	render: function () {
	    var html = "";
	    html += '<div style="display:table-cell; vertical-align:middle;">';
	    html += '<span style="color:#eee;">';
	    html += '<h2 style="color:red; font-size:200%">黒帯誕生キャンペーン</h2>';
	    html += '<div class="event">';

	    html += '<p style="color:blue; font-size:130%">道場に新黒帯が２名誕生！</p>';
	    html += '<p style="color:blue; font-size:100%">益々道場も活気づくことでしょう</p>';
	    html += '<p style="color:blue; font-size:100%">２名誕生の記念キャンペーンを行います</p>';
	    html += '<p style="color:red; font-size:120%">先着２名様まで</p>';
	    html += '<p style="color:red; font-size:120%">初期費用15%(85%OFF)</p>';

	    html += '</div>';
	    html += '<div style="margin-top:20px;"></div>';
	    html += '<table align="center">';
	    html += '</table>';
	    html += '</span>';

	    html += '<p style="color:white">入会時の初期費用が15% (85%OFF)</p>';
	    html += '<table align="center" bgcolor="white">';
	    html += '<tr><td> </td><td>少年部</td><td>女子・学生</td><td>成年部</td></tr>';
	    html += '<tr><td>入会金</td><td>￥3,000</td><td>￥3,000</td><td>￥3,000</td></tr>';
	    html += '<tr><td>月謝</td><td>￥5,000</td><td>￥6,500</td><td>￥7,500</td></tr>';
	    html += '<tr><td>道衣</td><td>￥9,500</td><td>￥9,500</td><td>￥9,500</td></tr>';
	    html += '<tr><td><s>合計(通常)</s></td><td><s>￥17,500</s></td><td><s>￥19,000</s></td><td><s>￥20,000</s></td></tr>';
	    html += '<tr><td style="color:red;">合計(15%)</td><td style="color:red;">￥2,625</td><td style="color:red;">￥2,850</td><td style="color:red;">￥3,000</td></tr>';
	    html += '</table>';

	    html += '</div>';


	    $(this.el).append(html);
	},

	events: {
	    "click": "onClick"
	},

	onClick: function () {
	    this.hide();
	},
	
	show: function () {
	    $(this.el).fadeIn();
	},

	hide: function () {
	    $(this.el).fadeOut();
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

	// overlay
	var overlayView = new app.OverlayView();
	//overlayView.render();
	//overlayView.show();
    };
})();
