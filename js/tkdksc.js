var Tkdksc = function () {
    this.initCal();
};

Tkdksc.prototype.formatTime = function (str, format) {
  var txt;
  if (format == 'date') {
    txt = str.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    txt = txt[1] + '/'+ txt[2].replace(/^0/,'') + '/' + txt[3].replace(/^0/,'') + '/ ' + txt[4].replace(/^0/,'') + ':' + txt[5];
  } else if(format == 'time') {
    txt = str.match(/T(\d{2}):(\d{2})/);
    txt = txt[1].replace(/^0/,'') + ':' + txt[2];
  }
  return txt;
};

Tkdksc.prototype.initCal = function () {
  var that = this,
      url = 'http://www.google.com/calendar/feeds/tkdksc@gmail.com/public/full?alt=json-in-script&orderby=starttime&sortorder=ascend&max-results=50&futureevents=true&callback=?';
        
  $.getJSON(url, function (json) {
    var html,
        items = json.feed.entry;

    html = '<ul>';
    items.forEach(function (item) {
      var dt = that.formatTime(item.gd$when[0].startTime, "date") + '-' + that.formatTime(item.gd$when[0].endTime, "time"),
	  place = item.gd$where[0].valueString,
          clazz = item.title.$t,
	  li;
      li = '<li>' + dt;
      li += '<ul>';
      li += '<li>' + clazz + '</li>';
      li += '<li>' + place + '</li>';
      li += '</ul>';
      li += '</li>';
      html += li;
    });
    html += '</ul>';
    $('#view').append(html);
  });
};

Tkdksc.isSmartPhone = function () {
    if (navigator.userAgent.indexOf('iPhone') >= 0 ||
	navigator.userAgent.indexOf('iPad') >= 0 ||
	navigator.userAgent.indexOf('iPod') >= 0 ||
	navigator.userAgent.indexOf('Android') >= 0) {
	return true;
    }
    return false;
};

Tkdksc.getParams = function () {
    var object = {},
        params = location.search.substring(1).split('&');
    params.forEach(function (param) {
	    var kv = param.split('='),
		k = kv[0],
		v = kv[1];
      object[k] = v;
    });
    return object;
};