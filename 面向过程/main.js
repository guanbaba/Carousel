$(function() {
	var firstItem = $(".carousel-list li").first();
	var lastItem = $(".carousel-list li").last();
	var maxZIndex = Math.floor($(".carousel-list li").length/2);
	firstItem.css({
		"position": "absolute",
		"left": "180px",
		"top": "0px",
		"zIndex": maxZIndex,
		"opacity": 1,
	});
	var listItems = $(".carousel-list li");
	var rightSize = maxZIndex;
	var rightItems = listItems.slice(1, rightSize + 1);
	var leftItems = listItems.slice(rightSize + 1);
	var scale = 0.8;
	var containerWidth = $(".carousel-container").width();
	var firstWidth = firstItem.width();
	var firstHeight = firstItem.height();
	var firstOpacity = firstItem.css("opacity");
	var firstLeft = parseInt(firstItem.css("left"));
	var gap = ((containerWidth - firstWidth) / 2) / rightSize;
	var width = firstWidth;
	var height = firstHeight;
	var opacity = firstOpacity;
	var top;
	rightItems.each(function(i, elem) {
		width = width * scale;
		height = height * scale;
		opacity = opacity * scale;
		left = firstLeft + firstWidth + gap * (i + 1) - width;
		top = (firstHeight - height) / 2;
		$(elem).css({
			"width": width,
			"height": height,
			"position": "absolute",
			"opacity": opacity,
			"left": left,
			"top": top,
			"zIndex": maxZIndex - i - 1,
		});
	})
	leftItems.each(function(i, elem) {
		$(elem).css({
			"width": width,
			"height": height,
			"position": "absolute",
			"opacity": opacity,
			"left": gap * i,
			"top": top,
			"zIndex": i,
		});
		width = width / scale;
		height = height / scale;
		opacity = opacity / scale;
		top = (firstHeight - height) / 2;
	})
	var animateFlag = true;
	$(".prev-btn").click(function() {
		if (animateFlag == false)
			return;
		var nextElem;
		var zIndexArray = [];
		animateFlag = false;
		listItems.each(function(i, elem) {
			nextElem = $(elem).next().length > 0 ? $(elem).next() : firstItem;
			zIndexArray.push(nextElem.css("zIndex"));
			$(elem).animate({
				"width": nextElem.width(),
				"height": nextElem.height(),
				"opacity": nextElem.css("opacity"),
				"left": parseInt(nextElem.css("left")),
				"top": parseInt(nextElem.css("top")),
			}, 500, function() {
				animateFlag = true;
			});
		})
		listItems.each(function(i, elem) {
			$(elem).css("zIndex", zIndexArray[i]);
		})
	})
	$(".next-btn").click(function() {
		if (animateFlag == false)
			return;
		var prevElem;
		var zIndexArray = [];
		animateFlag = false;
		listItems.each(function(i, elem) {
			prevElem = $(elem).prev().length > 0 ? $(elem).prev() : lastItem;
			zIndexArray.push(prevElem.css("zIndex"));
			$(elem).animate({
				"width": prevElem.width(),
				"height": prevElem.height(),
				"opacity": prevElem.css("opacity"),
				"left": parseInt(prevElem.css("left")),
				"top": parseInt(prevElem.css("top")),
			}, 500, function() {
				animateFlag = true;
			});
		})
		listItems.each(function(i, elem) {
			$(elem).css("zIndex", zIndexArray[i]);
		})
	})
	$(".carousel-container")[0].timeInterval = setInterval(function() {
		$(".next-btn").click()
	}, 2000);
	$(".carousel-container").hover(function() {
		clearInterval(this.timeInterval);
	}, function() {
		this.timeInterval = setInterval(function() {
			$(".next-btn").click()
		}, 2000);
	})
})