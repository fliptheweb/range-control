//@ sourceMappingURL=main.map
(function() {
  var RangeCells, RangeControl, utilities;

  RangeControl = (function() {
    RangeControl._dragged = false;

    RangeControl._startValue = 0;

    RangeControl._endValue = 100;

    RangeControl._valueStep = 0;

    function RangeControl(el) {
      var defaultOptions;

      this.el = el;
      defaultOptions = {
        startValue: 0,
        endValue: 100,
        34: 34,
        valueStep: 0
      };
      this.startValue(this.el.data("start-value") || defaultOptions.startValue);
      this.endValue(this.el.data("end-value") || defaultOptions.endValue);
      this.valueStep(this.el.data("value-step") || defaultOptions.valueStep);
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
