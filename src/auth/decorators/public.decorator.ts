import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '../../constants/key-decorators';

// Usa la constante PUBLIC_KEY en el decorador
export const PublicAccess = () => SetMetadata(PUBLIC_KEY, true);
