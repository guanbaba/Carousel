(function() { //由于函数内部的变量不会污染全局作用域，因此立即执行函数可用于模块化，很多第三方库都采用了这种方式。
	function Carousel(carousel) {
		this.carousel = carousel;
		this.list = this.carousel.find("ul");
		this.listItems = this.carousel.find("li");
		this.firstItem = this.listItems.first();
		this.lastItem = this.listItems.last();
		this.prevBtn = this.carousel.find(".prev-btn");
		this.nextBtn = this.carousel.find(".next-btn");
		this.maxZIndex = Math.floor(this.listItems.length / 2);
		this.animateFlag = true;

		this.setting = {
			width: 1000,
			height: 270,
			posterWidth: 800,
			posterHeight: 270,
			scale: 0.8,
			autoplay: false,
			delay: 2000
		}
		$.extend(this.setting, this.getDataSetting());
		this.initStyle();
		this.initEvent();
		if (this.setting.autoplay === true) {
			this.autoplay();
		}
	}
	Carousel.prototype = {
		getDataSetting: function() {
			var setting = this.carousel.attr("data-setting");
			if (setting && setting != "") {
				return $.parseJSON(setting);
			} else {
				return null;
			}
		},
		initStyle: function() {
			this.carousel.css({
				"width": this.setting.width,
				"height": this.setting.height,
			});
			this.list.css({
				"width": this.setting.width,
				"height": this.setting.height,
			});
			var btnWidth = (this.setting.width - this.setting.posterWidth) / 2;
			this.prevBtn.css({
				"width": btnWidth,
				"height": this.setting.height,
			});
			this.nextBtn.css({
				"width": btnWidth,
				"height": this.setting.height,
			});
			var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
			this.firstItem.css({
				"width": this.setting.posterWidth,
				"height": this.setting.posterHeight,
				"left": firstLeft,
				"top": 0,
				"zIndex": this.maxZIndex,
				"opacity": 1,
			});
			var rightSize = this.maxZIndex;
			var rightItems = this.listItems.slice(1, rightSize + 1);
			var leftItems = this.listItems.slice(rightSize + 1);
			var gap = ((this.setting.width - this.setting.posterWidth) / 2) / rightSize;
			var width = this.setting.posterWidth;
			var height = this.setting.posterHeight;
			var opacity = 1;
			var top;
			var zIndex;
			var self = this;
			rightItems.each(function(i, elem) {
				width = width * self.setting.scale;
				height = height * self.setting.scale;
				opacity = opacity * self.setting.scale;
				left = firstLeft + self.setting.posterWidth + gap * (i + 1) - width;
				top = (self.setting.height - height) / 2;
				zIndex = self.maxZIndex - i - 1;
				$(elem).css({
					"width": width,
					"height": height,
					"opacity": opacity,
					"left": left,
					"top": top,
					"zIndex": zIndex
				});
			})
			leftItems.each(function(i, elem) {
				$(elem).css({
					"width": width,
					"height": height,
					"opacity": opacity,
					"left": gap * i,
					"top": top,
					"zIndex": i,
				});
				width = width / self.setting.scale;
				height = height / self.setting.scale;
				opacity = opacity / self.setting.scale;
				top = (self.setting.height - height) / 2;
			})
		},
		initEvent: function() {
			var self = this;
			this.prevBtn.click(function() {
				if (self.animateFlag == false)
					return;
				self.animateFlag = false;
				self.rotate("right");
			})
			this.nextBtn.click(function() {
				if (self.animateFlag == false)
					return;
				self.animateFlag = false;
				self.rotate("left");
			})
		},
		rotate: function(direction) {
			var siblingElem;
			var zIndexArray = [];
			var self = this;
			this.listItems.each(function(i, elem) {
				if (direction === "right")
					siblingElem = $(elem).next().length > 0 ? $(elem).next() : self.firstItem;
				else if (direction == "left")
					siblingElem = $(elem).prev().length > 0 ? $(elem).prev() : self.lastItem;
				zIndexArray.push(siblingElem.css("zIndex"));
				$(elem).animate({
					"width": siblingElem.width(),
					"height": siblingElem.height(),
					"opacity": siblingElem.css("opacity"),
					"left": siblingElem.css("left"),
					"top": siblingElem.css("top"),
				}, 500, function() {
					self.animateFlag = true;
				});
			})
			this.listItems.each(function(i, elem) {
				$(elem).css("zIndex", zIndexArray[i]);
			})
		},
		autoplay: function() {
			var self = this;
			this.timeInterval = setInterval(function() {
				self.nextBtn.click();
			}, self.setting.delay);
			this.carousel.hover(function() {
				if (self.timeInterval)
					clearInterval(self.timeInterval);
			}, function() {
				self.timeInterval = setInterval(function() {
					self.nextBtn.click();
				}, self.setting.delay);
			})
		}
	}
	Carousel.init=function(elems){
		elems.each(function(i,elem){
			new Carousel($(elem));
		})
	}
	window["carousel"] = Carousel;
})();