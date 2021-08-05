import { LatLngExpression, Marker, MarkerOptions } from "leaflet";

export class LeafletTrackingMarker extends Marker {
  constructor(
    position: LatLngExpression,
    options: RotatedMarkerOptions | MarkerOptions
  );
  /*
   * Sets the rotation angle value.
   */
  setRotationAngle(newAngle: number): void;

  /*
   * Sets the rotation origin value.
   */
  setRotationOrigin(newOrigin: string): void;
}

interface RotatedMarkerOptions extends MarkerOptions {
  /*
   * Previous position coordinates used to compute the bearing angle in degrees, clockwise. Defaults to 'center'
   */
  previousPosition: LatLngExpression;

  /*
   * Rotation angle, in degrees, clockwise
   */
  rotationAngle?: number;

  /*
   * Rotation angle, in degrees, clockwise. Defaults to 'center'
   */
  rotationOrigin?: string;
}
