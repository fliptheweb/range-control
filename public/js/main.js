//@ sourceMappingURL=main.map
(function() {
  var RangeControl, RangeTable, utilities;

  RangeControl = (function() {
    function RangeControl(el) {
      this.el = el;
      this.rangeTable = new RangeTable(this.el.find(".range-control__range table"));
    }

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
        volume;
      }
      if (volume < 1000000) {
        volume / 1000 + "тыс.";
      }
      if (volume >= 1000000) {
        return volume / 1000000 + "млн.";
      }
    }
  };

  new RangeControl($(".range-control"));

}).call(this);
