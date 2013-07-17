class RangeControl
  @_min;
  @_max;
  @_leftControlValue;
  @_rightControlValue;
  @_valueStep;
  @_dragged;
  @_renderControlCallback;
  @_width;
  @_widthWithoutPaddings;
  @_controlWidth;
  @_pxInValue;
  @_rangeElement;
  @_changeTimeout;

  @::DRAGCLASSNAME = 'is-dragged';
  @::keyCode = {
    LEFT:  37,
    RIGHT: 39,
  }
  @::defaultOptions = {
    keyLeft:   @::keyCode.LEFT,
    keyRight:  @::keyCode.RIGHT,
    min:       0,
    max:       100,
    valueStep: 1,
    timeout:   500,
    formatControlCallback: (value) -> value
  }

  constructor: (@el, options) ->
    @settings = $.extend({}, @defaultOptions, options)
    @el.data('range-control', @)
    @_formatControlCallback = @settings.formatControlCallback

    @_leftControl  = @el.find('.range-control_mini__left')
    @_rightControl = @el.find('.range-control_mini__right')
    @_rangeElement = @el.find('.range-control_mini__range.is-active')

    @min(@el.data('min') || @settings.min)
    @max(@el.data('max') || @settings.max)
    @valueStep(@el.data('value-step') || @settings.valueStep)

    @_controlWidth         = @_leftControl.outerWidth()
    @_width                = @el.outerWidth()
    @_widthWithoutPaddings = @el.width()
    @_pxInValue            = @_widthWithoutPaddings / (@_max - @_min)

    @leftValue(@el.data('left-value')   || @settings.leftValue  || @_min)
    @rightValue(@el.data('right-value') || @settings.rightValue || @_max)
    @_initControls()
#   Debug info
#    console.log({
#      "min":       @_min
#      "max":       @_max
#      "pxInValue": @_pxInValue
#    })

  min: (min) ->
    if min?
      @_min = parseInt(min)
    else
      @_min

  max: (max) ->
    if max?
      @_max = parseInt(max)
    else
      @_max

  valueStep: (valueStep) ->
    if valueStep?
      @_valueStep = parseInt(valueStep)
    else
      @_valueStep

  value: ->
    {
      'leftValue':  @leftValue()
      'rightValue': @rightValue()
    }

# @todo normalize value before render left control
  leftValue: (value) ->
    if value?
      @_leftControlValue = @_validateLeftValue(value)
      @_leftValueWithoutRender(@_leftControlValue)
      @_renderLeftControl(@_leftControlValue)
    else
      @_leftValueWithoutRender()

  _leftValueWithoutRender: (value) ->
    if value?
      @_renderRange()
      @_formatLeftControl()
    else
      if @_valueStep == 1
        @_leftControlValue
      else
        @_min + ((@_leftControlValue - @_min) - (@_leftControlValue - @_min) % @_valueStep)

  rightValue: (value) ->
    if value?
      @_rightControlValue = @_validateRightValue(value)
      @_rightValueWithoutRender(@_rightControlValue)
      @_renderRightControl(@_rightControlValue)
    else
      @_rightValueWithoutRender()

  _rightValueWithoutRender: (value) ->
    if value?
      @_renderRange()
      @_formatRightControl()
    else
      if @_valueStep == 1
        @_rightControlValue
      else
        @_min + ((@_rightControlValue - @_min) - (@_rightControlValue - @_min) % @_valueStep)

  _getValueByPosition: (x) ->
    @_min + parseInt(x / @_pxInValue)

  _valueByControl: (control, value) ->
    if control?
#     compare html el, instead of jq
      if control[0] == @_leftControl[0]
        if value?
          @leftValue(value)
        else
          @leftValue()
      else if control[0] == @_rightControl[0]
        if value?
          @rightValue(value)
        else
          @rightValue()

  _getPositionByValue: (x) ->

  _bindControlKeys: ->
    controls = [@_leftControl, @_rightControl]
    for control in controls
      control.on "keydown", (e) =>
        control = $(e.currentTarget)
        if e.keyCode == @settings.keyLeft
          @_valueByControl(control, @_valueByControl(control) - 1)
        else if e.keyCode == @settings.keyRight
          @_valueByControl(control, @_valueByControl(control) + 1)

  _initControls: ->
