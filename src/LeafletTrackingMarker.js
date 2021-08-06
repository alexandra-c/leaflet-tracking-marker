import { createElementHook, createPathHook } from '@react-leaflet/core'
import { useEffect, useState } from 'react'
import { BaseMarker } from './BaseMarker'

let previousBearingAngle = 0
const computeBearing = (previousPosition, nexPosition) => {
  let bearing = Math.atan2(nexPosition[0] - previousPosition[0], nexPosition[1] - previousPosition[1])
  bearing = bearing * (180 / Math.PI)
  bearing = (bearing + 360) % 360
  bearing = 360 - bearing
  return bearing
}

const createMarker = ({ position, previousPosition, ...options }, ctx) => {
  const bearingAngle = computeBearing(previousPosition, position)
  if (bearingAngle !== previousBearingAngle) previousBearingAngle = bearingAngle

  const instance = new BaseMarker(position, { ...options, bearingAngle: previousBearingAngle })
  return { instance, context: { ...ctx, overlayContainer: instance } }
}

const updateMarker = (marker, props, prevProps) => {
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
  const bearingAngle = computeBearing(previousPosition, position)
  if (bearingAngle !== previousBearingAngle) {
    marker.setRotationAngle(bearingAngle)
    previousBearingAngle = bearingAngle
  }
  if (rotationOrigin !== prevProps.rotationOrigin) {
    marker.setRotationOrigin(rotationOrigin)
  }
}

const useLeafletTrackingMarker = createPathHook(createElementHook(createMarker, updateMarker))

export const LeafletTrackingMarker = props => {
  const { position } = props
  const [prevPos, setPrevPos] = useState(position)

  useEffect(() => {
    if (prevPos[0] !== position[0] && prevPos[1] !== position[1]) setPrevPos(position)
  }, [position, prevPos])

  useLeafletTrackingMarker({ ...props, previousPosition: prevPos })
  return null
}
