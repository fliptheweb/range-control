$('.range-control_mini').rangeControl()

$('#example-1').rangeControl().leftValue(0)
$('#example-1').on("change", (e, data) ->
  console.log(data)
)
