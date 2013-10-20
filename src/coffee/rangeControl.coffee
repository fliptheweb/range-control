class RangeControl
  @_min;
  @_max;
  @_leftControlValue;
  @_rightControlValue;
  @_step;
  @_dragged;
  @_renderControlCallback;
  @_width;
  @_widthWithoutPaddings;
  @_controlWidth;
  @_pxInValue;
  @_rangeElement;
  @_changeTimeout;

  @::PLUGINNAME    = 'range-control';
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
    step:      1,
    timeout:   500,
    formatControlCallback: (value) -> value
  }

  constructor: (@el, @options) ->
    @settings = $.extend({}, @defaultOptions, options)
    @el.data(@PLUGINNAME, @)
    @_formatControlCallback = @settings.formatControlCallback

    @_renderRangeControl()

    @min(@el.data('min') || @settings.min)
    @max(@el.data('max') || @settings.max)
    @step(@el.data('step') || @settings.step)

    @_initDimensions()

    @leftValue(@el.data('left-value')   || @settings.leftValue  || @_min)
    @rightValue(@el.data('right-value') || @settings.rightValue || @_max)
    @_initControls()
    @_bindResize()
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

  step: (step) ->
    if step
      @_step = parseInt(step)
    else
      @_step

  value: ->
    {
      'leftValue':  @_getLeftValue()
      'rightValue': @_getRightValue()
    }

  leftValue: (value) ->
    if value?
      @_leftControlValue = @_validateLeftValue(value)
      @_renderLeftControl(@_leftControlValue)
      @_formatLeftControl()
      @_renderRange()
    else
      @_getLeftValue()

  rightValue: (value) ->
    if value?
      @_rightControlValue = @_validateRightValue(value)
      @_renderRightControl(@_rightControlValue)
      @_formatRightControl()
      @_renderRange()
    else
      @_getRightValue()

  _getLeftValue: ->
    if @_valueStep == 1
      @_leftControlValue
    else
      @_min + ((@_leftControlValue - @_min) - (@_leftControlValue - @_min) % @_step)

  _getRightValue: ->
    if @_valueStep == 1
      @_rightControlValue
    else
      @_min + ((@_rightControlValue - @_min) - (@_rightControlValue - @_min) % @_step)

  _getValueByPosition: (x) ->
    @_min + Math.round(x / @_pxInValue)

  _valueByControl: (control, value) ->
    if control?
#     compare html el, instead of jq
      if control[0] == @_leftControl[0]
        if value?
          @leftValue(value)
        else
#          @_getLeftValue()
           @_leftControlValue
      else if control[0] == @_rightControl[0]
        if value?
          @rightValue(value)
        else
