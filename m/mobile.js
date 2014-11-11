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
		var date = moment(schedule.get('start')).format('YYYY/MM/DD');
		var loc = schedule.get('loc');
		var key = date + '-' + loc;
		var start = moment(schedule.get('start')).format('HH:mm');
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
	    console.log(data);
	    return data;
	}
    });
    
    // Views

    app.ScheduleView = Backbone.View.extend({

	el: '#sched_view',

	initialize: function () {
	    var that = this;
	},

	render: function () {
	    var html
	    var summary = app.schedules.summarize();
	    html = '<ul>';
	    Object.keys(summary).sort().forEach(function (key) {
		var data = summary[key];
		html += data.date;
		html += data.loc;
		html += '<ul>';
		Object.keys(data['classes']).sort().forEach(function (startTime) {
		    console.log(startTime);
		    var element = data['classes'][startTime];
		    html += '<li>' + element.start + ':' + element.summary + '</li>';
		});
		
		html += '</ul>';
	    });
	    html += '</ul>';
	    this.$el.append(html);
	    return this;
	}
    });

    app.init = function () {
	app.schedules = new app.ScheduleCollection();
	app.scheduleView = new app.ScheduleView();
	app.schedules.on({
	    reset: function () {
		app.scheduleView.render();
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

