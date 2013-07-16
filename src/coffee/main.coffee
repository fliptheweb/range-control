$('.range-control_mini').rangeControl()

$('#example-1').rangeControl()
$('#example-1').on("change", (e, data) ->
  console.log(data)
  console.log($('#example-1').rangeControl().value())
  console.log($('#example-1').rangeControl().leftValue())
)
