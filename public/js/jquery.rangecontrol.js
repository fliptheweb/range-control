//@ sourceMappingURL=jquery.rangecontrol.map
(function() {
  var RangeControl, RangeControlGraph,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RangeControl = (function() {

    RangeControl._min;

    RangeControl._max;

    RangeControl._leftControlValue;

    RangeControl._rightControlValue;

    RangeControl._step;

    RangeControl._dragged;

    RangeControl._renderControlCallback;

    RangeControl._width;

    RangeControl._widthWithoutPaddings;

    RangeControl._controlWidth;

    RangeControl._pxInValue;

    RangeControl._rangeElement;

    RangeControl._changeTimeout;

    RangeControl.prototype.PLUGINNAME = 'range-control';

    RangeControl.prototype.DRAGCLASSNAME = 'is-dragged';

    RangeControl.prototype.keyCode = {
      LEFT: 37,
      RIGHT: 39
    };

    RangeControl.prototype.defaultOptions = {
      keyLeft: RangeControl.prototype.keyCode.LEFT,
      keyRight: RangeControl.prototype.keyCode.RIGHT,
      min: 0,
      max: 100,
      step: 1,
      timeout: 500,
      formatControlCallback: function(value) {
        return value;
      }
    };

    function RangeControl(el, options) {
      this.el = el;
      this.options = options;
      this.settings = $.extend({}, this.defaultOptions, options);
      this.el.data(this.PLUGINNAME, this);
      this._formatControlCallback = this.settings.formatControlCallback;
      this._renderRangeControl();
      this.min(this.el.data('min') || this.settings.min);
      this.max(this.el.data('max') || this.settings.max);
      this.step(this.el.data('step') || this.settings.step);
      this._initDimensions();
      this.leftValue(this.el.data('left-value') || this.settings.leftValue || this._min);
      this.rightValue(this.el.data('right-value') || this.settings.rightValue || this._max);
      this._initControls();
      this._bindResize();
    }

    RangeControl.prototype.min = function(min) {
      if (min != null) {
        return this._min = parseInt(min);
      } else {
        return this._min;
      }
    };

    RangeControl.prototype.max = function(max) {
      if (max != null) {
        return this._max = parseInt(max);
      } else {
        return this._max;
      }
    };

    RangeControl.prototype.step = function(step) {
      if (step) {
        return this._step = parseInt(step);
      } else {
        return this._step;
      }
    };

    RangeControl.prototype.value = function() {
      return {
        'leftValue': this._getLeftValue(),
        'rightValue': this._getRightValue()
      };
    };

    RangeControl.prototype.leftValue = function(value) {
      if (value != null) {
        this._leftControlValue = this._validateLeftValue(value);
        this._renderLeftControl(this._leftControlValue);
        this._formatLeftControl();
        return this._renderRange();
      } else {
        return this._getLeftValue();
      }
    };

    RangeControl.prototype.rightValue = function(value) {
      if (value != null) {
        this._rightControlValue = this._validateRightValue(value);
        this._renderRightControl(this._rightControlValue);
        this._formatRightControl();
        return this._renderRange();
      } else {
        return this._getRightValue();
      }
    };

    RangeControl.prototype._getLeftValue = function() {
      if (this._valueStep === 1) {
        return this._leftControlValue;
      } else {
        return this._min + ((this._leftControlValue - this._min) - (this._leftControlValue - this._min) % this._step);
      }
    };

    RangeControl.prototype._getRightValue = function() {
      if (this._valueStep === 1) {
        return this._rightControlValue;
      } else {
        return this._min + ((this._rightControlValue - this._min) - (this._rightControlValue - this._min) % this._step);
      }
    };

    RangeControl.prototype._getValueByPosition = function(x) {
      return this._min + Math.round(x / this._pxInValue);
    };

    RangeControl.prototype._valueByControl = function(control, value) {
      if (control != null) {
        if (control[0] === this._leftControl[0]) {
          if (value != null) {
            return this.leftValue(value);
          } else {
            return this._leftControlValue;
          }
        } else if (control[0] === this._rightControl[0]) {
          if (value != null) {
            return this.rightValue(value);
          } else {
            return this._rightControlValue;
          }
        }
      }
    };

    RangeControl.prototype._getPositionByValue = function(x) {
      return x * this._pxInValue;
    };

    RangeControl.prototype._getPositionWithControlByValue = function(x) {
      return this._getPositionByValue(x) + this._controlWidth;
    };

    RangeControl.prototype._bindControlKeys = function() {
      var control, controls, _i, _len, _results,
        _this = this;
      controls = [this._leftControl, this._rightControl];
      _results = [];
      for (_i = 0, _len = controls.length; _i < _len; _i++) {
        control = controls[_i];
        _results.push(control.on("keydown", function(e) {
          control = $(e.currentTarget);
          if (e.keyCode === _this.settings.keyLeft) {
            return _this._valueByControl(control, _this._valueByControl(control) - 1);
          } else if (e.keyCode === _this.settings.keyRight) {
            return _this._valueByControl(control, _this._valueByControl(control) + 1);
          }
        }));
      }
      return _results;
    };

    RangeControl.prototype._bindResize = function() {
      var _this = this;
      return $(window).on('resize', function() {
        return _this.render();
      });
    };

    RangeControl.prototype._initDimensions = function() {
      this._controlWidth = this._leftControl.outerWidth();
      this._width = this.el.outerWidth();
      this._widthWithoutPaddings = this.el.width();
      return this._pxInValue = this._widthWithoutPaddings / (this._max - this._min);
    };

    RangeControl.prototype._initControls = function() {
      var control, controls, _i, _len,
        _this = this;
      controls = [this._leftControl, this._rightControl];
      for (_i = 0, _len = controls.length; _i < _len; _i++) {
        control = controls[_i];
        control.on('dragstart', function() {
          return false;
        });
        control.on('mouseup', function() {
          _this.dragged = false;
          control.removeClass(_this.DRAGCLASSNAME);
          return $(document).off('mousemove');
        });
      }
      this._leftControl.on('mousedown', function(event) {
        var leftLimit, rightLimit, shiftX, zeroCoordinate;
        if (event.which !== 1) {
          return;
        }
        _this._leftControl.addClass(_this.DRAGCLASSNAME);
        _this._dragged = true;
        zeroCoordinate = _this.el.offset().left;
        shiftX = event.clientX - _this._leftControl.offset().left;
        leftLimit = 0;
        rightLimit = _this._rightControl.offset().left - zeroCoordinate;
        return $(document).on('mousemove', function(event) {
          return _this._controlMoveTo(_this._leftControl, event.clientX, zeroCoordinate, shiftX, leftLimit, rightLimit);
        });
      });
      this._rightControl.on('mousedown', function(event) {
        var leftLimit, rightLimit, shiftX, zeroCoordinate;
        if (event.which !== 1) {
          return;
        }
        _this._rightControl.addClass(_this.DRAGCLASSNAME);
        _this._dragged = true;
        zeroCoordinate = _this.el.offset().left;
        shiftX = event.clientX - _this._rightControl.offset().left;
        leftLimit = _this._leftControl.offset().left - zeroCoordinate + _this._controlWidth;
        rightLimit = _this._width;
        return $(document).on('mousemove', function(event) {
          return _this._controlMoveTo(_this._rightControl, event.clientX, zeroCoordinate, shiftX, leftLimit, rightLimit);
        });
      });
      this._leftControl.on('click', function() {
        return false;
      });
      this._rightControl.on('click', function() {
        return false;
      });
      $(document).on('mouseup', function() {
        _this._leftControl.triggerHandler('mouseup');
        return _this._rightControl.triggerHandler('mouseup');
      });
      this._renderLeftControl(this._leftControlValue);
      this._renderRightControl(this._rightControlValue);
      return this._bindControlKeys();
    };

    RangeControl.prototype._controlMoveTo = function(control, stopPoint, zeroCoordinate, shiftX, leftLimit, rightLimit) {
      var controlLeftPosition, leftBorderPosition, rightBorderPosition;
      leftBorderPosition = stopPoint - zeroCoordinate - shiftX;
      rightBorderPosition = stopPoint - zeroCoordinate - shiftX + this._controlWidth;
      if (leftBorderPosition >= leftLimit && rightBorderPosition < rightLimit) {
        controlLeftPosition = leftBorderPosition;
      }
      if (leftBorderPosition < leftLimit) {
        controlLeftPosition = leftLimit;
      }
      if (rightBorderPosition > rightLimit) {
        controlLeftPosition = rightLimit - this._controlWidth;
      }
      if (control === this._leftControl) {
        this.leftValue(this._getValueByPosition(controlLeftPosition));
      }
      if (control === this._rightControl) {
        this.rightValue(this._getValueByPosition(controlLeftPosition - this._controlWidth));
      }
      return this._fireChangeEvent();
    };

    RangeControl.prototype._renderRangeControl = function() {
      var range;
      this.el.addClass(this.PLUGINNAME);
      this.el.children().remove();
      this._leftControl = $("<button class='" + this.PLUGINNAME + "__left'></button>");
      this._rightControl = $("<button class='" + this.PLUGINNAME + "__right'></button>");
      this._rangeElement = $("<div class='" + this.PLUGINNAME + "__range is-active'></div>");
      range = $("<div class='" + this.PLUGINNAME + "__range'></div>");
      return this.el.append(this._leftControl).append(this._rightControl).append(range).append(this._rangeElement);
    };

    RangeControl.prototype._renderRange = function() {
      var leftBorder, rightBorder;
      leftBorder = ((this._leftControlValue - this._min) * this._pxInValue) + this._controlWidth - (this._controlWidth / 2);
      rightBorder = ((this._rightControlValue - this._min) * this._pxInValue) + this._controlWidth + (this._controlWidth / 2);
      return this._rangeElement.css({
        'left': leftBorder,
        'right': this._width - rightBorder
      });
    };

    RangeControl.prototype._renderLeftControl = function(value) {
      var position;
      position = (value - this._min) * this._pxInValue;
      return this._leftControl.css({
        left: position
      });
    };

    RangeControl.prototype._renderRightControl = function(value) {
      var position;
      position = this._controlWidth + ((value - this._min) * this._pxInValue);
      return this._rightControl.css({
        left: position
      });
    };

    RangeControl.prototype._validateLeftValue = function(value) {
      if (value <= this._min) {
        return this._min;
      } else if (value >= this._rightControlValue) {
        return this._rightControlValue;
      } else {
        return value;
      }
    };

    RangeControl.prototype._validateRightValue = function(value) {
      if (value >= this._max) {
        return this._max;
      } else if (value <= this._leftControlValue) {
        return this._leftControlValue;
      } else {
        return value;
      }
    };

    RangeControl.prototype._formatLeftControl = function() {
      if (this._formatControlCallback != null) {
        return this._leftControl.html(this._formatControlCallback(this.leftValue()));
      }
    };

    RangeControl.prototype._formatRightControl = function() {
      if (this._formatControlCallback != null) {
        return this._rightControl.html(this._formatControlCallback(this.rightValue()));
      }
    };

    RangeControl.prototype._formatValue = function(x) {
      return x;
    };

    RangeControl.prototype._fireChangeEvent = function() {
      var _this = this;
      clearTimeout(this._changeTimeout);
      return this._changeTimeout = setTimeout(function() {
        return _this.el.trigger('change', _this.value());
      }, this.settings.timeout);
    };

    RangeControl.prototype.render = function() {
      this._initDimensions();
      this.leftValue(this._leftControlValue);
      return this.rightValue(this._rightControlValue);
    };

    RangeControl.prototype.rebuild = function(options) {
      if (options == null) {
        options = this.options;
      }
      return this.constructor(this.el, options);
    };

    RangeControl.prototype.destroy = function() {
      this.el.html("");
      return this.el.removeData(this.PLUGINNAME);
    };

    return RangeControl;

  })();

  RangeControlGraph = (function(_super) {

    __extends(RangeControlGraph, _super);

    RangeControlGraph.prototype.PLUGINNAME = 'range-control-graph';

    RangeControlGraph.prototype.defaultOptions = {
      keyLeft: RangeControlGraph.prototype.keyCode.LEFT,
      keyRight: RangeControlGraph.prototype.keyCode.RIGHT,
      min: 0,
      max: 100,
      step: 1,
      timeout: 500,
      formatControlCallback: function(value) {
        return value;
      },
      colorsRange: {
        "#e6ead4": [0, 100],
        "#ced7a6": [101, 1000],
        "#b4c373": [1001, 10000],
        "#fed46d": [10001]
      },
      colorCell: "#288bf0"
    };

    function RangeControlGraph(el, options) {
      this.el = el;
      this.options = options;
      this.settings = $.extend({}, this.defaultOptions, options);
      this._renderRangeControl();
      this._initDimensions();
      this._renderRange();
      this.min(0);
      this.max(Object.keys(this.options.data).length);
      this.leftValue(this.min());
      this.rightValue(this.max());
      RangeControlGraph.__super__.constructor.call(this, this.el, $.extend(this.settings, {
        min: this.min(),
        max: this.max()
      }));
    }

    RangeControlGraph.prototype._renderRangeControl = function() {
      this.el.addClass(this.PLUGINNAME);
      this.el.children().remove();
      this._leftControl = $("<button class='" + this.PLUGINNAME + "__left'></button>").appendTo(this.el);
      this._rightControl = $("<button class='" + this.PLUGINNAME + "__right'></button>").appendTo(this.el);
      this._rangeElement = $("<canvas class='" + this.PLUGINNAME + "__range'></canvas>").appendTo(this.el);
      this._rangeElementHover = $("<canvas class='" + this.PLUGINNAME + "__range-hover'></canvas>").appendTo(this.el);
      this._rangeGreyWrapLeft = $("<div class='" + this.PLUGINNAME + "__wrap-range-grey-left'></div>");
      this._rangeGreyElementLeft = $("<canvas class='" + this.PLUGINNAME + "__range-grey'></canvas>").appendTo(this._rangeGreyWrapLeft);
      this._rangeGreyWrapRight = $("<div class='" + this.PLUGINNAME + "__wrap-range-grey-right'></div>");
      this._rangeGreyElementRight = $("<canvas class='" + this.PLUGINNAME + "__range-grey'></canvas>").appendTo(this._rangeGreyWrapRight);
      this._hoverElement = $("<div class='" + this.PLUGINNAME + "__hover'>111</div>").appendTo(this.el);
      this._rangeGreyWrapLeft.appendTo(this.el);
      return this._rangeGreyWrapRight.appendTo(this.el);
    };

    RangeControlGraph.prototype._renderRange = function() {
      var dataSize, rangeVolumes, value, volume;
      rangeVolumes = (function() {
        var _ref, _results;
        _ref = this.options.data;
        _results = [];
        for (value in _ref) {
          volume = _ref[value];
          _results.push(volume);
        }
        return _results;
      }).call(this);
      this._maxRangeVolume = Math.max.apply(null, rangeVolumes);
      dataSize = Object.keys(this.options.data).length;
      this.canvas = this._rangeElement[0].getContext('2d');
      this.canvasScale = 30;
      this.canvasHeight = this.el.height();
      this.canvasWidth = dataSize * this.canvasScale;
      this._rangeElement[0].width = dataSize * this.canvasScale;
      this._rangeElement[0].height = this.el.height();
      this._rangeElement.width(this._widthWithoutPaddings);
      this._renderColorRange();
      this._renderRangeCells();
      this._renderGreyRange();
      this._renderRangeWraps();
      return this._renderRangeHover();
    };

    RangeControlGraph.prototype._renderColorRange = function() {
      var color, colorRange, data, i, leftColorRange, range, rightColorRange, value;
      if (this.dataColorRange == null) {
        this.dataColorRange = {};
        colorRange = this.settings.colorsRange;
        data = this.settings.data;
        for (color in colorRange) {
          range = colorRange[color];
          this.dataColorRange[color] = [];
          i = -1;
          for (value in data) {
            i++;
            leftColorRange = range[0];
            rightColorRange = range[1] != null ? range[1] : Infinity;
            if ((leftColorRange <= value && value <= rightColorRange)) {
              this.dataColorRange[color].push(i);
              continue;
            } else if (value > rightColorRange) {
              break;
            }
          }
        }
      }
      return this._drawColorRange();
    };

    RangeControlGraph.prototype._drawColorRange = function() {
      var color, leftRangeItem, numberOfItem, range, rightRangeItem, _ref, _results;
      _ref = this.dataColorRange;
      _results = [];
      for (color in _ref) {
        range = _ref[color];
        leftRangeItem = Math.min.apply(null, range);
        rightRangeItem = Math.max.apply(null, range);
        numberOfItem = range.length;
        this.canvas.fillStyle = color;
        _results.push(this.canvas.fillRect(leftRangeItem * this.canvasScale, 0, numberOfItem * this.canvasScale, this.canvasHeight));
      }
      return _results;
    };

    RangeControlGraph.prototype._renderRangeCells = function() {
      var i, value, volume, _ref, _results;
      i = 0;
      this.canvas.fillStyle = this.settings.colorCell;
      _ref = this.options.data;
      _results = [];
      for (value in _ref) {
        volume = _ref[value];
        _results.push(this._renderRangeCell(i++, volume));
      }
      return _results;
    };

    RangeControlGraph.prototype._renderRangeCell = function(i, volume) {
      var cellHeight;
      cellHeight = this.canvasHeight / this._maxRangeVolume * volume;
      return this.canvas.fillRect(this.canvasScale * i, this.canvasHeight, this.canvasScale, -cellHeight);
    };

    RangeControlGraph.prototype._renderGreyRange = function() {
      var brightness, data, i, imageData, _i, _ref;
      this.greyCanvasLeft = this._rangeGreyElementLeft[0].getContext('2d');
      this._rangeGreyElementLeft[0].width = this._rangeElement[0].width;
      this._rangeGreyElementLeft[0].height = this._rangeElement[0].height;
      this._rangeGreyElementLeft.width(this._widthWithoutPaddings);
      this.greyCanvasRight = this._rangeGreyElementRight[0].getContext('2d');
      this._rangeGreyElementRight[0].width = this._rangeElement[0].width;
      this._rangeGreyElementRight[0].height = this._rangeElement[0].height;
      this._rangeGreyElementRight.width(this._widthWithoutPaddings);
      imageData = this.canvas.getImageData(0, 0, this._rangeElement[0].width, this._rangeElement[0].height);
      data = imageData.data;
      for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 4) {
        brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        data[i] = brightness;
        data[i + 1] = brightness;
        data[i + 2] = brightness;
      }
      this.greyCanvasLeft.putImageData(imageData, 0, 0);
      return this.greyCanvasRight.putImageData(imageData, 0, 0);
    };

    RangeControlGraph.prototype._renderRangeWraps = function() {
      var leftWidth, rightWidth;
      leftWidth = ((this._leftControlValue - this._min) * this._pxInValue) + this._controlWidth - (this._controlWidth / 2);
      rightWidth = this._width - ((this._rightControlValue - this._min) * this._pxInValue + this._controlWidth + (this._controlWidth / 2));
      this._rangeGreyWrapLeft.css({
        'width': leftWidth
      });
      return this._rangeGreyWrapRight.css({
        'width': rightWidth
      });
    };

    RangeControlGraph.prototype._renderRangeHover = function() {
      var _this = this;
      this.canvasHover = this._rangeElementHover[0].getContext('2d');
      this._rangeElementHover[0].width = this._rangeElement[0].width;
      this._rangeElementHover[0].height = this._rangeElement[0].height;
      this._rangeElementHover.width(this._widthWithoutPaddings);
      this._rangeElementHover.on("mousemove", function(e) {
        var value, x;
        x = e.offsetX;
        value = _this._getValueByPosition(x);
        _this._drawRangeHover(value);
        _this._hoverElement.show().css({
          left: _this._getPositionWithControlByValue(value)
        });
        return _this._hoverElement.text(_this._getVolumeByIndexNumber(value));
      });
      return this._rangeElementHover.on("mouseout", function(e) {
        _this._clearRangeHover();
        return _this._hoverElement.hide();
      });
    };

    RangeControlGraph.prototype._drawRangeHover = function(value) {
      this._clearRangeHover();
      return this._renderRangeCell(value, this.getVolumeByValue(value));
    };

    RangeControlGraph.prototype._clearRangeHover = function() {
      return this.canvasHover.clearRect(0, 0, this._rangeElement[0].width, this._rangeElement[0].height);
    };

    RangeControlGraph.prototype._formatLeftControl = function() {
      var value;
      value = this._getLeftValue();
      if (this._formatControlCallback != null) {
        return this._leftControl.html(this._formatControlCallback(value));
      }
    };

    RangeControlGraph.prototype._formatRightControl = function() {
      var value;
      value = this._getRightValue();
      if (this._formatControlCallback != null) {
        return this._rightControl.html(this._formatControlCallback(value));
      }
    };

    RangeControlGraph.prototype._getLeftValue = function() {
      return this._getValueByIndexNumber(this._leftControlValue);
    };

    RangeControlGraph.prototype._getRightValue = function() {
      return this._getValueByIndexNumber(this._rightControlValue);
    };

    RangeControlGraph.prototype._getValueByIndexNumber = function(i) {
      var value;
      value = Object.keys(this.options.data)[i - 1];
      if (value == null) {
        value = 0;
      }
      return parseInt(value);
    };

    RangeControlGraph.prototype.getVolumeByValue = function(value) {
      return this.options.data[value];
    };

    RangeControlGraph.prototype._getVolumeByIndexNumber = function(i) {
      return this.getVolumeByValue(this._getValueByIndexNumber(i));
    };

    RangeControlGraph.prototype.testCanvasSupport = function() {
      return !!document.createElement('canvas').getContext;
    };

    return RangeControlGraph;

  })(RangeControl);

  $.fn.rangeControl = function(options) {
    var pluginName;
    pluginName = RangeControl.prototype.PLUGINNAME;
    return this.each(function() {
      if ($(this).data(pluginName) === void 0) {
        return new RangeControl($(this), options);
      } else {
        return $(this).data(pluginName);
      }
    });
  };

  $.fn.rangeControlGraph = function(options) {
    var pluginName;
    pluginName = RangeControlGraph.prototype.PLUGINNAME;
    return this.each(function() {
      if ($(this).data(pluginName) === void 0) {
        return new RangeControlGraph($(this), options);
      } else {
        return $(this).data(pluginName);
      }
    });
  };

}).call(this);