#    @changeControlRateText(@_leftControl, @rangeTable.getRateOfCell(@rangeTable.getFirstCell()))
#    @changeControlRateText(@_rightControl, @rangeTable.getRateOfCell(@rangeTable.getLastCell()))
    controls = [@_leftControl, @_rightControl];
    controls.forEach (control) =>
      control.on 'dragstart', -> return false
      control.on 'mouseup', =>
        @dragged = false
        control.removeClass(@DRAGCLASSNAME)
        $(document).off 'mousemove'

    @_leftControl.on 'mousedown', (event) =>
      if event.which != 1
        return
      @_leftControl.addClass(@DRAGCLASSNAME)
      @_dragged      = true
      zeroCoordinate = @el.offset().left
      shiftX         = event.clientX - @_leftControl.offset().left
      leftLimit      = 0
      rightLimit     = @_rightControl.offset().left - zeroCoordinate

      $(document).on 'mousemove', (event) =>
        @_controlMoveTo(
          @_leftControl,
          event.clientX,
          zeroCoordinate,
          shiftX,
          leftLimit,
          rightLimit
        )

    @_rightControl.on 'mousedown', (event) =>
      if event.which != 1
        return
      @_rightControl.addClass(@DRAGCLASSNAME)
      @_dragged      = true
      zeroCoordinate = @el.offset().left
      controlWidth   = @_controlWidth
      shiftX         = event.clientX - @_rightControl.offset().left
      leftLimit      = @_leftControl.offset().left - zeroCoordinate + @_controlWidth
      rightLimit     = @_width

      $(document).on 'mousemove', (event) =>
        @_controlMoveTo(
          @_rightControl,
          event.clientX,
          zeroCoordinate,
          shiftX,
          leftLimit,
          rightLimit
        )

    $(document).on 'mouseup', =>
      @_leftControl.triggerHandler  'mouseup'
      @_rightControl.triggerHandler 'mouseup'

    # set init position
    @_renderLeftControl(@leftValue())
    @_renderRightControl(@rightValue())
    @_bindControlKeys()

  _controlMoveTo: (control, stopPoint, zeroCoordinate, shiftX, leftLimit, rightLimit) ->
    leftBorderPosition  = stopPoint - zeroCoordinate - shiftX
    rightBorderPosition = stopPoint - zeroCoordinate - shiftX + @_controlWidth
    if leftBorderPosition >= leftLimit && rightBorderPosition < rightLimit
      control.css 'left', leftBorderPosition
    if leftBorderPosition < leftLimit
      control.css 'left', leftLimit
    if rightBorderPosition > rightLimit
      control.css 'left', rightLimit - @_controlWidth

    controlLeftPosition = control.position().left

    if control == @_leftControl
      @leftValue(@_getValueByPosition(controlLeftPosition))
    if control == @_rightControl
      @rightValue(@_getValueByPosition(controlLeftPosition - @_controlWidth))
    @_fireChangeEvent()

  _renderRange: ->
    leftBorder  = ((@_leftControlValue - @_min) * @_pxInValue) + @_controlWidth - (@_controlWidth / 2)
    rightBorder = ((@_rightControlValue - @_min) * @_pxInValue) + @_controlWidth + (@_controlWidth / 2)

    @_rangeElement.css({
      'left':  leftBorder,
      'right': @_width - rightBorder
    })

  _renderLeftControl: (value) ->
    position = ((value - @_min) * @_pxInValue)
    @_leftControl.css({
      left: position
    })

  _renderRightControl: (value) ->
    position = @_controlWidth + ((value - @_min) * @_pxInValue)
    @_rightControl.css({
      left: position
    })

  _validateLeftValue: (value) ->
    if value <= @_min
      @_min
    else if value >= @rightValue()
      @rightValue()
    else
      value

  _validateRightValue: (value) ->
    if value >= @_max
      @_max
    else if value <= @leftValue()
      @leftValue()
    else
      value

  renderControl: (renderControlCallback) ->
    if renderControlCallback?
      if typeof(renderControlCallback) == 'function'
        @_renderControlCallback = renderControlCallback

  _formatLeftControl: ->
    if @_formatControlCallback?
      @_leftControl.html(@_formatControlCallback(@leftValue()))

  _formatRightControl: ->
    if @_formatControlCallback?
      @_rightControl.html(@_formatControlCallback(@rightValue()))

  _formatValue: (x) ->
    x

  _fireChangeEvent: ->
    clearTimeout(@_changeTimeout)
    @_changeTimeout = setTimeout( =>
      @el.trigger('change', @value)
    , @settings.timeout)



