import L from 'leaflet'
var oldIE = L.DomUtil.TRANSFORM === 'msTransform'

L.BaseMarker = L.Marker.extend({
  options: {
    bearingAngle: 0,
    rotationOrigin: ''
  },

  initialize: function (latlng, options) {
    L.Marker.prototype.initialize.call(this)

    L.Util.setOptions(this, options)
    this._latlng = L.latLng(latlng)

    var iconOptions = this.options.icon && this.options.icon.options
    var iconAnchor = iconOptions && this.options.icon.options.iconAnchor
    if (iconAnchor) {
      iconAnchor = iconAnchor[0] + 'px ' + iconAnchor[1] + 'px'
    }

    this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center'
    this.options.bearingAngle = this.options.bearingAngle || 0

    // Ensure marker keeps rotated during dragging
    this.on('drag', function (e) {
      e.target._applyRotation()
    })

    this.on('move', this.slideCancel, this)

    this._slideToUntil = 0
    this._slideToDuration = 1000
    this._slideToLatLng = [0, 0]
    this._slideFromLatLng = [0, 0]
    this._slideKeepAtCenter = false
    this._slideDraggingWasAllowed = false
    this._slideFrame = 0
  },

  slideTo: function (latlng, options) {
    if (!this._map) return

    this._slideToDuration = options.duration
    this._slideToUntil = performance.now() + options.duration
    this._slideFromLatLng = this.getLatLng()
    this._slideToLatLng = latlng
    this._slideKeepAtCenter = !!options.keepAtCenter
    this._slideDraggingWasAllowed =
      this._slideDraggingWasAllowed !== undefined ? this._slideDraggingWasAllowed : this._map.dragging.enabled()

    if (this._slideKeepAtCenter) {
      this._map.dragging.disable()
      this._map.doubleClickZoom.disable()
      this._map.options.touchZoom = 'center'
      this._map.options.scrollWheelZoom = 'center'
    }

    this.fire('movestart')
    this._slideTo()

    return this
  },

  _slideTo: function () {
    if (!this._map) return

    var remaining = this._slideToUntil - performance.now()

    if (remaining < 0) {
      this.setLatLng(this._slideToLatLng)
      this.fire('moveend')
      if (this._slideDraggingWasAllowed) {
        this._map.dragging.enable()
        this._map.doubleClickZoom.enable()
        this._map.options.touchZoom = true
        this._map.options.scrollWheelZoom = true
      }
      this._slideDraggingWasAllowed = false
      return this
    }

    var startPoint = this._map.latLngToContainerPoint(this._slideFromLatLng)
    var endPoint = this._map.latLngToContainerPoint(this._slideToLatLng)
    var percentDone = (this._slideToDuration - remaining) / this._slideToDuration

    var currPoint = endPoint.multiplyBy(percentDone).add(startPoint.multiplyBy(1 - percentDone))
    var currLatLng = this._map.containerPointToLatLng(currPoint)
    this.setLatLng(currLatLng)

    if (this._slideKeepAtCenter) {
      this._map.panTo(currLatLng, { animate: false })
    }

    this._slideFrame = L.Util.requestAnimFrame(this._slideTo, this)
  },

  // 🍂method slideCancel(): this
  // Cancels the sliding animation from `slideTo`, if applicable.
  slideCancel: function () {
    L.Util.cancelAnimFrame(this._slideFrame)
  },

  onRemove: function (map) {
    L.Marker.prototype.onRemove.call(this, map)
  },

  _setPos: function (pos) {
    L.Marker.prototype._setPos.call(this, pos)
    this._applyRotation()
  },

  _applyRotation: function () {
    if (this.options.bearingAngle) {
      this._icon.style[L.DomUtil.TRANSFORM + 'Origin'] = this.options.rotationOrigin

      if (oldIE) {
        // for IE 9, use the 2D rotation
        this._icon.style[L.DomUtil.TRANSFORM] = 'rotate(' + this.options.bearingAngle + 'deg)'
      } else {
        // for modern browsers, prefer the 3D accelerated version
        this._icon.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.bearingAngle + 'deg)'
      }
    }
  },

  setRotationAngle: function (angle) {
    this.options.bearingAngle = angle
    this.update()
    return this
  },

  setRotationOrigin: function (origin) {
    this.options.rotationOrigin = origin
    this.update()
    return this
  }
})

L.baseMarker = function (latlng, options) {
  return new L.BaseMarker(latlng, options)
}

export var BaseMarker = L.BaseMarker