#          @_getRightValue()
          @_rightControlValue

  _getPositionByValue: (x) ->
    x * @_pxInValue

  _getPositionWithControlByValue: (x) ->
    @_getPositionByValue(x) + @_controlWidth

  _bindControlKeys: ->
    controls = [@_leftControl, @_rightControl]
    for control in controls
      control.on "keydown", (e) =>
        control = $(e.currentTarget)
        if e.keyCode == @settings.keyLeft
          @_valueByControl(control, @_valueByControl(control) - 1)
        else if e.keyCode == @settings.keyRight
          @_valueByControl(control, @_valueByControl(control) + 1)

  _bindResize: ->
    $(window).on 'resize', =>
      @render()

  _initDimensions: ->
    @_controlWidth         = @_leftControl.outerWidth()
    @_width                = @el.outerWidth()
    @_widthWithoutPaddings = @el.width()
    @_pxInValue            = @_widthWithoutPaddings / (@_max - @_min)

  _initControls: ->
    controls = [@_leftControl, @_rightControl];
    for control in controls
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

    @_leftControl.on 'click', => false
    @_rightControl.on 'click', => false

    $(document).on 'mouseup', =>
      @_leftControl.triggerHandler  'mouseup'
      @_rightControl.triggerHandler 'mouseup'

    # set init position
    @_renderLeftControl(@_leftControlValue)
    @_renderRightControl(@_rightControlValue)
    @_bindControlKeys()

  _controlMoveTo: (control, stopPoint, zeroCoordinate, shiftX, leftLimit, rightLimit) ->
    leftBorderPosition  = stopPoint - zeroCoordinate - shiftX
    rightBorderPosition = stopPoint - zeroCoordinate - shiftX + @_controlWidth
    if leftBorderPosition >= leftLimit && rightBorderPosition < rightLimit
      controlLeftPosition = leftBorderPosition
    if leftBorderPosition < leftLimit
      controlLeftPosition = leftLimit
    if rightBorderPosition > rightLimit
      controlLeftPosition = rightLimit - @_controlWidth

    if control == @_leftControl
      @leftValue(@_getValueByPosition(controlLeftPosition))
    if control == @_rightControl
      @rightValue(@_getValueByPosition(controlLeftPosition - @_controlWidth))
    @_fireChangeEvent()

  # If youre using template engine - override this method
  _renderRangeControl: ->
    @el.addClass(@PLUGINNAME)
    @el.children().remove()
    @_leftControl  = $("<button class='#{@PLUGINNAME}__left'></button>")
    @_rightControl = $("<button class='#{@PLUGINNAME}__right'></button>")
    @_rangeElement = $("<div class='#{@PLUGINNAME}__range is-active'></div>")
    range          = $("<div class='#{@PLUGINNAME}__range'></div>")
    @el.append(@_leftControl).append(@_rightControl).append(range).append(@_rangeElement)

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
    else if value >= @_rightControlValue
      @_rightControlValue
    else
      value

  _validateRightValue: (value) ->
    if value >= @_max
      @_max
    else if value <= @_leftControlValue
      @_leftControlValue
    else
      value

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
      @el.trigger('change', @value())
    , @settings.timeout)

  render: ->
    @_initDimensions()
    @leftValue(@_leftControlValue)
    @rightValue(@_rightControlValue)

  rebuild: (options = @options)->
    @constructor(@el, options)

  destroy: ->
    @el.html("")
    @el.removeData(@PLUGINNAME)


