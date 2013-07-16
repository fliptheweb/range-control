//@ sourceMappingURL=main.map
(function() {
  $('.range-control_mini').rangeControl();

  $('#example-1').rangeControl();

  $('#example-1').on("change", function(e, data) {
    console.log(data);
    console.log($('#example-1').rangeControl().value());
    return console.log($('#example-1').rangeControl().leftValue());
  });

}).call(this);
