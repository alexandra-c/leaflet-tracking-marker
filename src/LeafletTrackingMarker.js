import { createLayerComponent } from '@react-leaflet/core'
import { BaseMarker } from 'features/common/BaseMarker'

let previousBearingAngle = 0
const computeBearing = (previousPosition, nexPosition) => {
  let bearing = Math.atan2(nexPosition[0] - previousPosition[0], nexPosition[1] - previousPosition[1])
  bearing = bearing * (180 / Math.PI)
  bearing = (bearing + 360) % 360
  bearing = 360 - bearing
  return bearing
}

export const LeafletTrackingMarker = createLayerComponent(
  function createMarker({ position, previousPosition, ...options }, ctx) {
    const bearingAngle = computeBearing(previousPosition, position)
    previousBearingAngle = bearingAngle
    const instance = new BaseMarker(position, { ...options, bearingAngle })
    return { instance, context: { ...ctx, overlayContainer: instance } }
  },
  function updateMarker(marker, props, prevProps) {
    const { position, previousPosition, duration, keepAtCenter, icon, zIndexOffset, opacity, draggable, rotationOrigin } = props
    if (prevProps.position !== position && typeof duration == 'number') {
      marker.slideTo(position, {
        duration,
        keepAtCenter
      })
    }
    if (icon && icon !== prevProps.icon) {
      marker.setIcon(icon)
    }
    if (zIndexOffset && zIndexOffset !== prevProps.zIndexOffset) {
      marker.setZIndexOffset(zIndexOffset)
    }
    if (opacity && opacity !== prevProps.opacity) {
      marker.setOpacity(opacity)
    }
    if (marker.dragging && draggable !== prevProps.draggable) {
      if (draggable === true) {
        marker.dragging.enable()
      } else {
        marker.dragging.disable()
      }
    }
    if (previousPosition) {
      const bearingAngle = computeBearing(previousPosition, position)
      if (bearingAngle !== previousBearingAngle) {
        marker.setRotationAngle(bearingAngle)
        previousBearingAngle = bearingAngle
      }
    }
    if (rotationOrigin !== prevProps.rotationOrigin) {
      marker.setRotationOrigin(rotationOrigin)
    }
  }
)
