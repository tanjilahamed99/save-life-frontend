import { jwtDecode } from 'jwt-decode';

export const jwtDecodeHook = (token, role) => {
  try {
    const decoded = jwtDecode(token);

    return {
      user: decoded.payload,
      isValid: role ? decoded?.payload?.role === role : true,
    };
  } catch (error) {
    console.error('JWT decoding failed:', error);
    return {
      user: null,
      isValid: false,
    };
  }
};
