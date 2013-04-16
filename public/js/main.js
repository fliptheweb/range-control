//@ sourceMappingURL=main.map
(function() {
  var RangeControl;

  RangeControl = (function() {
    function RangeControl(el) {
      this.el = el;
      console.log(this.el);
    }

    return RangeControl;

  })();

  new RangeControl($(".range-control"));

}).call(this);
