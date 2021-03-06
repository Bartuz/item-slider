// Generated by CoffeeScript 1.6.3
(function($, window, undefined_) {
  "use strict";
  $.CatSlider = function(options, element) {
    this.$el = $(element);
    return this._init(options);
  };
  $.CatSlider.prototype = {
    _init: function(options) {
      var $currcat, animEndEventNames;
      this.$categories = this.$el.children("ul");
      this.$navcategories = this.$el.find("nav > a");
      animEndEventNames = {
        WebkitAnimation: "webkitAnimationEnd",
        OAnimation: "oAnimationEnd",
        msAnimation: "MSAnimationEnd",
        animation: "animationend"
      };
      this.animEndEventName = animEndEventNames[Modernizr.prefixed("animation")];
      imations && transforms(support);
      this.support = Modernizr.csstransforms && Modernizr.cssanimations;
      this.isAnimating = false;
      this.current = 0;
      $currcat = this.$categories.eq(0);
      if (!this.support) {
        this.$categories.hide();
        $currcat.show();
      } else {
        $currcat.addClass("mi-current");
      }
      this.$navcategories.eq(0).addClass("mi-selected");
      return this._initEvents();
    },
    _initEvents: function() {
      var self;
      self = this;
      this.$navcategories.on("click.catslider", function() {
        self.showCategory($(this).index());
        return false;
      });
      return $(window).on("resize", function() {
        self.$categories.removeClass().eq(0).addClass("mi-current");
        self.$navcategories.eq(self.current).removeClass("mi-selected").end().eq(0).addClass("mi-selected");
        return self.current = 0;
      });
    },
    showCategory: function(catidx) {
      var $currcat, $newcat, $newcatchild, dir, fromClass, lastEnter, self, toClass;
      if (catidx === this.current || this.isAnimating) {
        return false;
      }
      this.isAnimating = true;
      this.$navcategories.eq(this.current).removeClass("mi-selected").end().eq(catidx).addClass("mi-selected");
      dir = (catidx > this.current ? "right" : "left");
      toClass = (dir === "right" ? "mi-moveToLeft" : "mi-moveToRight");
      fromClass = (dir === "right" ? "mi-moveFromRight" : "mi-moveFromLeft");
      $currcat = this.$categories.eq(this.current);
      $newcat = this.$categories.eq(catidx);
      $newcatchild = $newcat.children();
      lastEnter = (dir === "right" ? $newcatchild.length - 1 : 0);
      self = this;
      if (this.support) {
        $currcat.removeClass().addClass(toClass);
        return setTimeout((function() {
          $newcat.removeClass().addClass(fromClass);
          return $newcatchild.eq(lastEnter).on(self.animEndEventName, function() {
            var $this;
            $(this).off(self.animEndEventName);
            $newcat.addClass("mi-current");
            self.current = catidx;
            $this = $(this);
            self.forceRedraw($this.get(0));
            return self.isAnimating = false;
          });
        }), $newcatchild.length * 90);
      } else {
        $currcat.hide();
        $newcat.show();
        this.current = catidx;
        return this.isAnimating = false;
      }
    },
    forceRedraw: function(element) {
      var n, position;
      if (!element) {
        return;
      }
      n = document.createTextNode(" ");
      position = element.style.position;
      element.appendChild(n);
      element.style.position = "relative";
      return setTimeout((function() {
        element.style.position = position;
        return n.parentNode.removeChild(n);
      }), 25);
    }
  };
  return $.fn.catslider = function(options) {
    var args, instance;
    instance = $.data(this, "catslider");
    if (typeof options === "string") {
      args = Array.prototype.slice.call(arguments_, 1);
      this.each(function() {
        return instance[options].apply(instance, args);
      });
    } else {
      this.each(function() {
        if (instance) {
          return instance._init();
        } else {
          return instance = $.data(this, "catslider", new $.CatSlider(options, this));
        }
      });
    }
    return instance;
  };
})(jQuery, window);
