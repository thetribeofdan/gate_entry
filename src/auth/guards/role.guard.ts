import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { buildResponse } from '@utils/response.util';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        buildResponse(
          [],
          'You do not have permission to access this resource',
          false,
          403,
        ),
      );
    }

    return true
  }
}
