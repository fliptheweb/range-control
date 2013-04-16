//@ sourceMappingURL=main.map
(function() {
  var RangeControl, RangeTable;

  RangeControl = (function() {
    RangeControl.rangeTable;

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
    RangeTable.data;

    function RangeTable(el) {
      this.el = el;
      this.rangeCells = this.el.find("td");
      this.data = [];
      this.buildDataFromCells();
      this.bindHoverToCells();
    }

    RangeTable.prototype.buildDataFromCells = function() {
      var x,
        _this = this;

      this.rangeCells.each(function(i, rangeCell) {
        rangeCell = $(rangeCell);
        return _this.data.push({
          volume: rangeCell.data("volume"),
          rate: rangeCell.data("rate")
        });
      });
      this.maxVolume = Math.max.apply(null, (function() {
        var _i, _len, _ref, _results;

        _ref = this.data;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push(x.volume);
        }
        return _results;
      }).call(this));
      return console.log(this.maxVolume);
    };

    RangeTable.prototype.bindHoverToCells = function() {
      return this.rangeCells.on("mouseover", function() {
        $(this).append($("<div />").text($(this).data("volume")));
        return console.log();
      });
    };

    return RangeTable;

  })();

  new RangeControl($(".range-control"));

}).call(this);
