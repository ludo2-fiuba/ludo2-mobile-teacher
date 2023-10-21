import { MustLoginAgain } from '../repositories';

// Removed request and authenticated component as you can directly call makerequest with the navigation object
export function makeRequest(f: any, navigation: any) {
  return f().catch((error: unknown) => {
    if (error instanceof MustLoginAgain) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Landing'}],
      });
    } else {
      return Promise.reject(error);
    }
  });
}
