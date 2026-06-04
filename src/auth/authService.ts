import { environment } from "../config/env.config";
import { Exception } from "../libs/exceptionHandler";
import ORMHelper from "../libs/ORMHelper";
import { comparePassword, hashPassword } from "../libs/passhash";
import { JWT } from "../libs/token";
import { authRepository } from "./auth.repository";
import { forgotPasswordSchemaInput, loginSchemaInput } from "./auth.schema";

const {
  JWT_ACCESS_SECRET_KEY: JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET_KEY: JWT_REFRESH_SECRET,
} = environment;

export const authService = {
  validateLogin: async (data: loginSchemaInput) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const { email, password } = data;
      if (!email || !password) {
        throw new Exception("Email and password are required", 400);
      }
      const isEmailExist = await authRepository.getByEmail({ runner, email });
      if (!isEmailExist) {
        throw new Exception("Provide valid email", 400);
      }

      const userPassword = await authRepository.getPassword({
        runner,
        email,
      });
      if (!userPassword) {
        throw new Exception("Provide valid password", 400);
      }

      const checkPassword = await comparePassword(password, userPassword);
      if (!checkPassword) {
        throw new Exception("Provide valid password", 400);
      }
      const user = isEmailExist;

      const payload = {
        userId: user.userId,
        email: user.email,
        role: user.role,
      };

      const accessToken = JWT.sign({ payload, secretKey: JWT_ACCESS_SECRET! });
      const refreshToken = JWT.signRefreshToken({
        payload,
        secretKey: JWT_REFRESH_SECRET!,
      });

      const hashedRefreshToken = await hashPassword(refreshToken);

      await authRepository.storeRefreshToken({
        runner,
        tokenData: {
          token: hashedRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          userId: user.userId,
        },
      });

      return { user, accessToken, refreshToken };
    } catch (error: any) {
      error.level = "SERVICE";
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },
  refreshAccessToken: async (token: string) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      if (!token) {
        throw new Exception("Refresh token is required", 400);
      }

      // 1. VERIFY TOKEN (expiry checked automatically)
      const decoded = JWT.verify(token, JWT_REFRESH_SECRET!);
      if (!decoded) {
        throw new Exception("Invalid refresh token", 401);
      }

      // 2. GET ALL TOKENS OF USER
      const storedTokens = await authRepository.getUserRefreshTokens({
        runner,
        userId: decoded.userId,
      });

      if (!storedTokens || storedTokens.length === 0) {
        throw new Exception("No active session found", 401);
      }

      // 3. MATCH HASHED TOKEN
      let matchedToken = null;

      for (const t of storedTokens) {
        const isMatch = await comparePassword(token, t.token);
        if (isMatch) {
          matchedToken = t;
          break;
        }
      }

      if (!matchedToken) {
        // 🚨 TOKEN REUSE ATTACK
        await authRepository.deleteAllUserRefreshTokens({
          runner,
          userId: decoded.userId,
        });

        throw new Exception("Token reuse detected. Logged out.", 401);
      }

      // 4. DELETE OLD TOKEN (rotation)
      await authRepository.deleteRefreshToken({
        runner,
        id: matchedToken.id,
      });

      // 5. CREATE NEW PAYLOAD
      const payload = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };

      // 6. GENERATE NEW TOKENS
      const newAccessToken = JWT.sign({
        payload,
        secretKey: JWT_ACCESS_SECRET!,
      });

      const newRefreshToken = JWT.signRefreshToken({
        payload,
        secretKey: JWT_REFRESH_SECRET!,
      });

      // 7. STORE NEW REFRESH TOKEN
      const hashedRefreshToken = await hashPassword(newRefreshToken);

      await authRepository.storeRefreshToken({
        runner,
        tokenData: {
          token: hashedRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          userId: decoded.userId,
        },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error: any) {
      error.level = "SERVICE";
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  forgetPassword: async (data: forgotPasswordSchemaInput) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const isEmailExist = await authRepository.getByEmail({
        runner,
        email: data.email,
      });
      if (!isEmailExist) {
        throw new Exception("Provide valid email", 400);
      }
    
      const comparePass = await comparePassword(
        data.password,
        isEmailExist.password,
      );
      if (comparePass) {
        throw new Exception("New password cannot be same as old password", 400);
      }
        const hashedPassword = await hashPassword(data.password);
      const response = await authRepository.updatePassword({
        runner,
        email: data.email,
        newPassword: hashedPassword,
      });
      if (response.affected === 0) {
        throw new Error("User not found");
      }
      return response;
    } catch (error: any) {
      error.level = "SERVICE";
      throw error;
    }
  },
};
