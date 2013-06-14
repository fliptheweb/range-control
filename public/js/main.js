//@ sourceMappingURL=main.map
(function() {
  $('.range-control_mini').rangeControl();

  $('#example-1').rangeControl().leftValue(0);

  $('#example-1').on("change", function(e, data) {
    console.log(data);
    return console.log($('#example-1').rangeControl().value());
  });

}).call(this);
