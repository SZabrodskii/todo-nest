import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { ClientProxy} from '@nestjs/microservices';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid token format');
        }

        return this.client.send<any>({ cmd: 'validate_token' }, { token }).pipe(
            map((user) => {
                req.user = user;
                return true;
            }),
            catchError((error) => {
                console.error('Error validating token:', error);
                return throwError(() => new UnauthorizedException('Invalid or expired token'));
            }),
        );
    }
}

