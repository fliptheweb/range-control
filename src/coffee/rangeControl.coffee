class RangeControl
  constructor: (@el) ->
    @buildRangeTable()

  buildRangeTable: ->
    @rangeTable = new RangeTable(@el.find(".range-control__range table"))

#      rangeCell.on "mouseover", ->
#        console.log($(@).data("rate"))

class RangeTable
  constructor: (@el) ->
    @rangeCells = @el.find("td")
    @data = []
    @height = @el.height()
    @buildDataFromCells()
    @buildCells()
    @bindHoverToCells()

  buildDataFromCells: ->
    @rangeCells.each (i, rangeCell) =>
      rangeCell = $(rangeCell)
      @data.push
        volume: rangeCell.data "volume"
        rate:   rangeCell.data "rate"

    @maxVolume = Math.max.apply null, (x.volume for x in @data)

  buildCells: ->
    @rangeCells.each (i, rangeCell) =>
      rangeCell = $(rangeCell)
      $("<div/>").appendTo(rangeCell).height((100/@maxVolume * rangeCell.data("volume")) * @height/100)

  bindHoverToCells: ->
    @rangeCells.on "mouseover", ->
#      $(@).append($("<div />").text($(@).data("volume")))
#      console.log()



new RangeControl($(".range-control"))