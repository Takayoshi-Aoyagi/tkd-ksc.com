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

	initialize: function (data) {
	    this.data = data;
	},

	render: function () {
	    var that = this,
		date = this.data.date,
		loc = this.data.loc,
		classes = this.data['classes'],
		title,
		html = '';
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
	    html += title;
	    html += '<ul>';
	    Object.keys(classes).sort().forEach(function (startTime) {
		var element = classes[startTime],
		    clazz,
		    li;
		clazz = element.summary.replace(/川口|蕨|わらび/, "");
		li = sprintf("<li>%s: %s</li>", element.start, clazz);
		html += li;
	    });
	    html += '</ul>';
	    this.$el.html(html);
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
	}
    });
    
    app.init = function () {
	app.schedules = new app.ScheduleCollection();
	app.scheduleListView = new app.ScheduleListView();
	app.schedules.on({
	    reset: function () {
		app.scheduleListView.render();
	    }
	});
    };
    
    // export
    window.onload = function () {
	var gc = new GoogleCalendar(),
	    array = [];
	gc.getEvents(function (err, events) {
	    events.forEach(function (event) {
		array.push(new app.Schedule(event));
	    });
	    app.schedules.reset(array);
	});
    };
})();

