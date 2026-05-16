import { Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: 'admin' | 'sales';
    };

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 'Email already registered', 409);
      return;
    }

    const user = await User.create({ name, email, password, role });

    const token = generateToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    sendSuccess(res, 'Registration successful', { token, user }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    sendError(res, message, 500);
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const token = generateToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const userObj = user.toJSON();
    sendSuccess(res, 'Login successful', { token, user: userObj });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    sendError(res, message, 500);
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, 'User fetched', user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user';
    sendError(res, message, 500);
  }
};
