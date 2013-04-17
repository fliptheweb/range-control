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
    colorRanges =
      "light-green":  [0, 100]
      "middle-green": [101, 1000]
      "green":        [1001, 10000]
      "yellow":       [10001]

    for colorRange of colorRanges
      leftColorRange  = colorRanges[colorRange][0]
      rightColorRange = colorRanges[colorRange][1]
      if (leftColorRange <= cell.data("rate") <= rightColorRange) || (leftColorRange <= cell.data("rate") && !rightColorRange)
        cell.addClass(colorRange)
        break

  getVolumeByPosition: (x) ->
    $(@getCellByPosition(x)).data("volume")

  getCellByPosition: (x) ->

  bindHoverToCells: ->
    @cells.hover(
              (event) ->
                console.log("!")
                cell = event.currentTarget
              ,(event) ->
                console.log("unhover")
                )

#      $(@).append($("<div />").text($(@).data("volume")))
#      console.log()

utilities =
  shortenVolume: (volume) ->
    if volume < 1000
      volume
    if volume < 1000000
      volume/1000 + "тыс."
    if volume >= 1000000
      volume/1000000 + "млн."



new RangeControl($(".range-control"))