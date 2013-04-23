class RangeControl
  @dragged = false

  constructor: (@el) ->
    @rangeTable = new RangeCells(@el.find(".range-control__range"), @)
    @initControls()

  initControls: ->
    # @todo refactor all in this method
    @leftControl  = @el.find(".range-control__left")
    @rightControl = @el.find(".range-control__right")

    @changeControlRateText(@leftControl, @rangeTable.getRateOfCell(@rangeTable.getFirstCell()))
    @changeControlRateText(@rightControl, @rangeTable.getRateOfCell(@rangeTable.getLastCell()))

    @leftControl.on  "dragstart", -> return false
    @rightControl.on "dragstart", -> return false

    @leftControl.on "mousedown", (event) =>
      if event.which != 1
        return
      @leftControl.addClass("is-dragged")
      @dragged = true
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
      if event.which != 1
        return
      @rightControl.addClass("is-dragged")
      @dragged = true
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
      @dragged = false
      @leftControl.removeClass("is-dragged")
      $(document).off "mousemove"

    @rightControl.on "mouseup", =>
      @dragged = false
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

    if control == @leftControl
      @changeControlRateText control, @rangeTable.getRateByPosition(control.position().left)
    if control == @rightControl
      @changeControlRateText control, @rangeTable.getRateByPosition(control.position().left - controlWidth)

    # @todo extract to separate methid of rangetable
    @rangeTable.cells.addClass("is-disabled")
    leftGrayCell = @rangeTable.getCellByPosition(@leftControl.position().left).index() - 3
    rightGrayCell = @rangeTable.getCellByPosition(@rightControl.position().left - controlWidth).index() + 3
    if leftGrayCell >= 0
      @rangeTable.cells.slice(leftGrayCell, rightGrayCell).removeClass("is-disabled")
    else
      @rangeTable.cells.slice(0, rightGrayCell).removeClass("is-disabled")

    console.log
      left: @rangeTable.getRateByPosition(@leftControl.position().left)
      right: @rangeTable.getRateByPosition(@rightControl.position().left - controlWidth)


  changeControlRateText: (control, text) ->
    control.find("i").text(utilities.shortenVolumeToName(text))


class RangeCells
  constructor: (@el, @rangeControl) ->
    @cells = @el.find("div")
    @cellHoverEl = $("<div/>").addClass("range-control__cell-hover").insertBefore(@el)
    @cellWidth = 100/@cells.size()
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
      $("<i/>").appendTo(cell).height (100/@maxVolume * cell.data("volume") + "%")
      cell.width @cellWidth + "%"
      @colorizeCell cell
      @bindHoverToCell cell

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

  getRateOfCell: (cell) ->
    cell.data("rate")

  getRateByPosition: (x) ->
    $(@getCellByPosition(x)).data("rate")

  getCellByPosition: (x) ->
    @cellWidthInPx = @el.width()/100 * @cellWidth
    cellNum = Math.ceil(x / @cellWidthInPx)
    if cellNum >= @cells.size()
      return  @cells.last()
    @cells.eq(cellNum)

  getCellByOrder: (order) ->
    @cells.eq(order - 1)

  getFirstCell: ->
    @getCellByOrder(1)

  getLastCell: ->
    @getCellByOrder(@cells.size())

  getPositionByCellOrder: (order) ->
    @cellWidthInPx * order

  bindHoverToCell: (cell) ->
    cell = $(cell)
    position = cell.position().left
    cellHoverEl = @cellHoverEl
    cell.on "mouseover", =>
      if @rangeControl.dragged
        return
      cellHoverEl.show().css("left", position).text(utilities.splitVolumeBySpace(cell.data("rate")))
    cell.on "mouseleave", =>
      cellHoverEl.hide()

utilities =
  shortenVolumeToName: (volume) ->
    if volume < 1000
      return volume
    if volume < 1000000
      return "#{volume/1000}".replace(".",",") + " тыс."
    if volume >= 1000000
      return "#{volume/1000000}".replace(".",",") + " млн."
  splitVolumeBySpace: (volume) ->
    volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")


$(".range-control").each (i, control) ->
  new RangeControl($(control))