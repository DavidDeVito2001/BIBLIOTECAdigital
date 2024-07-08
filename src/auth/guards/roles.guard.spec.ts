import { RolesGuard } from './roles.guard';
import { ROLES } from '../../constants/roles';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should allow access for public routes', () => {
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          roleUser: null, // Define el roleUser según el caso de prueba
        }),
      }),
      getHandler: jest.fn(),
    };

    jest.spyOn(reflector, 'get').mockImplementation((key: string, handler: any) => {
      if (key === 'PUBLIC') {
        return true; // Simulando una ruta pública
      }
      return null;
    });

    const result = guard.canActivate(mockExecutionContext as ExecutionContext);
    expect(result).toBeTruthy();
  });

  it('should allow access for admin role', () => {
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          roleUser: ROLES.ADMIN, // Define el roleUser según el caso de prueba
        }),
      }),
      getHandler: jest.fn(),
    };

    jest.spyOn(reflector, 'get').mockImplementation((key: string, handler: any) => {
      if (key === 'ROLES') {
        return [ROLES.ADMIN]; // Simulando roles requeridos
      }
      if (key === 'ADMIN') {
        return 'ADMIN'; // Simulando rol de administrador requerido
      }
      return null;
    });

    const result = guard.canActivate(mockExecutionContext as ExecutionContext);
    expect(result).toBeTruthy();
  });

  it('should allow access for both basic and admin roles', () => {
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          roleUser: ROLES.BASIC, // Define el roleUser según el caso de prueba
        }),
      }),
      getHandler: jest.fn(),
    };

    jest.spyOn(reflector, 'get').mockImplementation((key: string, handler: any) => {
      if (key === 'ROLES') {
        return [ROLES.BASIC, ROLES.ADMIN]; // Simulando roles requeridos que incluyen BASIC y ADMIN
      }
      if (key === 'ADMIN') {
        return 'ADMIN'; // Simulando rol de administrador requerido
      }
      return null;
    });

    const result = guard.canActivate(mockExecutionContext as ExecutionContext);
    expect(result).toBeTruthy();
  });

  it('should throw UnauthorizedException for unauthorized role', () => {
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          roleUser: ROLES.BASIC, // Define el roleUser según el caso de prueba
        }),
      }),
      getHandler: jest.fn(),
    };

    jest.spyOn(reflector, 'get').mockImplementation((key: string, handler: any) => {
      if (key === 'ROLES') {
        return [ROLES.ADMIN]; // Simulando roles requeridos diferentes al roleUser
      }
      if (key === 'ADMIN') {
        return 'ADMIN'; // Simulando rol de administrador requerido
      }
      return null;
    });

    expect(() => guard.canActivate(mockExecutionContext as ExecutionContext)).toThrow(UnauthorizedException);
  });
});
