var app = app || {};

(function () {

    "use strict";

    var conf = {};

    conf.FEE = {
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

    // export
    app.conf = conf;
    
})();
