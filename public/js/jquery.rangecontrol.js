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
        'leftValue': this.leftValue(),
        'rightValue': this.rightValue()
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
            return this.leftValue();
          }
        } else if (control[0] === this._rightControl[0]) {
          if (value != null) {
            return this.rightValue(value);
          } else {
            return this.rightValue();
          }
        }
      }
    };

    RangeControl.prototype._getPositionByValue = function(x) {};

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
      $(document).on('mouseup', function() {
        _this._leftControl.triggerHandler('mouseup');
        return _this._rightControl.triggerHandler('mouseup');
      });
      this._renderLeftControl(this.leftValue());
      this._renderRightControl(this.rightValue());
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
      this._leftControl = $("<button class='" + this.PLUGINNAME + "__left'></<button>");
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
      } else if (value >= this.rightValue()) {
        return this.rightValue();
      } else {
        return value;
      }
    };

    RangeControl.prototype._validateRightValue = function(value) {
      if (value >= this._max) {
        return this._max;
      } else if (value <= this.leftValue()) {
        return this.leftValue();
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
        return _this.el.trigger('change', _this.value);
      }, this.settings.timeout);
    };

    RangeControl.prototype.render = function() {
      this._initDimensions();
      this.leftValue(this.leftValue());
      return this.rightValue(this.rightValue());
    };

    RangeControl.prototype.rebuild = function() {
      return this.constructor(this.el, this.options);
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

    function RangeControlGraph(el, options) {
      this.el = el;
      RangeControlGraph.__super__.constructor.apply(this, arguments);
    }

    RangeControlGraph.prototype.renderRangeControl = function() {
      var range;

      this.el.addClass(this.PLUGINNAME);
      this.el.children().remove();
      this._leftControl = $("<button class='" + this.PLUGINNAME + "__left'></<button>");
      this._rightControl = $("<button class='" + this.PLUGINNAME + "__right'></button>");
      this._rangeElement = $("<div class='" + this.PLUGINNAME + "__range is-active'></div>");
      range = $("<div class='" + this.PLUGINNAME + "__range'></div>");
      return this.el.append(this._leftControl).append(this._rightControl).append(range).append(this._rangeElement);
    };

    RangeControlGraph.prototype.renderRange = function() {};

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
