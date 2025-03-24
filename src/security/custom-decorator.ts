import { SetMetadata, UnauthorizedException } from '@nestjs/common'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

export const ROLES_KEY = 'roles'
export const PERMISSIONS_KEY = 'permissions'

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles && !requiredPermissions) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token')
    }

    try {
      const token = authHeader.split(' ')[1]
      const user = this.jwtService.verify(token)

      // Store decoded user in request for later use
      request.user = user

      const hasRole = () =>
        requiredRoles.some((role) => user.roles?.includes(role))
      const hasPermission = () =>
        requiredPermissions.some((permission) =>
          user.permissions?.includes(permission),
        )

      return requiredRoles ? hasRole() : hasPermission()
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
