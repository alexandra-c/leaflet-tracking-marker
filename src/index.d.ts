import { LatLngExpression, Marker, MarkerOptions } from 'leaflet'

export class LeafletTrackingMarker extends Marker {
  constructor(position: LatLngExpression, options: TrackingMarkerOptions | MarkerOptions)

  /*
   * Sets the rotation origin value.
   */
  setRotationOrigin(newOrigin: string): void
}

interface TrackingMarkerOptions extends MarkerOptions {
  /*
   * Previous position coordinates used to compute the bearing angle in degrees, clockwise. Defaults to 'center'
   */
  previousPosition?: LatLngExpression
  /*
   * Rotation angle, in degrees, clockwise. Allows setting the marker rotation angle manually, ignoring the 'previousPosition' property.
   */
  rotationAngle?: number  
  /*
   * Rotation angle, in degrees, clockwise. Defaults to 'center'
   */
  rotationOrigin?: string
  /*
   * Duration in milliseconds marker will take to destination
   */
  duration: number
  /*
   * If 'true' it makes map view follow marker
   */
  keepAtCenter: boolean
}