class RangeControlGraph extends RangeControl
  @::PLUGINNAME = 'range-control-graph';
  @::defaultOptions = {
    keyLeft:   @::keyCode.LEFT,
    keyRight:  @::keyCode.RIGHT,
    min:       0,
    max:       100,
    step:      1,
    timeout:   500,
    formatControlCallback: (value) ->
      value
    colorsRange: {
      "#e6ead4": [0, 100]
      "#ced7a6": [101, 1000]
      "#b4c373": [1001, 10000]
      "#fed46d": [10001]
    }
    colorCell: "#288bf0"
  }

  constructor: (@el, @options) ->
    @settings = $.extend({}, @defaultOptions, options)
    @_renderRangeControl()
    @_initDimensions()
    @_renderRange()

    @min(0)
    @max(Object.keys(@options.data).length)

    super @el, $.extend(@settings, {
      min: @min(),
      max: @max()
    })

    @leftValue(@_getIndexNumberByValue(@el.data('left-value')) || @min())
    @rightValue(@_getIndexNumberByValue(@el.data('right-value')) || @max())


  # If youre using template engine - override this method
  _renderRangeControl: ->
    @el.addClass(@PLUGINNAME)
    @el.children().remove()
    @_leftControl  = $("<button class='#{@PLUGINNAME}__left'></button>").appendTo(@el)
    @_rightControl = $("<button class='#{@PLUGINNAME}__right'></button>").appendTo(@el)
    @_rangeElement = $("<canvas class='#{@PLUGINNAME}__range'></canvas>").appendTo(@el)
    @_rangeElementHover = $("<canvas class='#{@PLUGINNAME}__range-hover'></canvas>").appendTo(@el)
    @_rangeGreyWrapLeft     = $("<div class='#{@PLUGINNAME}__wrap-range-grey-left'></div>")
    @_rangeGreyElementLeft  = $("<canvas class='#{@PLUGINNAME}__range-grey'></canvas>").appendTo(@_rangeGreyWrapLeft)
    @_rangeGreyWrapRight    = $("<div class='#{@PLUGINNAME}__wrap-range-grey-right'></div>")
    @_rangeGreyElementRight = $("<canvas class='#{@PLUGINNAME}__range-grey'></canvas>").appendTo(@_rangeGreyWrapRight)
    @_hoverElement = $("<div class='#{@PLUGINNAME}__hover'>111</div>").appendTo(@el)
    @_rangeGreyWrapLeft.appendTo(@el)
    @_rangeGreyWrapRight.appendTo(@el)


  _renderRange: ->
    rangeVolumes = for value, volume of @options.data
      volume
    @_maxRangeVolume = Math.max.apply null, rangeVolumes
    dataSize = Object.keys(@options.data).length
    @canvas  = @_rangeElement[0].getContext('2d')
    @canvasScale  = 30
    @canvasHeight = @el.height()
    @canvasWidth  = dataSize * @canvasScale
    @_rangeElement[0].width =  dataSize * @canvasScale
    @_rangeElement[0].height = @el.height()
    @_rangeElement.width(@_widthWithoutPaddings)

    @_renderColorRange()
    @_renderRangeCells()
    @_renderGreyRange()
    @_renderRangeWraps()
    @_renderRangeHover()

  # Method use only sorted colorRange and data for best performance
  _renderColorRange: ->
    if !@dataColorRange?
      @dataColorRange = {}
      colorRange = @settings.colorsRange
      data       = @settings.data

      # Collect indexes of data coinciding to range of color
      for color, range of colorRange
        @dataColorRange[color] = []
        i = -1
        for value of data
          i++
          leftColorRange  = range[0]
          rightColorRange = if range[1]? then range[1] else Infinity
          if (leftColorRange <= value <= rightColorRange)
            @dataColorRange[color].push(i)
            continue
          else if (value > rightColorRange)
            break

    @_drawColorRange()

  _drawColorRange: ->
    for color, range of @dataColorRange
      leftRangeItem  = Math.min.apply(null, range)
      rightRangeItem = Math.max.apply(null, range)
      numberOfItem = range.length
      @canvas.fillStyle = color
      @canvas.fillRect(leftRangeItem * @canvasScale, 0, numberOfItem * @canvasScale, @canvasHeight)

  _renderRangeCells: ->
    i = 0
    @canvas.fillStyle = @settings.colorCell
    for value, volume of @options.data
      @_renderRangeCell(i++, volume)
