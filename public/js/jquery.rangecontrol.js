//@ sourceMappingURL=jquery.rangecontrol.map
(function() {
  var RangeControl;

  RangeControl = (function() {
    RangeControl._dragged = false;

    RangeControl._startValue = 0;

    RangeControl._endValue = 100;

    RangeControl._valueStep = 0;

    RangeControl._renderControlCallback;

    RangeControl._width;

    RangeControl._widthWithoutPaddings;

    RangeControl._controlWidth;

    RangeControl._pxInValue;

    RangeControl._leftControlValue;

    RangeControl._rightControlValue;

    RangeControl._rangeElement;

    RangeControl._changeTimeout;

    RangeControl.settings;

    RangeControl.prototype._draggedClassName = 'is-dragged';

    RangeControl.prototype.defaultOptions = {
      startValue: 0,
      endValue: 100,
      valueStep: 1,
      timeout: 500,
      formatControlCallback: function(value) {
        return value;
      }
    };

    function RangeControl(el, options) {
      this.el = el;
      this.settings = $.extend({}, this.defaultOptions, options);
      this.el.data('range-control', this);
      this._formatControlCallback = this.settings.formatControlCallback;
      this._leftControl = this.el.find('.range-control_mini__left');
      this._rightControl = this.el.find('.range-control_mini__right');
      this._rangeElement = this.el.find('.range-control_mini__range.is-active');
      this.startValue(this.el.data('start-value') || this.settings.startValue);
      this.endValue(this.el.data('end-value') || this.settings.endValue);
      this.valueStep(this.el.data('value-step') || this.settings.valueStep);
      this._controlWidth = this._leftControl.outerWidth();
      this._width = this.el.outerWidth();
      this._widthWithoutPaddings = this.el.width();
      this._pxInValue = this._widthWithoutPaddings / (this._endValue - this._startValue);
      this.leftValue(this.el.data('left-value') || this.settings.leftValue || this._startValue);
      this.rightValue(this.el.data('right-value') || this.settings.rightValue || this._endValue);
      this._initControls();
    }

    RangeControl.prototype.startValue = function(startValue) {
      if (startValue != null) {
        return this._startValue = parseInt(startValue);
      } else {
        return this._startValue;
      }
    };

    RangeControl.prototype.endValue = function(endValue) {
      if (endValue != null) {
        return this._endValue = parseInt(endValue);
      } else {
        return this._endValue;
      }
    };

    RangeControl.prototype.valueStep = function(valueStep) {
      if (valueStep != null) {
        return this._valueStep = parseInt(valueStep);
      } else {
        return this._valueStep;
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
        this._leftValueWithoutRender(value);
        return this._renderLeftControl(value);
      } else {
        return this._leftValueWithoutRender(value);
      }
    };

    RangeControl.prototype._leftValueWithoutRender = function(value) {
      if (value != null) {
        if (value >= this._startValue) {
          this._leftControlValue = value;
        } else {
          this._leftControlValue = this._startValue;
        }
        this._renderRange();
        return this._formatLeftControl();
      } else {
        if (this._valueStep === 1) {
          return this._leftControlValue;
        } else {
          return this._startValue + ((this._leftControlValue - this._startValue) - (this._leftControlValue - this._startValue) % this._valueStep);
        }
      }
    };

    RangeControl.prototype.rightValue = function(value) {
      if (value != null) {
        this._rightValueWithoutRender(value);
        return this._renderRightControl(value);
      } else {
        return this._rightValueWithoutRender(value);
      }
    };

    RangeControl.prototype._rightValueWithoutRender = function(value) {
      if (value != null) {
        if (value <= this._endValue) {
          this._rightControlValue = value;
        } else {
          this._rightControlValue = this._endValue;
        }
        this._renderRange();
        return this._formatRightControl();
      } else {
        if (this._valueStep === 1) {
          return this._rightControlValue;
        } else {
          return this._startValue + ((this._rightControlValue - this._startValue) - (this._rightControlValue - this._startValue) % this._valueStep);
        }
      }
    };

    RangeControl.prototype.renderControl = function(renderControlCallback) {
      if (renderControlCallback != null) {
        if (typeof renderControlCallback === 'function') {
          return this._renderControlCallback = renderControlCallback;
        }
      }
    };

    RangeControl.prototype._getValueByPosition = function(x) {
      return this._startValue + parseInt(x / this._pxInValue);
    };

    RangeControl.prototype._getPositionByValue = function(x) {};

    RangeControl.prototype._initControls = function() {
      var controls,
        _this = this;

      controls = [this._leftControl, this._rightControl];
      controls.forEach(function(control) {
        control.on('dragstart', function() {
          return false;
        });
        return control.on('mouseup', function() {
          _this.dragged = false;
          _this._leftControl.removeClass(_this._draggedClassName);
          return $(document).off('mousemove');
        });
      });
      this._leftControl.on('mousedown', function(event) {
        var leftLimit, rightLimit, shiftX, zeroCoordinate;

        if (event.which !== 1) {
          return;
        }
        _this._leftControl.addClass(_this._draggedClassName);
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
        var controlWidth, leftLimit, rightLimit, shiftX, zeroCoordinate;

        if (event.which !== 1) {
          return;
        }
        _this._rightControl.addClass(_this._draggedClassName);
        _this._dragged = true;
        zeroCoordinate = _this.el.offset().left;
        controlWidth = _this._controlWidth;
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
      return this._renderRightControl(this.rightValue());
    };

    RangeControl.prototype._controlMoveTo = function(control, stopPoint, zeroCoordinate, shiftX, leftLimit, rightLimit) {
      var controlLeftPosition, leftBorderPosition, rightBorderPosition;

      leftBorderPosition = stopPoint - zeroCoordinate - shiftX;
      rightBorderPosition = stopPoint - zeroCoordinate - shiftX + this._controlWidth;
      if (leftBorderPosition >= leftLimit && rightBorderPosition < rightLimit) {
        control.css('left', leftBorderPosition);
      }
      if (leftBorderPosition < leftLimit) {
        control.css('left', leftLimit);
      }
      if (rightBorderPosition > rightLimit) {
        control.css('left', rightLimit - this._controlWidth);
      }
      controlLeftPosition = control.position().left;
      if (control === this._leftControl) {
        this._leftValueWithoutRender(this._getValueByPosition(controlLeftPosition));
      }
      if (control === this._rightControl) {
        this._rightValueWithoutRender(this._getValueByPosition(controlLeftPosition - this._controlWidth));
      }
      return this._fireChangeEvent();
    };

    RangeControl.prototype._renderRange = function() {
      var leftBorder, rightBorder;

      leftBorder = ((this._leftControlValue - this._startValue) * this._pxInValue) + this._controlWidth - (this._controlWidth / 2);
      rightBorder = ((this._rightControlValue - this._startValue) * this._pxInValue) + this._controlWidth + (this._controlWidth / 2);
      return this._rangeElement.css({
        'left': leftBorder,
        'right': this._width - rightBorder
      });
    };

    RangeControl.prototype._renderLeftControl = function(value) {
      return this._leftControl.css({
        left: (value - this._startValue) * this._pxInValue
      });
    };

    RangeControl.prototype._renderRightControl = function(value) {
      return this._rightControl.css({
        left: this._controlWidth + ((value - this._startValue) * this._pxInValue)
      });
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

    RangeControl.prototype._fireChangeEvent = function() {
      var _this = this;

      clearTimeout(this._changeTimeout);
      return this._changeTimeout = setTimeout(function() {
        return _this.el.trigger('change', {
          'leftValue': _this.leftValue(),
          'rightValue': _this.rightValue()
        });
      }, this.settings.timeout);
    };

    return RangeControl;

  })();

  $.fn.rangeControl = function(options) {
    return this.each(function() {
      if ($(this).data('range-control') === void 0) {
        return new RangeControl($(this), options);
      }
    });
  };

}).call(this);
