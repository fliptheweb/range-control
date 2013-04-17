class RangeControl
  constructor: (@el) ->
    @buildRangeTable()

  buildRangeTable: ->
    @rangeTable = new RangeTable(@el.find(".range-control__range table"))

class RangeTable
  constructor: (@el) ->
    @cells = @el.find("td")
    @data = []
    @height = @el.height()
    @buildDataFromCells()
    @buildCells()
    @bindHoverToCells()

  buildDataFromCells: ->
    @cells.each (i, cell) =>
      cell = $(cell)
      @data.push
        volume: cell.data "volume"
        rate:   cell.data "rate"

    @maxVolume = Math.max.apply null, (x.volume for x in @data)

  buildCells: ->
    @cells.each (i, cell) =>
      cell = $(cell)
      cellInner = $("<div/>").appendTo(cell).height (100/@maxVolume * cell.data("volume")) * @height/100

  bindHoverToCells: ->
    @cells.on "mouseover", (cell) ->
      console.log(utilities.shortenVolume($(cell).data("volume")))
#      $(@).append($("<div />").text($(@).data("volume")))
#      console.log()

  getCellPosition: (cell) ->



utilities:
  shortenVolume: (volume) ->
    volume



new RangeControl($(".range-control"))