#      cellHeight = @canvasHeight / @_maxRangeVolume * volume
#      @canvas.fillRect((@canvasScale * i++), @canvasHeight, @canvasScale, -cellHeight)

  _renderRangeCell: (i, volume)->
    cellHeight = @canvasHeight / @_maxRangeVolume * volume
    @canvas.fillRect((@canvasScale * i), @canvasHeight, @canvasScale, -cellHeight)

  _renderGreyRange: ->
    @greyCanvasLeft = @_rangeGreyElementLeft[0].getContext('2d')
    @_rangeGreyElementLeft[0].width =  @_rangeElement[0].width
    @_rangeGreyElementLeft[0].height = @_rangeElement[0].height
    @_rangeGreyElementLeft.width(@_widthWithoutPaddings)

    @greyCanvasRight = @_rangeGreyElementRight[0].getContext('2d')
    @_rangeGreyElementRight[0].width =  @_rangeElement[0].width
    @_rangeGreyElementRight[0].height = @_rangeElement[0].height
    @_rangeGreyElementRight.width(@_widthWithoutPaddings)

    # copy color canvas
    imageData = @canvas.getImageData(0, 0, @_rangeElement[0].width, @_rangeElement[0].height)

    data = imageData.data
    for i in [0..(data.length-1)] by 4
      brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]
      data[i]     = brightness
      data[i + 1] = brightness
      data[i + 2] = brightness

    @greyCanvasLeft.putImageData(imageData, 0, 0)
    @greyCanvasRight.putImageData(imageData, 0, 0)

  _renderRangeWraps: ->
    leftWidth  = ((@_leftControlValue - @_min) * @_pxInValue) + @_controlWidth - (@_controlWidth / 2)
    rightWidth = @_width - ((@_rightControlValue - @_min) * @_pxInValue + @_controlWidth + (@_controlWidth / 2))

    @_rangeGreyWrapLeft.css({
      'width':  leftWidth
    })
    @_rangeGreyWrapRight.css({
      'width':  rightWidth
    })

  _renderRangeHover: ->
    @canvasHover = @_rangeElementHover[0].getContext('2d')
    @_rangeElementHover[0].width =  @_rangeElement[0].width
    @_rangeElementHover[0].height = @_rangeElement[0].height
    @_rangeElementHover.width(@_widthWithoutPaddings)

    @_rangeElementHover.on "mousemove", (e) =>
      x = e.offsetX
#      y = e.offsetY
      value = @_getValueByPosition(x)
      @_drawRangeHover(value)
      @_hoverElement.show().css(
        left: @_getPositionWithControlByValue(value)
      )
      @_hoverElement.text(@_getVolumeByIndexNumber(value))

    @_rangeElementHover.on "mouseout", (e) =>
      @_clearRangeHover()
      @_hoverElement.hide()

  _drawRangeHover: (value) ->
    @_clearRangeHover()
    @_renderRangeCell(value, @getVolumeByValue(value))

  _clearRangeHover: ->
    @canvasHover.clearRect(0, 0, @_rangeElement[0].width, @_rangeElement[0].height)

  _formatLeftControl: ->
    value = @_getLeftValue()
#    volume = @options.data[value]
    if @_formatControlCallback?
      @_leftControl.html(@_formatControlCallback(value))

  _formatRightControl: ->
    value = @_getRightValue()
    if @_formatControlCallback?
      @_rightControl.html(@_formatControlCallback(value))

  _getLeftValue: ->
    @_getValueByIndexNumber(@_leftControlValue)

  _getRightValue: ->
    @_getValueByIndexNumber(@_rightControlValue)

  _getValueByIndexNumber: (i) ->
    value = Object.keys(@options.data)[i - 1]
    if !value?
      value = 0
    parseInt(value)

  _getIndexNumberByValue: (value) ->
    Object.keys(@options.data).indexOf(value.toString()) + 1

  getVolumeByValue: (value) ->
    @options.data[value]

  _getVolumeByIndexNumber: (i) ->
    @getVolumeByValue(@_getValueByIndexNumber(i))

  testCanvasSupport: ->
    !!document.createElement('canvas').getContext

#  _getValueByPosition: (x) ->
#    console.log @_min + Math.round(x / @_pxInValue)
#    @_min + Math.round(x / @_pxInValue)


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

$.fn.testCanvasSupport = (options) ->
	!!document.createElement('canvas').getContext

$.fn.rangeControl = (options) ->
	controls = []
	pluginName = RangeControl.prototype.PLUGINNAME
	this.each ->
    if $(this).data(pluginName) == undefined
      controls.push(new RangeControl($(this), options))
    else
      controls.push($(this).data(pluginName))
	return controls

$.fn.rangeControlGraph = (options) ->
  controls = []
  pluginName = RangeControlGraph.prototype.PLUGINNAME
  this.each ->
    if $(this).data(pluginName) == undefined
      controls.push(new RangeControlGraph($(this), options))
    else
      controls.push($(this).data(pluginName))
  return controls