/*
 * hjt.pc.card.slide 卡片轮播组件
 * 五张卡牌，自动轮播
 * @selector    string  外层div的选择器
 * @isAuto      bool    是否自动滚动
 * @speed       int     自动滚动间隔毫秒

使用：new CardSlideTpl($(selector), {speed: 500,isAuto: true});

<div id="cardSection">
        <div class="slide">
            <ul>
                <li>
                    <a href="#"><img src="http://demo.sc.chinaz.com/Files/DownLoad/webjs1/201707/jiaoben5247/image/1.jpg" alt=""></a>
                </li>
                <li>
                    <a href="#"><img src="http://demo.sc.chinaz.com/Files/DownLoad/webjs1/201707/jiaoben5247/image/2.jpg" alt=""></a>
                </li>
                <li>
                    <a href="#"><img src="http://demo.sc.chinaz.com/Files/DownLoad/webjs1/201707/jiaoben5247/image/3.jpg" alt=""></a>
                </li>
                <!-- <li>
                    <a href="#"><img src="http://demo.sc.chinaz.com/Files/DownLoad/webjs1/201707/jiaoben5247/image/5.jpg" alt=""></a>
                </li>
                <li>
                    <a href="#"><img src="http://demo.sc.chinaz.com/Files/DownLoad/webjs1/201707/jiaoben5247/image/6.jpg" alt=""></a>
                </li>
            </ul>
            <div class="arraw">
                <a href="javascript:;" class="next">&gt;</a>
                <a href="javascript:;" class='prev'>&lt;</a>
            </div>
        </div>
    </div>
* 稍微调整下样式
<style>
html,body{width:100%}ul li{list-style:none}*{margin:0;padding:0}#cardSection{width:1200px;margin:20px auto}.slide{height:500px;position:relative}.slide ul{height:100%}.slide li{position:absolute;left:200px;top:0}.slide li img{width:100%}.arraw{opacity:0}.arraw a{width:70px;height:110px;display:block;position:absolute;top:50%;margin-top:-55px;z-index:999}.next{font-size:26px;text-decoration:none;right:-10px}.prev{font-size:26px;text-decoration:none;left:-10px}
</style>
*/
"use strict";
var CardSlideTpl = function(container, options) {
    this.init(container, options);
}
CardSlideTpl.prototype = {
    init: function(container, options) {
        this.container = container;
        this.options = $.extend({}, {
            callback: $.noop,
            speed: 500,
            isAuto: true
        }, options);
        this.json = [ //  包含了5张图片里面所有的样式
            { //  1
                width: 400,
                top: 20,
                left: 100,
                opacity: 20,
                z: 2,
                id: 1
            },
            { // 2
                width: 600,
                top: 70,
                left: 50,
                opacity: 60,
                z: 3,
                id: 2
            },
            { // 3
                width: 800,
                top: 100,
                left: 200,
                opacity: 100,
                z: 4,
                id: 3
            },
            { // 4
                width: 600,
                top: 70,
                left: 550,
                opacity: 60,
                z: 3,
                id: 4
            },
            { //5
                width: 400,
                top: 20,
                left: 650,
                opacity: 20,
                z: 2,
                id: 5
            }
        ];
        this.flag = true;
        this.timer = null;
        // 增加自定义事件
        this.addevents = {};
        this.move();
        this.run();
        this.event();

    },

    event: function() {
        var container = this.container,
            $next = container.find('.next'),
            $prev = container.find('.prev');
        // 下一张
        // container.on('click', '.next', function() {

        // });
        // // 上一张
        // container.on('click', '.next', function() {

        // });

    },
    run: function() {
        var self = this;
        var speed = this.options.speed;
        clearInterval(this.timer);
        // 500毫秒执行一次轮播，如果子元素没有轮播完，则等待下一个500毫秒
        this.timer = setInterval(function() {
            // console.log('run')
            if (self.flag == true) {
                self.flag = false;
                self.move(true);
            }
        }, speed);
    },
    move: function(x) {
        var self = this,
            json = self.json,
            $lis = self.container.find('li');
        if (x != undefined) {
            if (x) {
                json.push(json.shift());
            } else {
                json.unshift(json.pop());
            };
        };

        for (var i = 0; i < json.length; i++) {
            this.animate($lis[i], {
                width: json[i].width,
                top: json[i].top,
                left: json[i].left,
                opacity: json[i].opacity,
                zIndex: json[i].z
            }, function() { self.flag = true; })
        };
    },
    slide: function($item, obj, callback) {
        // console.log($item, obj)
        var self = this;

    },
    animate: function($item, obj, callback) {
        var self = this;
        // 先停止定时器
        clearInterval($item.timers);
        $item.timers = setInterval(function() {
            var stoped = true;
            // console.log('sss')
            for (var k in obj) {
                var leader = 0;
                if (k == 'opacity') {
                    leader = Math.round(self.getStyle($item, k) * 100) || 100;
                } else {
                    // console.log(obj[k]);
                    leader = parseInt(self.getStyle($item, k)) || 0;
                };
                // console.log(leader);
                // obj[k]是目标位置
                var step = (obj[k] - leader) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                leader = leader + step;
                if (k == 'opacity') {
                    $item.style[k] = leader / 100;
                    $item.style['filter'] = 'alpha(opacity=' + leader + ')';
                } else if (k == 'zIndex') {
                    $item.style['zIndex'] = obj[k];
                    // console.log(666);
                } else {
                    $item.style[k] = leader + "px";
                }
                if (leader != obj[k]) {
                    stoped = false;
                }
            };
            if (stoped) {
                // console.log('stop')
                clearInterval($item.timers);
                callback && callback();
            };
        }, 50);
    },
    getStyle: function(obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return window.getComputedStyle(obj, null)[attr];
        };
    }
};
window.CardSlideTpl = CardSlideTpl;
