//@ sourceMappingURL=main.map
(function() {
  var RangeControl, RangeTable;

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
      var x,
        _this = this;

      this.cells.each(function(i, cell) {
        cell = $(cell);
        return _this.data.push({
          volume: cell.data("volume"),
          rate: cell.data("rate")
        });
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
        return cellInner = $("<div/>").appendTo(cell).height((100 / _this.maxVolume * cell.data("volume")) * _this.height / 100);
      });
    };

    RangeTable.prototype.bindHoverToCells = function() {
      return this.cells.on("mouseover", function(cell) {
        return console.log(utilities.shortenVolume($(cell).data("volume")));
      });
    };

    RangeTable.prototype.getCellPosition = function(cell) {};

    return RangeTable;

  })();

  ({
    utilities: {
      shortenVolume: function(volume) {
        return volume;
      }
    }
  });

  new RangeControl($(".range-control"));

}).call(this);
