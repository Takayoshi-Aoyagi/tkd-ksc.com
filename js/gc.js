var GoogleCalendar = function () {};

GoogleCalendar.prototype.getEventsXXX = function (callback) {
    var that = this;
    setTimeout(function () {
        that.getEvents(function (err, events) {
            callback(null, events);
        });
    }, 3000);
};

GoogleCalendar.prototype.getEvents = function (callback) {
    var that = this,
        map = {};
    async.waterfall([
        function (cb) {
            that.initialize(function (err) {
                console.dir("loaded");
                cb(err);
            });
        },
        function (cb) {
            var req = that.makeEventListRequest();
            req.execute(function (res) {
                if (!res || !res.items) {
                    var err = "No events exist";
                    cb(err);
                    return;
                }
                cb(null, res);
            });
        },
        function (res, cb) {
            async.each(res.items, function (event, ecb) {
                that.getEvent(event, function (json) {
                    map[json.start] = json;
                    ecb();
                });
            }, function (err) {
                cb(err);
            });
        }
    ], function (err) {
        var events = [];
        if (err) {
            callback(err, null);
        }
        var keys = Object.keys(map);
        keys.sort();
        keys.forEach(function (key) {
            var ev = map[key];
            events.push(ev);
        });
        callback(null, events);
    });
}

GoogleCalendar.prototype.initialize = function (callback) {
    if (!gapi || !gapi.cliet) {
	callback("initialize failed");
	return;
    }
    gapi.client.setApiKey("AIzaSyBcfNIHy3lcSSBD385jDJaYfOalt-lLmRg");
    gapi.client.load('calendar', 'v3').then(function () {
        callback();
    });
};

GoogleCalendar.prototype.makeEventListRequest = function () {
    var start = new Date(),
        end = new Date(),
        req;
    start.setHours(start.getHours() - 12)
    end.setDate(end.getDate() + 14);
    req = gapi.client.calendar.events.list({
        "calendarId": "tkdksc@gmail.com",
        "singleEvents": "true", // expand recurring events                                                                                                                                                                        
        "timeMin": start.toJSON(),
        "timeMax": end.toJSON()
    });
    return req;
};

GoogleCalendar.prototype.getEvent = function (event, callback) {
    var req = gapi.client.calendar.events.get({
        "calendarId": "tkdksc@gmail.com",
        "eventId": event.id
    });
    req.execute(function (res) {
        var ev = res.result,
            json = {};
        json.summary = ev.summary;
        json.loc = ev.location;
        json.start = new Date(ev.start.dateTime);
        json.end = new Date(ev.end.dateTime);
        callback(json);
    });
};
