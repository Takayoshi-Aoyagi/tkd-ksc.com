var app = app || {};

(function () {

    "use strict";

    var conf = {};

    conf.FEE = {
	"regular": [
	    ["入会金", "￥3,000", "￥3,000"," ￥3,000"],
	    ["月謝（週１）", "￥4,000", "-", "-"],
	    ["月謝（週２）", "￥5,000", "￥6,500", "￥7,500"],
	    ["道衣", "￥9,500", "￥9,500", "￥9,500"]
	],
	"circle": [
	    ["入会金", "￥0", "￥0", "￥0"],
	    ["月謝（週１）", "￥4,000", "-", "-"],
	    ["月謝（週２）", "￥5,000", "￥6,000", "￥7,000"],
	    ["道衣", "-", "-", "-"]
	]
    };

    conf.LINKS = [
	["日本国際テコンドー協会", "http://www.taekwon-do.co.jp/"],
	["朴道場", "http://www.taekwon-do-pakdojo.com"],
	["黄道場", "http://tkd-hwangdojo.jp/"],
	["高知道場", "http://www.kig-laboratory.com/"],
	["町屋道場", "http://famiteko.k-server.org/"],
	["渋谷道場", "http://www.tkd-hs.jp/sasazuka/"],
	["府中道場", "http://www.fuchudojo.sakura.ne.jp/"],
	["函館道場", "http://itfhakodate.web.fc2.com/"],
	["札幌道場", "http://www5f.biglobe.ne.jp/~itf-sapporoclub/"],
	["千葉道場", "http://www.seodojang.com/"],
	["京都道場", "http://www.itf-chodojo.jp/"],
	["宮崎道場", "http://www.miyazaki-catv.ne.jp/~itf-hiro/"],
	["オムスクール", "http://www.omschool.jp/"]
    ];
    // export
    app.conf = conf;
    
})();
