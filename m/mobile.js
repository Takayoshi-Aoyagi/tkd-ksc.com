var app = app || {};

(function () {
    
    "use strict";
    
    // Model
    
    app.Schedule = Backbone.Model.extend({
    });
    
    // Collection
    app.ScheduleCollection = Backbone.Collection.extend({
	
	model: app.Schedule,
	
	summarize: function () {
	    var data = {};
	    this.forEach(function (schedule) {
		var date = moment(schedule.get('start')).format('YYYY/MM/DD'),
		    loc = schedule.get('loc'),
		    key = date + '-' + loc,
		    start = moment(schedule.get('start')).format('HH:mm');
		if (!data[date]) {
		    data[date] = {};
		}
		data[date].date = date;
		data[date].loc = loc;
		if (!data[date]['classes']) {
		    data[date]['classes'] = {};
		}
		if (!data[date]['classes'][start]) {
		    data[date]['classes'][start] = {};
		}
		data[date]['classes'][start] = {
		    start: start,
		    summary: schedule.get('summary')
		};
	    });
	    return data;
	}
    });
    
    // Views
    
    app.ScheduleView = Backbone.View.extend({

	className: 'event',
	
	initialize: function (data) {
	    this.data = data;
	},
	
	render: function () {
	    var that = this,
	    date = this.data.date,
	    loc = this.data.loc,
	    classes = this.data['classes'],
	    title,
	    html = [];
	    title = (function () {
		var city,
		arr = loc.split('市');
		if (arr.length == 2) {
		    city = arr[0];
		    return sprintf("%s %sクラブ", date, city);
		} else {
		    return sprintf("%s %s", date, loc);
		}
	    })();
	    html.push(title);
	    Object.keys(classes).sort().forEach(function (startTime) {
		var element = classes[startTime],
		clazz,
		li;
		clazz = element.summary.replace(/川口|蕨|わらび/, "");
		html.push(sprintf("・%s: %s", element.start, clazz));
	    });
	    html = html.map(function (a) {
		return '<p>' + a + '</p>';
	    });
	    this.$el.html(html.join(""));
	}
    });
    
    app.ScheduleListView = Backbone.View.extend({
	
	el: '#sched_view',
	
	initialize: function () {
	},

	render: function () {
	    var html,
	    that = this;
	    var summary = app.schedules.summarize();
	    Object.keys(summary).sort().forEach(function (date) {
		var data = summary[date],
		    sched;
		sched = new app.ScheduleView(data);
		sched.render();
		that.$el.append(sched.$el);
	    });
	    return this;
	},

	clear: function () {
	    this.$el.empty();
	}
    });

    app.FeeView = Backbone.View.extend({
	
	el: '#fee_view',
	
	initialize: function () {
	    this.render();
	},
	
	render: function () {
	    var config = {
		data: app.conf.FEE.regular,
		paging: false,
		ordering: false,
		info: false,
		searching: false,
		aoColumns: [
		    { "sTitle": "" },
		    { "sTitle": "少年部", "width":"70%", "sClass": "right" },
		    { "sTitle": "女子・学生", "width":"70%", "sClass": "right" },
		    { "sTitle": "成年部", "width":"70%", "sClass": "right" }
		]
	    };
	    $('#regular_fee').DataTable(config);
	}
    });

    app.CircleFeeView = Backbone.View.extend({
	
	el: '#fee_view',
	
	initialize: function () {
	    this.render();
	},
	
	render: function () {
	    var config = {
		data: app.conf.FEE.circle,
		paging: false,
		ordering: false,
		info: false,
		searching: false,
		aoColumns: [
		    { "sTitle": "" },
		    { "sTitle": "少年部", "width":"70%", "sClass": "right" },
		    { "sTitle": "女子・学生", "width":"70%", "sClass": "right" },
		    { "sTitle": "成年部", "width":"70%", "sClass": "right" }
		]
	    };
	    $('#circle_fee').DataTable(config);
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
	    html += '<h2 style="color:red;">道場開設15周年記念！</h2>';
	    html += '<div class="event">'
	    html += '<p style="color:red; font-size:150%">残り２名！<p>';
	    html += '<p style="color:blue; font-size:250%">３×５＝１５<p>';
	    html += '<p style="color:blue; font-size:90%">さんごじゅうごキャンペーン</p>';
	    html += '</div>';
	    html += '<div style="margin-top:20px;"></div>';
	    html += '<table align="center">';
	    html += '<tr><td class="new_info" align="right"><span style="color:red; font-size:100%;">3</span></td><td>　</td><td align="left">4/1より<span style="color:red;">3</span>ヶ月</td></tr>';
	    html += '<tr><td class="new_info" align="right"><span style="color:red; font-size:100%;">5</span></td><td>　</td><td align="left">先着<span style="color:red;">5</span>名様</td></tr>';
	    html += '<tr><td class="new_info" align="right"><span style="color:red; font-size:100%;">15</span></td><td>　</td><td align="left">負担金<span style="color:red;">15</span>% (85%OFF)</td></tr>';
	    html += '</table>';
	    html += '</span>';
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
	app.schedules = new app.ScheduleCollection();
	app.scheduleListView = new app.ScheduleListView();
	app.recularFeeView = new app.FeeView();
	app.circleFeeView = new app.CircleFeeView();
	app.schedules.on({
	    reset: function () {
		app.scheduleListView.clear();
		app.scheduleListView.render();
	    }
	});
	app.overlayView = new app.OverlayView();
	app.overlayView.render();
	app.overlayView.show();
    };

    app.initGC = function () {
	var array = [];
	app.gc = new GoogleCalendar();
	app.gc.getEvents(function (err, events) {
	    if (err || !events) {
		return;
	    }
	    events.forEach(function (event) {
		array.push(new app.Schedule(event));
	    });
	    app.schedules.reset(array);
	});
    }
})();

