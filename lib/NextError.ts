

export class NextError extends Error {

  message: string;
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

export const UserNotFoundErr: NextError = new NextError("User not found", 404);

export const InvalidPasswordErr: NextError = new NextError("Invalid Password", 401);