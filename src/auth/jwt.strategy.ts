import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userrepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret51',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;

    const user = await this.userrepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
