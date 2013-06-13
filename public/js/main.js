//@ sourceMappingURL=main.map
(function() {
  var RangeCells, RangeControl, utilities;

  RangeControl = (function() {
    RangeControl._dragged = false;

    RangeControl._startValue = 0;

    RangeControl._endValue = 100;

    RangeControl._valueStep = 0;

    RangeControl._draggedClassName = "is-dragged";

    RangeControl._leftControlValue;

    RangeControl._rightControlValue;

    function RangeControl(el) {
      var defaultOptions;

      this.el = el;
      defaultOptions = {
        startValue: 0,
        endValue: 100,
        valueStep: 0
      };
      this.startValue(this.el.data("start-value") || defaultOptions.startValue);
      this.endValue(this.el.data("end-value") || defaultOptions.endValue);
      this.valueStep(this.el.data("value-step") || defaultOptions.valueStep);
      this.leftValue(this.el.data("left-value") || this.leftValue);
      this.rightValue(this.el.data("right-value") || this.rightValue);
      this._leftControl = this.el.find(".range-control_mini__left");
      this._rightControl = this.el.find(".range-control_mini__right");
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
        return this._leftControlValue;
      }
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
        controlWidth = _this._rightControl.outerWidth();
        shiftX = event.clientX - _this._rightControl.offset().left;
        leftLimit = _this._leftControl.offset().left - zeroCoordinate + _this._leftControl.outerWidth();
        rightLimit = _this.el.outerWidth();
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
      var controlWidth, leftBorderPosition, rightBorderPosition;

      controlWidth = control.outerWidth();
      leftBorderPosition = stopPoint - zeroCoordinate - shiftX;
      rightBorderPosition = stopPoint - zeroCoordinate - shiftX + controlWidth;
      if (leftBorderPosition >= leftLimit && rightBorderPosition < rightLimit) {
        control.css("left", leftBorderPosition);
      }
      if (leftBorderPosition < leftLimit) {
        control.css("left", leftLimit);
      }
      if (rightBorderPosition > rightLimit) {
        return control.css("left", rightLimit - controlWidth);
      }
    };

    RangeControl.prototype._renderRange = function() {};

    RangeControl.prototype.changeControlRateText = function(control, text) {
      return control.find("i").text(utilities.shortenVolumeToName(text));
    };

    return RangeControl;

  })();

  RangeCells = (function() {
    function RangeCells(el, rangeControl) {
      this.el = el;
      this.rangeControl = rangeControl;
      this.cells = this.el.find("div");
      this.cellHoverEl = $("<div/>").addClass("range-control__cell-hover").insertBefore(this.el);
      this.cellWidth = 100 / this.cells.size();
      this.data = [];
      this.height = this.el.height();
      this.buildDataFromCells();
      this.buildCells();
    }

    RangeCells.prototype.buildDataFromCells = function() {
      var x;

      this.data = this.cells.map(function(i, cell) {});
      return {
        volume: $(cell).data("volume"),
        rate: $(cell).data("rate")
      };
      return this.maxVolume = Math.max.apply(null, (function() {
        var _i, _len, _ref, _results;

        _ref = this.data;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push(x.volume);
        }
        return _results;
      }).call(this));
    };

    RangeCells.prototype.buildCells = function() {
      var _this = this;

      return this.cells.each(function(i, cell) {
        cell = $(cell);
        $("<i/>").appendTo(cell).height(100 / _this.maxVolume * cell.data("volume") + "%");
        cell.width(_this.cellWidth + "%");
        _this.colorizeCell(cell);
        return _this.bindHoverToCell(cell);
      });
    };

    RangeCells.prototype.colorizeCell = function(cell) {
      var colorRange, colorRanges, leftColorRange, rightColorRange, _ref, _results;

      colorRanges = {
        "light-green": [0, 100],
        "middle-green": [101, 1000],
        "green": [1001, 10000],
        "yellow": [10001]
      };
      _results = [];
      for (colorRange in colorRanges) {
        leftColorRange = colorRanges[colorRange][0];
        rightColorRange = colorRanges[colorRange][1];
        if (((leftColorRange <= (_ref = cell.data("rate")) && _ref <= rightColorRange)) || (leftColorRange <= cell.data("rate") && !rightColorRange)) {
          cell.addClass(colorRange);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    RangeCells.prototype.getRateOfCell = function(cell) {
      return cell.data("rate");
    };

    RangeCells.prototype.getRateByPosition = function(x) {
      return $(this.getCellByPosition(x)).data("rate");
    };

    RangeCells.prototype.getCellByPosition = function(x) {
      var cellNum;

      this.cellWidthInPx = this.el.width() / 100 * this.cellWidth;
      cellNum = Math.ceil(x / this.cellWidthInPx);
      if (cellNum >= this.cells.size()) {
        return this.cells.last();
      }
      return this.cells.eq(cellNum);
    };

    RangeCells.prototype.getCellByOrder = function(order) {
      return this.cells.eq(order - 1);
    };

    RangeCells.prototype.getFirstCell = function() {
      return this.getCellByOrder(1);
    };

    RangeCells.prototype.getLastCell = function() {
      return this.getCellByOrder(this.cells.size());
    };

    RangeCells.prototype.getPositionByCellOrder = function(order) {
      return this.cellWidthInPx * order;
    };

    RangeCells.prototype.bindHoverToCell = function(cell) {
      var cellHoverEl, position,
        _this = this;

      cell = $(cell);
      position = cell.position().left;
      cellHoverEl = this.cellHoverEl;
      cell.on("mouseover", function() {
        if (_this.rangeControl.dragged) {
          return;
        }
        return cellHoverEl.show().css("left", position).text(utilities.splitVolumeBySpace(cell.data("rate")));
      });
      return cell.on("mouseleave", function() {
        return cellHoverEl.hide();
      });
    };

    return RangeCells;

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
