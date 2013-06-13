//@ sourceMappingURL=main.map
(function() {
  var RangeControl, utilities;

  RangeControl = (function() {
    RangeControl._dragged = false;

    RangeControl._startValue = 0;

    RangeControl._endValue = 100;

    RangeControl._valueStep = 0;

    RangeControl._draggedClassName = "is-dragged";

    RangeControl._renderControlCallback;

    RangeControl._width;

    RangeControl._widthWithoutPaddings;

    RangeControl._controlWidth;

    RangeControl._pxInStep;

    RangeControl._stepInPx;

    RangeControl._leftControlValue;

    RangeControl._rightControlValue;

    RangeControl._rangeElement;

    function RangeControl(el) {
      var defaultOptions;

      this.el = el;
      defaultOptions = {
        startValue: 0,
        endValue: 100,
        valueStep: 1,
        renderControlCallback: function(value) {
          return value;
        }
      };
      this._renderControlCallback = defaultOptions.renderControlCallback;
      this._leftControl = this.el.find(".range-control_mini__left");
      this._rightControl = this.el.find(".range-control_mini__right");
      this._rangeElement = this.el.find(".range-control_mini__range.is-active");
      this.startValue(this.el.data("start-value") || defaultOptions.startValue);
      this.endValue(this.el.data("end-value") || defaultOptions.endValue);
      this.valueStep(this.el.data("value-step") || defaultOptions.valueStep);
      this.leftValue(this.el.data("left-value") || this._startValue);
      this.rightValue(this.el.data("right-value") || this._endValue);
      this._controlWidth = this._leftControl.outerWidth();
      this._width = this.el.outerWidth();
      this._widthWithoutPaddings = this.el.width();
      this._pxInStep = this._widthWithoutPaddings / ((this._endValue - this._startValue) / this._valueStep);
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

    RangeControl.prototype.leftValue = function(value) {
      if (value != null) {
        this._leftControlValue = value;
        this._renderRange();
        return this._renderLeftControl();
      } else {
        return this._leftControlValue;
      }
    };

    RangeControl.prototype.rightValue = function(value) {
      if (value != null) {
        this._rightControlValue = value;
        this._renderRange();
        return this._renderRightControl();
      } else {
        return this._rightControlValue;
      }
    };

    RangeControl.prototype.renderControl = function(renderControlCallback) {
      if (renderControlCallback != null) {
        if (typeof renderControlCallback === "function") {
          return this._renderControlCallback = renderControlCallback;
        }
      }
    };

    RangeControl.prototype._getValueByPosition = function(x) {
      return parseInt(this._startValue + (x / this._pxInStep));
    };

    RangeControl.prototype._initControls = function() {
      var controls,
        _this = this;

      controls = [this._leftControl, this._rightControl];
      controls.forEach(function(control) {
        control.on("dragstart", function() {
          return false;
        });
        return control.on("mouseup", function() {
          _this.dragged = false;
          _this._leftControl.removeClass(_this._draggedClassName);
          return $(document).off("mousemove");
        });
      });
      this._leftControl.on("mousedown", function(event) {
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
        return $(document).on("mousemove", function(event) {
          return _this._controlMoveTo(_this._leftControl, event.clientX, zeroCoordinate, shiftX, leftLimit, rightLimit);
        });
      });
      this._rightControl.on("mousedown", function(event) {
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
        return $(document).on("mousemove", function(event) {
          return _this._controlMoveTo(_this._rightControl, event.clientX, zeroCoordinate, shiftX, leftLimit, rightLimit);
        });
      });
      return $(document).on("mouseup", function() {
        _this._leftControl.triggerHandler("mouseup");
        return _this._rightControl.triggerHandler("mouseup");
      });
    };

    RangeControl.prototype._controlMoveTo = function(control, stopPoint, zeroCoordinate, shiftX, leftLimit, rightLimit) {
      var leftBorderPosition, rightBorderPosition;

      leftBorderPosition = stopPoint - zeroCoordinate - shiftX;
      rightBorderPosition = stopPoint - zeroCoordinate - shiftX + this._controlWidth;
      if (leftBorderPosition >= leftLimit && rightBorderPosition < rightLimit) {
        control.css("left", leftBorderPosition);
      }
      if (leftBorderPosition < leftLimit) {
        control.css("left", leftLimit);
      }
      if (rightBorderPosition > rightLimit) {
        control.css("left", rightLimit - this._controlWidth);
      }
      if (control === this._leftControl) {
        this.leftValue(this._getValueByPosition(control.position().left));
      }
      if (control === this._rightControl) {
        return this.rightValue(this._getValueByPosition(control.position().left - this._controlWidth));
      }
    };

    RangeControl.prototype._renderRange = function() {
      var leftBorder, rightBorder;

      leftBorder = (this.leftValue() * this._pxInStep) + this._controlWidth - (this._controlWidth / 2);
      rightBorder = (this.rightValue() * this._pxInStep) + this._controlWidth + (this._controlWidth / 2);
      return this._rangeElement.css({
        "left": leftBorder,
        "right": this._width - rightBorder
      });
    };

    RangeControl.prototype._renderLeftControl = function() {
      console.log(this._renderControlCallback);
      if (this._renderControlCallback != null) {
        return this._leftControl.html(this._renderControlCallback(this._leftControlValue));
      }
    };

    RangeControl.prototype._renderRightControl = function() {
      if (this._renderControlCallback != null) {
        return this._rightControl.html(this._renderControlCallback(this._rightControlValue));
      }
    };

    RangeControl.prototype.changeControlRateText = function(control, text) {
      return control.find("i").text(utilities.shortenVolumeToName(text));
    };

    return RangeControl;

  })();

  utilities = {
    shortenVolumeToName: function(volume) {
      if (volume < 1000) {
        return volume;
      }
      if (volume < 1000000) {
        return ("" + (volume / 1000)).replace(".", ",") + " тыс.";
      }
      if (volume >= 1000000) {
        return ("" + (volume / 1000000)).replace(".", ",") + " млн.";
      }
    },
    splitVolumeBySpace: function(volume) {
      return volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  };

  $(".range-control_mini").each(function(i, control) {
    var rangeControl;

    return rangeControl = new RangeControl($(control));
  });

}).call(this);
