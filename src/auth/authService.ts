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

      const user = await authRepository.getByEmail({ runner, email });

      if (!user) {
        throw new Exception("Provide valid email", 400);
      }

      // 🔥 STATUS CHECK
      if (user.isActive !== "ACTIVE") {
        throw new Exception(
          user.isActive === "BLOCKED"
            ? "Your account is blocked"
            : "Your account is inactive",
          403
        );
      }

      // 🔑 PASSWORD FETCH
      const userPassword = await authRepository.getPassword({
        runner,
        email,
      });

      if (!userPassword) {
        throw new Exception("Invalid credentials", 400);
      }

      const checkPassword = await comparePassword(password, userPassword);

      if (!checkPassword) {
        throw new Exception("Invalid credentials", 400);
      }

      const payload = {
        userId: user.userId,
        email: user.email,
        role: user.role,
      };

      const accessToken = JWT.sign({
        payload,
        secretKey: JWT_ACCESS_SECRET!,
      });

      const refreshToken = JWT.signRefreshToken({
        payload,
        secretKey: JWT_REFRESH_SECRET!,
      });

      const hashedRefreshToken = await hashPassword(refreshToken);

      await authRepository.storeRefreshToken({
        runner,
        tokenData: {
          token: hashedRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

      // ✅ VERIFY TOKEN
      const decoded = JWT.verify(token, JWT_REFRESH_SECRET!);
      if (!decoded) {
        throw new Exception("Invalid refresh token", 401);
      }

      // 🔥 CHECK USER STATUS
      const user = await authRepository.getByEmail({
        runner,
        email: decoded.email,
      });

      if (!user || user.isActive !== "ACTIVE") {
        throw new Exception("User is inactive or blocked", 403);
      }

      // ✅ GET TOKENS
      const storedTokens = await authRepository.getUserRefreshTokens({
        runner,
        userId: decoded.userId,
      });

      if (!storedTokens || storedTokens.length === 0) {
        throw new Exception("No active session found", 401);
      }

      // ✅ MATCH TOKEN
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

      // ✅ ROTATION
      await authRepository.deleteRefreshToken({
        runner,
        id: matchedToken.id,
      });

      const payload = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };

      const newAccessToken = JWT.sign({
        payload,
        secretKey: JWT_ACCESS_SECRET!,
      });

      const newRefreshToken = JWT.signRefreshToken({
        payload,
        secretKey: JWT_REFRESH_SECRET!,
      });

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
      const user = await authRepository.getByEmail({
        runner,
        email: data.email,
      });

      if (!user) {
        throw new Exception("Provide valid email", 400);
      }

      // 🔥 STATUS CHECK
      if (user.isActive !== "ACTIVE") {
        throw new Exception("Account is inactive or blocked", 403);
      }

      const comparePass = await comparePassword(
        data.password,
        user.password
      );

      if (comparePass) {
        throw new Exception(
          "New password cannot be same as old password",
          400
        );
      }

      const hashedPassword = await hashPassword(data.password);

      const response = await authRepository.updatePassword({
        runner,
        email: data.email,
        newPassword: hashedPassword,
      });

      if (response.affected === 0) {
        throw new Exception("User not found", 404);
      }

      return response;
    } catch (error: any) {
      error.level = "SERVICE";
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },
};