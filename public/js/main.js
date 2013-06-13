//@ sourceMappingURL=main.map
(function() {
  var RangeControl, utilities;

  RangeControl = (function() {
    RangeControl._width;

    RangeControl._controlWidth;

    RangeControl._dragged = false;

    RangeControl._startValue = 0;

    RangeControl._endValue = 100;

    RangeControl._valueStep = 0;

    RangeControl._draggedClassName = "is-dragged";

    RangeControl._leftControlValue;

    RangeControl._rightControlValue;

    RangeControl._rangeElement;

    function RangeControl(el) {
      var defaultOptions;

      this.el = el;
      defaultOptions = {
        startValue: 0,
        endValue: 100,
        valueStep: 1
      };
      this.startValue(this.el.data("start-value") || defaultOptions.startValue);
      this.endValue(this.el.data("end-value") || defaultOptions.endValue);
      this.valueStep(this.el.data("value-step") || defaultOptions.valueStep);
      this.leftValue(this.el.data("left-value") || this._startValue);
      this.rightValue(this.el.data("right-value") || this._endValue);
      this._leftControl = this.el.find(".range-control_mini__left");
      this._rightControl = this.el.find(".range-control_mini__right");
      this._rangeElement = this.el.find(".range-control_mini__range.is-active");
      this._controlWidth = this._leftControl.outerWidth();
      this._width = this.el.outerWidth();
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
        return this._leftControlValue = value;
      } else {
        return this._leftControlValue;
      }
    };

    RangeControl.prototype.rightValue = function(value) {
      if (value != null) {
        return this._rightControlValue = value;
      } else {
        return this._rightControlValue;
      }
    };

    RangeControl.prototype._getValueByPosition = function(x) {
      var pxInStep, value;

      pxInStep = this._width / ((this._endValue - this._startValue) / this._valueStep);
      value = parseInt(this._startValue + (x / pxInStep));
      return console.log(value);
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
        this._leftControlValue = this._getValueByPosition(control.position().left);
        console.log(this.leftValue());
      }
      if (control === this._rightControl) {
        this._rightControlValue = this._getValueByPosition(control.position().left - this._controlWidth);
        return console.log(this.rightValue());
      }
    };

    RangeControl.prototype._renderRange = function(leftLimit, rightLimit) {
      return this._rangeElement.css();
    };

    RangeControl.prototype._renderControls = function() {};

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

    rangeControl = new RangeControl($(control));
    return console.log(rangeControl.endValue());
  });

}).call(this);
