export interface PromiseResponse {
  error: boolean;
  message: string;
  status: number;
  data?: any;
  list?: any;
}

export interface Admin {
  userId?: string;
  username: string;
  dateOfBirth?: string;
  email?: string;
  profilePicture?: string;
  password?: string;
  mobileNumber?: string;
  '2faEnabled'?: boolean;
  googleId?: string;
  facebookId?: string;
  isAdmin?: boolean;
  type: string;
  deviceType: string;
  fcmToken?: string;
  isEmailVerified?: boolean;
  isMobileNumberVerified?: boolean;
  isKycVerified?: boolean;
  isBankVerified?: boolean;
}

export interface TokenResponse {
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export interface AuthTokenResponseType {
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export interface collection {
  name?: string;
  description?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortBy?: number;
  logo?: string;
  banner?: string;
  featuredImage?: string;
  royalty?: number;
  blockChainId?: number;
  categoryId?: number;
  sensitiveContent?: boolean;
  creator?: string;
}
