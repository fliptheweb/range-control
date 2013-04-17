//@ sourceMappingURL=main.map
(function() {
  var RangeControl, RangeTable, utilities;

  RangeControl = (function() {
    function RangeControl(el) {
      this.el = el;
      this.buildRangeTable();
    }

    RangeControl.prototype.buildRangeTable = function() {
      return this.rangeTable = new RangeTable(this.el.find(".range-control__range table"));
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
      this.bindHoverToCells();
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
        cellInner = $("<div/>").appendTo(cell).height((100 / _this.maxVolume * cell.data("volume")) * _this.height / 100);
        return _this.colorizeCell(cell);
      });
    };

    RangeTable.prototype.colorizeCell = function(cell) {
      var colorRange, colorRanges, _ref, _results;

      colorRanges = {
        "light-green": [0, 100],
        "middle-green": [101, 1000],
        "green": [1001, 10000],
        "yellow": [10001]
      };
      _results = [];
      for (colorRange in colorRanges) {
        if ((colorRanges[colorRange][0] <= (_ref = cell.data("rate")) && _ref <= colorRanges[colorRange][1])) {
          cell.addClass(colorRange);
          break;
        }
        if (!colorRanges[colorRange][1] && colorRanges[colorRange][0] <= cell.data("rate")) {
          cell.addClass(colorRange);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    RangeTable.prototype.bindHoverToCells = function() {
      return this.cells.on("mouseover", function(cell) {
        return console.log(utilities.shortenVolume($(cell).data("volume")));
      });
    };

    RangeTable.prototype.getCellPosition = function(cell) {};

    return RangeTable;

  })();

  utilities = {
    shortenVolume: function(volume) {
      return volume;
    }
  };

  new RangeControl($(".range-control"));

}).call(this);
