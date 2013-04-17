class RangeControl
  constructor: (@el) ->
    @rangeTable = new RangeTable(@el.find(".range-control__range table"))
    @bindControls()

  bindControls: ->
    @leftControl  = @el.find(".range-control__left")
    @rightControl = @el.find(".range-control__right")
    @controlWidth = @leftControl.width()

    @leftControl.on  "dragstart", -> return false
    @rightControl.on "dragstart", -> return false

    @leftControl.on "mousedown", (event) =>
      @leftControl.addClass("is-dragged")
      zeroCoordinate = @el.offset().left
      shiftX = event.clientX - @leftControl.offset().left

      moveTo = (stopPoint) =>
        @leftControl.css "left", stopPoint - shiftX - zeroCoordinate

      $(document).on "mousemove", (event) =>
        moveTo(event.clientX)

    @leftControl.on "mouseup", =>
      @leftControl.removeClass("is-dragged")
      $(document).off "mousemove"

    @el.on "mouseleave", =>
      @leftControl.removeClass("is-dragged")
      $(document).off "mousemove"


class RangeTable
  constructor: (@el) ->
    @cells = @el.find("td")
    @data = []
    @height = @el.height()
    @buildDataFromCells()
    @buildCells()

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
      cellInner = $("<div/>").appendTo(cell).height (100/@maxVolume * cell.data("volume") + "%")
      @colorizeCell cell
#      @bindHoverToCell cell

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
#        console.log(utilities.shortenVolume(cell.data("rate")))
        break

  getVolumeByPosition: (x) ->
    $(@getCellByPosition(x)).data("volume")

  getCellByPosition: (x) ->

  bindHoverToCell: (cell) ->
    cell = $(cell)
    cell.hover()

#      $(@).append($("<div />").text($(@).data("volume")))
#      console.log()

utilities =
  shortenVolume: (volume) ->
    if volume < 1000
      return volume
    if volume < 1000000
      return "#{volume/1000}".replace(".",",") + " тыс."
    if volume >= 1000000
      return "#{volume/1000000}".replace(".",",") + " млн."


$(".range-control").each (i, control) ->
  new RangeControl($(control))