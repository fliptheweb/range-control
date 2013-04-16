class RangeControl
  @rangeTable

  constructor: (@el) ->
    @buildRangeTable()

  buildRangeTable: ->
    @rangeTable = new RangeTable(@el.find(".range-control__range table"))

#      rangeCell.on "mouseover", ->
#        console.log($(@).data("rate"))

class RangeTable
  @data

  constructor: (@el) ->
    @rangeCells = @el.find("td")
    @data = []
    @buildDataFromCells()
    @bindHoverToCells()

  buildDataFromCells: ->
    @rangeCells.each (i, rangeCell)=>
      rangeCell = $(rangeCell)
      @data.push
        volume: rangeCell.data "volume"
        rate:   rangeCell.data "rate"

    @maxVolume = Math.max.apply null, (x.volume for x in @data)
    console.log @maxVolume

  bindHoverToCells: ->
    @rangeCells.on "mouseover", ->
      $(@).append($("<div />").text($(@).data("volume")))
      console.log()



new RangeControl($(".range-control"))