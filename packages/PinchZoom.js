Ext.define('PinchZoom', {
	extend: 'Ext.Component',
	xtype: 'pinchzoom',
	cls: 'pinchzoom',

	onRender: function () {
		this.callParent();

		var me = this,
			location = {},
			parentDom = this.parentDom.getBox(),
			parentX = parentDom.x,
			parentY = parentDom.y,
			parentW = parentDom.width,
			parentH = parentDom.height;

		var el = document.getElementById(this.id);
		var l, t, w, h, MaxScale;
		rememberLocation();
		reckonMaxScale();

		el.style.zIndex = 999;
		// Ext不支持PinchZoom事件，引入Hammer.js来实现,并定义其边界
		var mc = new Hammer.Manager(el);
		mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([]);
		mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));

		// 移动
		mc.on("panstart", function(e) {
			rememberLocation();
			reckonMaxScale();
			el.style.zIndex = 999;
		});

		mc.on("panmove", function (e) {
			var x = e.deltaX, 
				y = e.deltaY;

			if (0 >= l+e.deltaX) 
				x = -l;
			
			if (l+e.deltaX+w >= parentW) 
				x = parentW-w-l;

			if (t+e.deltaY+h >= parentH) 
				y = parentH-h-t;

			if (0 >= t+e.deltaY) 
				y = -t;

			el.style.webkitTransform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
		});

		mc.on("panend", function (e) {
			el.style.webkitTransform = null;

			l = parseInt(el.style.left)+e.deltaX;
			t = parseInt(el.style.top)+e.deltaY;
			if (0 > l) l = 0;
			if (0 > t) t = 0;

			if(l+w >= parentW) l = parentW-w;
			if(t+h >= parentH) t = parentH-h;

			el.style.left = l  + 'px';
			el.style.top = t  + 'px';
			rememberLocation();
			reckonMaxScale();
		});

		// 缩放
		mc.on("pinchstart", function (e) {
			rememberLocation();
			reckonMaxScale();
			el.style.zIndex = 999;
		});

		mc.on("pinchmove", function (e) {
			var scale = (e.scale < MaxScale) ? e.scale : MaxScale;
			el.style.transform = 'scale(' + scale + ', ' + scale + ')';
		});

		mc.on("pinchend", function (e) {
			mc.stop();
			el.style.transform = null;
			var scale = (e.scale < MaxScale) ? e.scale : MaxScale;

			w = w*scale;
			h = h*scale;

			el.style.width =  w + 'px';
			el.style.height = h + 'px';
			rememberLocation();
			reckonMaxScale();
		});

		// 计算最大Scale
		function reckonMaxScale () {
			var wMaxScale = (parentW-l)/w,
				hMaxScale = (parentH-t)/h;
			MaxScale = Math.min(wMaxScale, hMaxScale);
		}

		function rememberLocation () {
			l = parseInt(el.style.left),
			t = parseInt(el.style.top),
			w = parseInt(el.style.width),
			h = parseInt(el.style.height);
		}
	}
})