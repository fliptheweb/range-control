//@ sourceMappingURL=main.map
(function() {
  var RangeControl, RangeTable, utilities;

  RangeControl = (function() {
    function RangeControl(el) {
      this.el = el;
      this.rangeTable = new RangeTable(this.el.find(".range-control__range"));
      this.bindControls();
    }

    RangeControl.prototype.bindControls = function() {
      var _this = this;

      this.leftControl = this.el.find(".range-control__left");
      this.rightControl = this.el.find(".range-control__right");
      this.leftControl.on("dragstart", function() {
        return false;
      });
      this.rightControl.on("dragstart", function() {
        return false;
      });
      this.leftControl.on("mousedown", function(event) {
        var leftLimit, rightLimit, shiftX, zeroCoordinate;

        _this.leftControl.addClass("is-dragged");
        zeroCoordinate = _this.el.offset().left;
        shiftX = event.clientX - _this.leftControl.offset().left;
        leftLimit = 0;
        rightLimit = _this.rightControl.offset().left - zeroCoordinate;
        return $(document).on("mousemove", function(event) {
          return _this.controlMoveTo(_this.leftControl, event.clientX, zeroCoordinate, shiftX, leftLimit, rightLimit);
        });
      });
      this.rightControl.on("mousedown", function(event) {
        var controlWidth, leftLimit, rightLimit, shiftX, zeroCoordinate;

        _this.rightControl.addClass("is-dragged");
        zeroCoordinate = _this.el.offset().left;
        controlWidth = _this.rightControl.outerWidth();
        shiftX = event.clientX - _this.rightControl.offset().left;
        leftLimit = _this.leftControl.offset().left - zeroCoordinate + _this.leftControl.outerWidth();
        rightLimit = _this.el.width();
        return $(document).on("mousemove", function(event) {
          $(document).on("mousemove", function(event) {});
          return _this.controlMoveTo(_this.rightControl, event.clientX, zeroCoordinate, shiftX, leftLimit, rightLimit);
        });
      });
      this.leftControl.on("mouseup", function() {
        _this.leftControl.removeClass("is-dragged");
        return $(document).off("mousemove");
      });
      this.rightControl.on("mouseup", function() {
        _this.rightControl.removeClass("is-dragged");
        return $(document).off("mousemove");
      });
      return $(document).on("mouseup", function() {
        _this.leftControl.triggerHandler("mouseup");
        return _this.rightControl.triggerHandler("mouseup");
      });
    };

    RangeControl.prototype.controlMoveTo = function(control, stopPoint, zeroCoordinate, shiftX, leftLimit, rightLimit) {
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
        control.css("left", rightLimit - controlWidth);
      }
      if (control === this.leftControl) {
        this.changeControlRateText(control, this.rangeTable.getRateByPosition(control.position().left));
      }
      if (control === this.rightControl) {
        return this.changeControlRateText(control, this.rangeTable.getRateByPosition(control.position().left - controlWidth));
      }
    };

    RangeControl.prototype.changeControlRateText = function(control, text) {
      return control.find("span").text(utilities.shortenVolumeToName(text));
    };

    return RangeControl;

  })();

  RangeTable = (function() {
    function RangeTable(el) {
      this.el = el;
      this.cells = this.el.find("div");
      this.cellHoverEl = $("<div/>").addClass("range-control__cell-hover").insertBefore(this.el);
      this.cellWidth = 100 / this.cells.size();
      this.data = [];
      this.height = this.el.height();
      this.buildDataFromCells();
      this.buildCells();
    }

    RangeTable.prototype.buildDataFromCells = function() {
      var x;

      this.data = this.cells.map(function(i, cell) {
        return {
          volume: $(cell).data("volume"),
          rate: $(cell).data("rate")
        };
      });
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

    RangeTable.prototype.buildCells = function() {
      var _this = this;

      return this.cells.each(function(i, cell) {
        cell = $(cell);
        $("<i/>").appendTo(cell).height(100 / _this.maxVolume * cell.data("volume") + "%");
        cell.width(_this.cellWidth + "%");
        _this.colorizeCell(cell);
        return _this.bindHoverToCell(cell);
      });
    };

    RangeTable.prototype.colorizeCell = function(cell) {
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

    RangeTable.prototype.getRateByPosition = function(x) {
      return $(this.getCellByPosition(x)).data("rate");
    };

    RangeTable.prototype.getCellByPosition = function(x) {
      var cellNum, cellWidthInPx;

      cellWidthInPx = this.el.width() / 100 * this.cellWidth;
      cellNum = Math.ceil(x / cellWidthInPx);
      if (cellNum >= this.cells.size()) {
        return this.cells.last();
      }
      return this.cells.eq(cellNum);
    };

    RangeTable.prototype.bindHoverToCell = function(cell) {
      var cellHoverEl, position;

      cell = $(cell);
      position = cell.position().left;
      cellHoverEl = this.cellHoverEl;
      return cell.hover(function() {
        return cellHoverEl.show().css("left", position).text(utilities.splitVolumeBySpace(cell.data("rate")));
      }, function() {
        return cellHoverEl.hide();
      });
    };

    return RangeTable;

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

  $(".range-control").each(function(i, control) {
    return new RangeControl($(control));
  });

}).call(this);
