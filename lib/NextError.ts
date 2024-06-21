

export class NextError extends Error {

  message: string;
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = NextError.name;
    this.message = message;
    this.status = status;
  }
}

// 400
export const UsernameTakenErr: NextError = new NextError("A user already exists with that username", 400);
export const EmailTakenErr: NextError = new NextError("A user already exists with that email", 400);
export const InvalidMessageErr: NextError = new NextError("Invalid message", 400);


// 401
export const InvalidPasswordErr: NextError = new NextError("Invalid Password", 401);

// 404
export const UserNotFoundErr: NextError = new NextError("User not found", 404);
export const CampaignNotFoundErr: NextError = new NextError("Campaign not found", 404);
export const ThreadNotFoundErr: NextError = new NextError("Cannot find that thread", 404);