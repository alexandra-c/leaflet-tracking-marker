import { type ForwardRefExoticComponent, type RefAttributes } from 'react'
import { type LatLngExpression, Marker } from 'leaflet'
import { type MarkerProps } from 'react-leaflet';

interface TrackingMarkerOptions extends MarkerProps {
  /*
   * Previous position coordinates used to compute the bearing angle in degrees, clockwise. Defaults to 'center'
   */
  previousPosition?: LatLngExpression
  /*
   * Rotation angle, in degrees, clockwise. Allows setting the marker rotation angle manually, ignoring the 'previousPosition' property.
   */
  rotationAngle?: number
  /*
   * The rotation center, as a transform-origin CSS rule. Defaults to 'center'
   */
  rotationOrigin?: string
  /*
   * Duration in milliseconds marker will take to destination
   */
  duration: number
  /*
   * If 'true' it makes map view follow marker
   */
  keepAtCenter?: boolean
}

type TrackingMarkerProps = TrackingMarkerOptions & {
  position: LatLngExpression
}

declare class LeafletTrackingMarkerElement extends Marker {
  constructor(position: LatLngExpression, options: TrackingMarkerOptions)
  declare options: TrackingMarkerOptions

  /*
   * Sets the rotation origin value.
   */
  setRotationOrigin(newOrigin: string): void
}

declare const LeafletTrackingMarker: ForwardRefExoticComponent<TrackingMarkerProps & RefAttributes<LeafletTrackingMarkerElement>>
export { LeafletTrackingMarker, type LeafletTrackingMarkerElement, TrackingMarkerOptions }
