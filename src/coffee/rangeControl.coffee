class RangeControl
  constructor: (@el) ->
    @rangeTable = new RangeTable(@el.find(".range-control__range table"))
    @bindControls()

  bindControls: ->
    @leftControl  = @el.find(".range-control__left")
    @rightControl = @el.find(".range-control__right")

    @leftControl.on  "dragstart", -> return false
    @rightControl.on "dragstart", -> return false

    @leftControl.on "mousedown", (event) =>
      @leftControl.addClass("is-dragged")
      zeroCoordinate = @el.offset().left
      shiftX = event.clientX - @leftControl.offset().left
      leftLimit = 0
      rightLimit = @rightControl.offset().left - zeroCoordinate

      $(document).on "mousemove", (event) =>
        @controlMoveTo(
          @leftControl,
          event.clientX,
          zeroCoordinate,
          shiftX,
          leftLimit,
          rightLimit
          )

    @rightControl.on "mousedown", (event) =>
      @rightControl.addClass("is-dragged")
      zeroCoordinate = @el.offset().left
      controlWidth   = @rightControl.outerWidth()
      shiftX = event.clientX - @rightControl.offset().left
      leftLimit = @leftControl.offset().left - zeroCoordinate + @leftControl.outerWidth()
      rightLimit = @el.width()

      $(document).on "mousemove", (event) =>
        $(document).on "mousemove", (event) =>
        @controlMoveTo(
          @rightControl,
          event.clientX,
          zeroCoordinate,
          shiftX,
          leftLimit,
          rightLimit
        )

    @leftControl.on "mouseup", =>
      @leftControl.removeClass("is-dragged")
      $(document).off "mousemove"

    @rightControl.on "mouseup", =>
      @rightControl.removeClass("is-dragged")
      $(document).off "mousemove"

    $(document).on "mouseup", =>
      @leftControl.triggerHandler "mouseup"
      @rightControl.triggerHandler "mouseup"

  controlMoveTo: (control, stopPoint, zeroCoordinate, shiftX, leftLimit, rightLimit) ->
    controlWidth = control.outerWidth()
    leftBorderPosition = stopPoint - zeroCoordinate - shiftX
    rightBorderPosition = stopPoint - zeroCoordinate - shiftX + controlWidth
    if leftBorderPosition >= leftLimit && rightBorderPosition < rightLimit
      control.css "left", leftBorderPosition
    if leftBorderPosition < leftLimit
      control.css "left", leftLimit
    if rightBorderPosition > rightLimit
      control.css "left", rightLimit - controlWidth


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