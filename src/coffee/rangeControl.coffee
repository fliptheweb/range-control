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
    @data = @cells.map (i, cell) ->
      return {
        volume: $(cell).data "volume"
        rate:   $(cell).data "rate"
      }
    @maxVolume = Math.max.apply null, (x.volume for x in @data)

  buildCells: ->
    @cells.each (i, cell) =>
      cell = $(cell)
      cellInner = $("<div/>").appendTo(cell).height (100/@maxVolume * cell.data("volume")) * @height/100
      @colorizeCell cell

  colorizeCell: (cell) ->
    # @todo extract to options
    colorRanges = {
      "light-green":  [0, 100]
      "middle-green": [101, 1000]
      "green":        [1001, 10000]
      "yellow":       [10001]
    }
    for colorRange of colorRanges
      if colorRanges[colorRange][0] <= cell.data("rate") <= colorRanges[colorRange][1]
        cell.addClass(colorRange)
        break
      if !colorRanges[colorRange][1] && colorRanges[colorRange][0] <= cell.data("rate")
        cell.addClass(colorRange)
        break



  bindHoverToCells: ->
    @cells.on "mouseover", (cell) ->
      console.log(utilities.shortenVolume($(cell).data("volume")))
#      $(@).append($("<div />").text($(@).data("volume")))
#      console.log()

  getCellPosition: (cell) ->

utilities =
  shortenVolume: (volume) ->
    volume



new RangeControl($(".range-control"))