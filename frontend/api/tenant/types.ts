export interface PropertyFavoriteStatusResponse {
  success: boolean;
  message: string;
  data: { propertyId: number; isFavorited: boolean };
}
