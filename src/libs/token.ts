  import * as jwt from "jsonwebtoken";

  export type TokenPayload = {
    userId: number;
    role: string;
    email: string;
   
  };

  export type Token = {
    payload: TokenPayload;
    secretKey: string;
  
  };

  export class JWT {
    static sign({ payload, secretKey }: Token) {
      const token = jwt.sign(payload, secretKey,{expiresIn:'1h'})
      return token;
    }

    static signRefreshToken({ payload, secretKey }: Token) {
      const token = jwt.sign(payload, secretKey,{expiresIn:'7d'})
      return token;
    }

    static verify<T = TokenPayload>(token: string, secretKey: string): T {
    try {
      return jwt.verify(token, secretKey) as T;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired - Re-login');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }
  }
