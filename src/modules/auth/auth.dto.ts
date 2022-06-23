export interface IAuthDto {
  phone: string;
  password: string;
}

export function getAuthDtoFromBody(body: any): IAuthDto {
  return {
    phone: body.phone,
    password: body.password,
  };
}
