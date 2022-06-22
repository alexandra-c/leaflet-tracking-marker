import { createLayerComponent } from '@react-leaflet/core'
import { BaseMarker } from './BaseMarker'

const defaultPosition = [0, 0]
const computeBearing = (previousPosition = defaultPosition, nexPosition) => {
  let bearing = Math.atan2(nexPosition[0] - previousPosition[0], nexPosition[1] - previousPosition[1])
  bearing = bearing * (180 / Math.PI)
  bearing = (bearing + 360) % 360
  bearing = 360 - bearing
  return bearing
}

const createMarker = ({ position, previousPosition, ...options }, ctx) => {
  const bearingAngle = computeBearing(previousPosition, position)
  const instance = new BaseMarker(position, { ...options, bearingAngle })
  return { instance, context: { ...ctx, overlayContainer: instance } }
const createMarker = ({ position, previousPosition, rotationAngle, ...options }, ctx) => {
  const bearingAngle = rotationAngle ?? computeBearing(previousPosition, position)

const updateMarker = (marker, props, prevProps) => {
  const { position, previousPosition, duration, keepAtCenter, icon, zIndexOffset, opacity, draggable, rotationOrigin, rotationAngle } = props
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
  if (rotationAngle) {
    marker.setRotationAngle(rotationAngle)
  } else {
    if (previousPosition?.[0] !== position[0] && previousPosition?.[1] !== position[1]) {
      const bearingAngle = computeBearing(previousPosition, position)
      marker.setRotationAngle(bearingAngle)
    }
  }

  if (rotationOrigin !== prevProps.rotationOrigin) {
    marker.setRotationOrigin(rotationOrigin)
  }
}

export const LeafletTrackingMarker = createLayerComponent(createMarker, updateMarker)
