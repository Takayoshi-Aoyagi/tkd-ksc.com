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
	
	var gc = new GoogleCalendar(),
	array = [];
	gc.getEvents(function (err, events) {
	    if (err || !events) {
		return;
	    }
	    events.forEach(function (event) {
		array.push(new app.Schedule(event));
	    });
	    app.schedules.reset(array);
	});
    };
})();
