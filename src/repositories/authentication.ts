import {post, StatusCodeError} from '../networking';

const authUrl = 'auth';

export class NotATeacher extends Error {
  constructor() {
    super('No eres un profesor registrado en nuestra app');
    this.name = 'NotATeacher';
  }
}

export class InvalidImage extends Error {
  constructor() {
    super('No es una imagen válida');
    this.name = 'InvalidImage';
  }
}

export class InvalidDNI extends Error {
  constructor() {
    super('No es un DNI válido');
    this.name = 'InvalidDNI';
  }
}

export function preregister(
  dni: string,
  email: string,
  image: string,
): Promise<Object> {
  return post(`${authUrl}/users`, {
    dni,
    email,
    is_teacher: true,
    image: `'${image}'`,
  }).catch(error => {
    // Check for: No face detected error
    if (
      error instanceof StatusCodeError &&
      error.isBecauseOf('invalid_image')
    ) {
      return Promise.reject(new InvalidImage());
    } else if (
      error instanceof StatusCodeError &&
      error.fieldErrorIsBecauseOf('dni', 'unique')
    ) {
      return Promise.reject(new InvalidDNI());
    }
    return Promise.reject(error);
  });
}

/// 404: si el usuario no tiene el rol del SIU correspondiente al especificado
/// al registrarse en nuestras apps (ya sea porque no se registró o porque no
/// está en el SIU)
export function login(code: string, redirectUrl: string): Promise<Object> {
  return post(`${authUrl}/oauth`, {code, redirect_uri: redirectUrl}).catch(
    error => {
      if (error instanceof StatusCodeError && error.code == 404) {
        return Promise.reject(new NotATeacher());
      }
      return Promise.reject(error);
    },
  );
}

export function refresh(token: string): Promise<Object> {
  return post(`${authUrl}/jwt/refresh`, {
    refresh: token,
  });
}

export default {
  preregister,
  login,
  refresh,
  NotATeacher,
  InvalidImage,
  InvalidDNI,
};
