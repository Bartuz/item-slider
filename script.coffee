(($, window, undefined_) ->
  "use strict"
  $.CatSlider = (options, element) ->
    @$el = $(element)
    @_init options

  $.CatSlider:: =
    _init: (options) ->
      
      # the categories (ul)
      @$categories = @$el.children("ul")
      
      # the navigation
      @$navcategories = @$el.find("nav > a")
      animEndEventNames =
        WebkitAnimation: "webkitAnimationEnd"
        OAnimation: "oAnimationEnd"
        msAnimation: "MSAnimationEnd"
        animation: "animationend"

      
      # animation end event name
      # an
      @animEndEventName = animEndEventNames[Modernizr.prefixed("animation")]
      imations and transforms support
      @support = Modernizr.csstransforms and Modernizr.cssanimations
      
      # if currently animating
      @isAnimating = false
      
      # current category
      @current = 0
      $currcat = @$categories.eq(0)
      unless @support
        @$categories.hide()
        $currcat.show()
      else
        $currcat.addClass "mi-current"
      
      # current nav category
      @$navcategories.eq(0).addClass "mi-selected"
      
      # initialize the events
      @_initEvents()

    _initEvents: ->
      self = this
      @$navcategories.on "click.catslider", ->
        self.showCategory $(this).index()
        false

      
      # reset on window resize..
      $(window).on "resize", ->
        self.$categories.removeClass().eq(0).addClass "mi-current"
        self.$navcategories.eq(self.current).removeClass("mi-selected").end().eq(0).addClass "mi-selected"
        self.current = 0


    showCategory: (catidx) ->
      return false  if catidx is @current or @isAnimating
      @isAnimating = true
      
      # update selected navigation
      @$navcategories.eq(@current).removeClass("mi-selected").end().eq(catidx).addClass "mi-selected"
      dir = (if catidx > @current then "right" else "left")
      toClass = (if dir is "right" then "mi-moveToLeft" else "mi-moveToRight")
      fromClass = (if dir is "right" then "mi-moveFromRight" else "mi-moveFromLeft")
      
      # current category
      $currcat = @$categories.eq(@current)
      
      # new category
      $newcat = @$categories.eq(catidx)
      $newcatchild = $newcat.children()
      lastEnter = (if dir is "right" then $newcatchild.length - 1 else 0)
      self = this
      if @support
        $currcat.removeClass().addClass toClass
        setTimeout (->
          $newcat.removeClass().addClass fromClass
          $newcatchild.eq(lastEnter).on self.animEndEventName, ->
            $(this).off self.animEndEventName
            $newcat.addClass "mi-current"
            self.current = catidx
            $this = $(this)
            
            # solve chrome bug
            self.forceRedraw $this.get(0)
            self.isAnimating = false

        ), $newcatchild.length * 90
      else
        $currcat.hide()
        $newcat.show()
        @current = catidx
        @isAnimating = false

    
    # based on http://stackoverflow.com/a/8840703/989439
    forceRedraw: (element) ->
      return  unless element
      n = document.createTextNode(" ")
      position = element.style.position
      element.appendChild n
      element.style.position = "relative"
      setTimeout (->
        element.style.position = position
        n.parentNode.removeChild n
      ), 25

  $.fn.catslider = (options) ->
    instance = $.data(this, "catslider")
    if typeof options is "string"
      args = Array::slice.call(arguments_, 1)
      @each ->
        instance[options].apply instance, args

    else
      @each ->
        (if instance then instance._init() else instance = $.data(this, "catslider", new $.CatSlider(options, this)))

    instance
) jQuery, window