#class RangeControl
#  @dragged = false
#
#  constructor: (@el) ->
#    @rangeTable = new RangeCells(@el.find('.range-control__range'), @)
#    @initControls()
#
#  initControls: ->
#    # @todo refactor all in this method
#    @leftControl  = @el.find(".range-control__left")
#    @rightControl = @el.find(".range-control__right")
#
#    @changeControlRateText(@leftControl, @rangeTable.getRateOfCell(@rangeTable.getFirstCell()))
#    @changeControlRateText(@rightControl, @rangeTable.getRateOfCell(@rangeTable.getLastCell()))
#
#    @leftControl.on  "dragstart", -> return false
#    @rightControl.on "dragstart", -> return false
#
#    @leftControl.on "mousedown", (event) =>
#      if event.which != 1
#        return
#      @leftControl.addClass("is-dragged")
#      @dragged = true
#      zeroCoordinate = @el.offset().left
#      shiftX = event.clientX - @leftControl.offset().left
#      leftLimit = 0
#      rightLimit = @rightControl.offset().left - zeroCoordinate
#
#      $(document).on "mousemove", (event) =>
#        @controlMoveTo(
#          @leftControl,
#          event.clientX,
#          zeroCoordinate,
#          shiftX,
#          leftLimit,
#          rightLimit
#          )
#
#    @rightControl.on "mousedown", (event) =>
#      if event.which != 1
#        return
#      @rightControl.addClass("is-dragged")
#      @dragged = true
#      zeroCoordinate = @el.offset().left
#      controlWidth   = @rightControl.outerWidth()
#      shiftX = event.clientX - @rightControl.offset().left
#      leftLimit = @leftControl.offset().left - zeroCoordinate + @leftControl.outerWidth()
#      rightLimit = @el.width()
#
#      $(document).on "mousemove", (event) =>
#        $(document).on "mousemove", (event) =>
#        @controlMoveTo(
#          @rightControl,
#          event.clientX,
#          zeroCoordinate,
#          shiftX,
#          leftLimit,
#          rightLimit
#        )
#
#    @leftControl.on "mouseup", =>
#      @dragged = false
#      @leftControl.removeClass("is-dragged")
#      $(document).off "mousemove"
#
#    @rightControl.on "mouseup", =>
#      @dragged = false
#      @rightControl.removeClass("is-dragged")
#      $(document).off "mousemove"
#
#    $(document).on "mouseup", =>
#      @leftControl.triggerHandler "mouseup"
#      @rightControl.triggerHandler "mouseup"
#
#  controlMoveTo: (control, stopPoint, zeroCoordinate, shiftX, leftLimit, rightLimit) ->
#    controlWidth = control.outerWidth()
#    leftBorderPosition = stopPoint - zeroCoordinate - shiftX
#    rightBorderPosition = stopPoint - zeroCoordinate - shiftX + controlWidth
#    if leftBorderPosition >= leftLimit && rightBorderPosition < rightLimit
#      control.css "left", leftBorderPosition
#    if leftBorderPosition < leftLimit
#      control.css "left", leftLimit
#    if rightBorderPosition > rightLimit
#      control.css "left", rightLimit - controlWidth
#
#    if control == @leftControl
#      @changeControlRateText control, @rangeTable.getRateByPosition(control.position().left)
#    if control == @rightControl
#      @changeControlRateText control, @rangeTable.getRateByPosition(control.position().left - controlWidth)
#
#    # @todo extract to separate methid of rangetable
#    @rangeTable.cells.addClass("is-disabled")
#    leftGrayCell = @rangeTable.getCellByPosition(@leftControl.position().left).index() - 3
#    rightGrayCell = @rangeTable.getCellByPosition(@rightControl.position().left - controlWidth).index() + 3
#    if leftGrayCell >= 0
#      @rangeTable.cells.slice(leftGrayCell, rightGrayCell).removeClass("is-disabled")
#    else
#      @rangeTable.cells.slice(0, rightGrayCell).removeClass("is-disabled")
#
#    console.log
#      left: @rangeTable.getRateByPosition(@leftControl.position().left)
#      right: @rangeTable.getRateByPosition(@rightControl.position().left - controlWidth)
#
#
#  changeControlRateText: (control, text) ->
#    control.find("i").text(utilities.shortenVolumeToName(text))
#
#
#class RangeCells
#  constructor: (@el, @rangeControl) ->
#    @cells = @el.find("div")
#    @cellHoverEl = $("<div/>").addClass("range-control__cell-hover").insertBefore(@el)
#    @cellWidth = 100/@cells.size()
#    @data = []
#    @height = @el.height()
#    @buildDataFromCells()
#    @buildCells()
#
#  buildDataFromCells: ->
#    @data = @cells.map (i, cell) ->
#      return {
#        volume: $(cell).data "volume"
#        rate:   $(cell).data "rate"
#      }
#    @maxVolume = Math.max.apply null, (x.volume for x in @data)
#
#  buildCells: ->
#    @cells.each (i, cell) =>
#      cell = $(cell)
#      $("<i/>").appendTo(cell).height (100/@maxVolume * cell.data("volume") + "%")
#      cell.width @cellWidth + "%"
#      @colorizeCell cell
#      @bindHoverToCell cell
#
#  colorizeCell: (cell) ->
#    # @todo extract to options
#    colorRanges =
#      "light-green":  [0, 100]
#      "middle-green": [101, 1000]
#      "green":        [1001, 10000]
#      "yellow":       [10001]
#
#    for colorRange of colorRanges
#      leftColorRange  = colorRanges[colorRange][0]
#      rightColorRange = colorRanges[colorRange][1]
#      if (leftColorRange <= cell.data("rate") <= rightColorRange) || (leftColorRange <= cell.data("rate") && !rightColorRange)
#        cell.addClass(colorRange)
#        break
#
#  getRateOfCell: (cell) ->
#    cell.data("rate")
#
#  getRateByPosition: (x) ->
#    $(@getCellByPosition(x)).data("rate")
#
#  getCellByPosition: (x) ->
#    @cellWidthInPx = @el.width()/100 * @cellWidth
#    cellNum = Math.ceil(x / @cellWidthInPx)
#    if cellNum >= @cells.size()
#      return  @cells.last()
#    @cells.eq(cellNum)
#
#  getCellByOrder: (order) ->
#    @cells.eq(order - 1)
#
#  getFirstCell: ->
#    @getCellByOrder(1)
#
#  getLastCell: ->
#    @getCellByOrder(@cells.size())
#
#  getPositionByCellOrder: (order) ->
#    @cellWidthInPx * order
#
#  bindHoverToCell: (cell) ->
#    cell = $(cell)
#    position = cell.position().left
#    cellHoverEl = @cellHoverEl
#    cell.on "mouseover", =>
#      if @rangeControl.dragged
#        return
#      cellHoverEl.show().css("left", position).text(utilities.splitVolumeBySpace(cell.data("rate")))
#    cell.on "mouseleave", =>
#      cellHoverEl.hide()
#
#utilities =
#  shortenVolumeToName: (volume) ->
#    if volume < 1000
#      return volume
#    if volume < 1000000
#      return "#{volume/1000}".replace(".",",") + " тыс."
#    if volume >= 1000000
#      return "#{volume/1000000}".replace(".",",") + " млн."
#  splitVolumeBySpace: (volume) ->
#    volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")

$.fn.rangeControl = (options) ->
  this.each ->
    if $(this).data('range-control') == undefined
      new RangeControl($(this), options)
    else
      $(this).data('range-control')
