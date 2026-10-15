export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }

  static badRequest(msg: string) { return new HttpError(400, msg); }
  static unauthorized(msg = 'No autorizado') { return new HttpError(401, msg); }
  static forbidden(msg = 'No tienes permisos para esta operación') { return new HttpError(403, msg); }
  static notFound(msg = 'Recurso no encontrado') { return new HttpError(404, msg); }
}
