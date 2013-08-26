(function($) {

	PhotoFrame.Buttons.FocalPoint = PhotoFrame.Button.extend({
		
		/**
		 * An array of button objects
		 */
		
		buttons: [],

		/**
		 * An object of classes
		 */
		
		classes: {},

		/**
		 * Is the focal point visible?		 
		 */
		
		visible: true,
				
		/**
		 * Name of the button
		 */
		
		icon: 'picture-alt',
		
		initialized: false,

		/**
		 * Name of the button
		 */
		
		name: false,
		
		windowSettings: {
			css: 'photo-frame-focal-point-wrapper',	
			title: false,
			width: 160
		},

		x: false,

		y: false,
		
		constructor: function(buttonBar, options, buildWindow) {
			var t = this;

			this.windowSettings.title = PhotoFrame.Lang.focal_point;
			this.name				  = 'focalPoint';
			this.description		  = PhotoFrame.Lang.focal_point_desc;

			this.buttons = [{
				css: 'photo-frame-toggle photo-frame-right',
				text: !t.visible ? PhotoFrame.Lang.show_focal_point : PhotoFrame.Lang.hide_focal_point,
				onclick: function(e, button) {
					if(t.visible) {
						$(button.ui.button).html(PhotoFrame.Lang.show_focal_point);
					}
					else {
						$(button.ui.button).html(PhotoFrame.Lang.hide_focal_point);
					}
					t.toggleVisibility();
					e.preventDefault();
				}
			}];

			this.base(buttonBar);
		},

		toggleVisibility: function() {
			if(this.visible) {
				this.visible = false;
				this.hide();
			}
			else {
				this.visible = true;
				this.show();
			}
		},

		show: function() {
			this.window.ui.focalPoint.show();
			this.showManipulation();
		},

		hide: function() {
			this.window.ui.focalPoint.hide();
			this.hideManipulation();
		},

		resetFocalPoint: function() {
			if(!this.getManipulation().visible) {
				this.hide();
			}

			if(!this.initialized) {
				this.setFocalPoint(this.getX(), this.getY());
			}
			else {
				this.centerFocalPoint();
			}
		},

		buildWindow: function() {
			this.base({ buttons: this.buttons });

			var t    = this;
			var html = $([
				'<div class="photo-frame-grid">',
					'<label for="photo-frame-focal-x">X</label>',
					'<input type="text" value="" name="photo-frame-focal-x" id="photo-frame-focal-x" readonly class="photo-frame-small" />',
				'</div>',
				'<div class="photo-frame-grid">',
					'<label for="photo-frame-focal-y">Y</label>',
					'<input type="text" value="" name="photo-frame-focal-y" id="photo-frame-focal-y" readonly class="photo-frame-small"/>',
				'</div>',
			].join(''));

			this.window.ui.content.html(html);
			this.window.ui.x = html.find('#photo-frame-focal-x');
			this.window.ui.y = html.find('#photo-frame-focal-y');
			this.window.ui.focalPoint = $('<img src="'+t.getImagePath()+'" class="photo-frame-focal-point" />');

			/*
			this.window.ui.content.find('input').blur(function() {
				var name = $(this).attr('name').replace('photo-frame-focal-', '');
				var val  = parseInt($(this).val());

				if(name == 'x') {
					t.setX(val + t.getOffsetX());
				}
				else {
					t.setY(val + t.getOffsetY());
				}
			});
			*/

			this.bind('saveCropStart', function() {
				t.initialized = false;
				t.save(t.getData(), true);
			})

			this.bind('initCrop', function() {
				t.window.ui.focalPoint.draggable('option', 'containment', t.cropPhoto().ui.cropPhoto);
				t.resetFocalPoint();
			});

			this.bind('startCropEnd', function(obj, img) {
				obj.ui.cropPhoto.parent().parent().append(t.window.ui.focalPoint);

				t.window.ui.focalPoint.draggable({
					scroll: false,
					containment: obj.ui.cropPhoto,
					drag: function(event, ui) {
						t.save(t.getData(), true);
						t.setX(ui.position.left + t.getOffsetX(), false);
						t.setY(ui.position.top + t.getOffsetY(), false);
					}
				});

				if(manipulation = t.getManipulation()) {
					t.setX(manipulation.data.x);
					t.setY(manipulation.data.y);
				}
				else {				
					t.centerFocalPoint();
				}

				t.initialized = true;
			});

		},

		cancel: function() {
			this.initialized = false;
		},

		startCrop: function() {
			this.initialized = false;
		},

		getData: function() {
			return {
				x: this.getX(),
				y: this.getY()
			};
		},

		toggleLayer: function(visible) {
			if(visible) {
				this.show();
			}
			else {
				this.hide();
			}
		},

		centerFocalPoint: function() {
			var center = this.getCenter();

			this.setX(center.x);
			this.setY(center.y);
			this.save(this.getData(), true);

			//this.setFocalPoint(center.x - this.getOffsetX(), center.y - this.getOffsetY());
		},

		setFocalPoint: function(x, y, updateCss) {
			this.setX(x, updateCss);
			this.setY(y, updateCss);
		},

		setX: function(x, updateCss) {
			this.window.ui.x.val(x);
			this.x = x;
			if(typeof updateCss == "undefined" || updateCss) {
				this.window.ui.focalPoint.css('left', x - this.getOffsetX());
			}
		},

		setY: function(y, updateCss) {
			this.window.ui.y.val(y);
			this.y = y;
			if(typeof updateCss == "undefined" || updateCss) {
				this.window.ui.focalPoint.css('top', y - this.getOffsetY());
			}
		},

		getImagePath: function() {
			return PhotoFrame.Actions.theme_url+'/photo_frame_focal_pack/img/focal'+(this.isRetina() ? '@2x' : '')+'.png';
		},

		getPosition: function() {
			this.window.ui.focalPoint.css('x')
		},

		getCenter: function() {
			return {
				x: parseInt(this.cropPhoto().width() / 2),
				y: parseInt(this.cropPhoto().height() / 2)
			};
		},

		getX: function() {
			return this.x;
		},

		getY: function() {
			return this.y;
		},

		getOffsetX: function() {
			return parseInt(this.getWidth() / 2);
		},

		getOffsetY: function() {
			return parseInt(this.getHeight() / 2);
		},

		getWidth: function() {
			return this.window.ui.focalPoint.width();
		},

		getHeight: function() {
			return this.window.ui.focalPoint.height();
		}

	});

}(jQuery));