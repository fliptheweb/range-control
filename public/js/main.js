//@ sourceMappingURL=main.map
(function() {
  var RangeControl, RangeTable, utilities;

  RangeControl = (function() {
    function RangeControl(el) {
      this.el = el;
      this.rangeTable = new RangeTable(this.el.find(".range-control__range table"));
      this.bindControls();
    }

    RangeControl.prototype.bindControls = function() {
      var _this = this;

      this.leftControl = this.el.find(".range-control__left");
      this.rightControl = this.el.find(".range-control__right");
      this.controlWidth = this.leftControl.width();
      this.leftControl.on("dragstart", function() {
        return false;
      });
      this.rightControl.on("dragstart", function() {
        return false;
      });
      this.leftControl.on("mousedown", function(event) {
        var moveTo, shiftX, zeroCoordinate;

        _this.leftControl.addClass("is-dragged");
        zeroCoordinate = _this.el.offset().left;
        shiftX = event.clientX - _this.leftControl.offset().left;
        moveTo = function(stopPoint) {
          var positionInParent;

          positionInParent = stopPoint - zeroCoordinate - shiftX;
          if ((positionInParent >= 0) && (positionInParent + _this.controlWidth <= _this.rightControl.offset().left - zeroCoordinate)) {
            return _this.leftControl.css("left", positionInParent);
          }
        };
        return $(document).on("mousemove", function(event) {
          return moveTo(event.clientX);
        });
      });
      this.rightControl.on("mousedown", function(event) {
        var moveTo, shiftX, zeroCoordinate;

        _this.rightControl.addClass("is-dragged");
        zeroCoordinate = _this.el.offset().left;
        shiftX = event.clientX - _this.rightControl.offset().left;
        moveTo = function(stopPoint) {
          var positionInParent;

          positionInParent = stopPoint - zeroCoordinate - shiftX;
          if ((positionInParent + _this.controlWidth < _this.el.width() - 1) && (positionInParent >= _this.leftControl.offset().left + _this.controlWidth - zeroCoordinate)) {
            return _this.rightControl.css("left", positionInParent);
          }
        };
        return $(document).on("mousemove", function(event) {
          return moveTo(event.clientX);
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
      return this.el.on("mouseleave", function() {
        _this.leftControl.removeClass("is-dragged");
        _this.rightControl.removeClass("is-dragged");
        return $(document).off("mousemove");
      });
    };

    return RangeControl;

  })();

  RangeTable = (function() {
    function RangeTable(el) {
      this.el = el;
      this.cells = this.el.find("td");
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
        var cellInner;

        cell = $(cell);
        cellInner = $("<div/>").appendTo(cell).height(100 / _this.maxVolume * cell.data("volume") + "%");
        return _this.colorizeCell(cell);
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

    RangeTable.prototype.getVolumeByPosition = function(x) {
      return $(this.getCellByPosition(x)).data("volume");
    };

    RangeTable.prototype.getCellByPosition = function(x) {};

    RangeTable.prototype.bindHoverToCell = function(cell) {
      cell = $(cell);
      return cell.hover();
    };

    return RangeTable;

  })();

  utilities = {
    shortenVolume: function(volume) {
      if (volume < 1000) {
        return volume;
      }
      if (volume < 1000000) {
        return ("" + (volume / 1000)).replace(".", ",") + " тыс.";
      }
      if (volume >= 1000000) {
        return ("" + (volume / 1000000)).replace(".", ",") + " млн.";
      }
    }
  };

  $(".range-control").each(function(i, control) {
    return new RangeControl($(control));
  });

}).call(this);
