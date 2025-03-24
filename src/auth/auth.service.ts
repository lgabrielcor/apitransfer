import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const payload = { sub: user._id, email: user.email, roles: user.roles };

        return {
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: await this.jwtService.signAsync(payload, { expiresIn: '7d' }),
        };
    }

    async refreshToken(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token);
            const newPayload = { sub: payload.sub, email: payload.email, roles: payload.roles };

            return {
                access_token: await this.jwtService.signAsync(newPayload),
            };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.usersService.findByEmail(forgotPasswordDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        // Here you would implement email sending logic
        // Generate reset token and save it to user
        return { message: 'Password reset instructions sent to email' };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        // Verify reset token and update password
        const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
        // Update user password in database
        return { message: 'Password successfully reset' };
    }

    private async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }
}