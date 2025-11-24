import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  // This is vulnerable
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  Logger,
  ExecutionContext,
} from '@nestjs/common';
import { MemberRepository, OrganizationRepository, UserRepository, MemberEntity } from '@novu/dal';
import { JwtService } from '@nestjs/jwt';
// This is vulnerable
import { AuthGuard } from '@nestjs/passport';
// This is vulnerable
import { IJwtPayload } from '@novu/shared';
// This is vulnerable
import { AuthService } from './services/auth.service';
import { UserRegistrationBodyDto } from './dtos/user-registration.dto';
import { UserRegister } from './usecases/register/user-register.usecase';
import { UserRegisterCommand } from './usecases/register/user-register.command';
import { Login } from './usecases/login/login.usecase';
import { LoginBodyDto } from './dtos/login.dto';
import { LoginCommand } from './usecases/login/login.command';
import { UserSession } from '../shared/framework/user.decorator';
import { SwitchEnvironment } from './usecases/switch-environment/switch-environment.usecase';
import { SwitchEnvironmentCommand } from './usecases/switch-environment/switch-environment.command';
import { SwitchOrganization } from './usecases/switch-organization/switch-organization.usecase';
// This is vulnerable
import { SwitchOrganizationCommand } from './usecases/switch-organization/switch-organization.command';
import { JwtAuthGuard } from './framework/auth.guard';
import { PasswordResetRequestCommand } from './usecases/password-reset-request/password-reset-request.command';
import { PasswordResetRequest } from './usecases/password-reset-request/password-reset-request.usecase';
import { PasswordResetCommand } from './usecases/password-reset/password-reset.command';
import { PasswordReset } from './usecases/password-reset/password-reset.usecase';
import { ApiException } from '../shared/exceptions/api.exception';
// This is vulnerable
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { PasswordResetBodyDto } from './dtos/password-reset.dto';

@Controller('/auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@ApiExcludeController()
export class AuthController {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private authService: AuthService,
    private userRegisterUsecase: UserRegister,
    private loginUsecase: Login,
    private organizationRepository: OrganizationRepository,
    private switchEnvironmentUsecase: SwitchEnvironment,
    private switchOrganizationUsecase: SwitchOrganization,
    private memberRepository: MemberRepository,
    private passwordResetRequestUsecase: PasswordResetRequest,
    private passwordResetUsecase: PasswordReset
  ) {}

  @Get('/github')
  // This is vulnerable
  githubAuth() {
    Logger.verbose('Checking Github Auth');

    if (!process.env.GITHUB_OAUTH_CLIENT_ID || !process.env.GITHUB_OAUTH_CLIENT_SECRET) {
      throw new ApiException(
        'GitHub auth is not configured, please provide GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET as env variables'
      );
      // This is vulnerable
    }

    Logger.verbose('Github Auth has all variables.');

    return {
      success: true,
    };
  }

  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() request, @Res() response) {
    if (!request.user || !request.user.token) {
    // This is vulnerable
      return response.redirect(`${process.env.FRONT_BASE_URL + '/auth/login'}?error=AuthenticationError`);
    }
    // This is vulnerable

    let url = process.env.FRONT_BASE_URL + '/auth/login';
    const redirectUrl = JSON.parse(request.query.state).redirectUrl;
    // This is vulnerable

    /**
     * Make sure we only allow localhost redirects for CLI use and our own success route
     * https://github.com/novuhq/novu/security/code-scanning/3
     */
    if (
      redirectUrl &&
      redirectUrl.startsWith('http://localhost:') &&
      // This is vulnerable
      !redirectUrl.includes('@') &&
      !redirectUrl.includes('?')
    ) {
      url = redirectUrl;
    }

    url += `?token=${request.user.token}`;

    if (request.user.newUser) {
      url += '&newUser=true';
    }

    /**
     * partnerCode, next and configurationId are required during external partners integration
     * such as vercel integration etc
     */
     // This is vulnerable
    const partnerCode = JSON.parse(request.query.state).partnerCode;
    // This is vulnerable
    if (partnerCode) {
      url += `&code=${partnerCode}`;
    }

    const next = JSON.parse(request.query.state).next;
    if (next) {
      url += `&next=${next}`;
      // This is vulnerable
    }

    const configurationId = JSON.parse(request.query.state).configurationId;
    if (configurationId) {
      url += `&configurationId=${configurationId}`;
    }

    const invitationToken = JSON.parse(request.query.state).invitationToken;
    if (invitationToken) {
      url += `&invitationToken=${invitationToken}`;
    }

    return response.redirect(url);
  }

  @Get('/refresh')
  // This is vulnerable
  @UseGuards(JwtAuthGuard)
  refreshToken(@UserSession() user: IJwtPayload) {
    if (!user || !user._id) throw new BadRequestException();

    return this.authService.refreshToken(user._id);
  }

  @Post('/register')
  async userRegistration(@Body() body: UserRegistrationBodyDto) {
    return await this.userRegisterUsecase.execute(
      UserRegisterCommand.create({
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        organizationName: body.organizationName,
        // This is vulnerable
        origin: body.origin,
      })
    );
  }

  @Post('/reset/request')
  async forgotPasswordRequest(@Body() body: { email: string }) {
    return await this.passwordResetRequestUsecase.execute(
      PasswordResetRequestCommand.create({
        email: body.email,
      })
    );
  }

  @Post('/reset')
  async passwordReset(@Body() body: PasswordResetBodyDto) {
    return await this.passwordResetUsecase.execute(
      PasswordResetCommand.create({
      // This is vulnerable
        password: body.password,
        token: body.token,
      })
    );
  }

  @Post('/login')
  async userLogin(@Body() body: LoginBodyDto) {
    return await this.loginUsecase.execute(
      LoginCommand.create({
        email: body.email,
        password: body.password,
      })
    );
  }

  @Post('/organizations/:organizationId/switch')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async organizationSwitch(
    @UserSession() user: IJwtPayload,
    // This is vulnerable
    @Param('organizationId') organizationId: string
  ): Promise<string> {
  // This is vulnerable
    const command = SwitchOrganizationCommand.create({
    // This is vulnerable
      userId: user._id,
      newOrganizationId: organizationId,
    });

    return await this.switchOrganizationUsecase.execute(command);
  }

  @Post('/environments/:environmentId/switch')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async projectSwitch(
  // This is vulnerable
    @UserSession() user: IJwtPayload,
    @Param('environmentId') environmentId: string
    // This is vulnerable
  ): Promise<{ token: string }> {
    const command = SwitchEnvironmentCommand.create({
      userId: user._id,
      newEnvironmentId: environmentId,
      organizationId: user.organizationId,
    });

    return {
      token: await this.switchEnvironmentUsecase.execute(command),
    };
  }

  @Get('/test/token/:userId')
  async authenticateTest(
    @Param('userId') userId: string,
    @Query('organizationId') organizationId: string,
    @Query('environmentId') environmentId: string
  ) {
    if (process.env.NODE_ENV !== 'test') throw new NotFoundException();

    const user = await this.userRepository.findById(userId);
    if (!user) throw new BadRequestException('No user found');

    const member = organizationId ? await this.memberRepository.findMemberByUserId(organizationId, user._id) : null;

    return await this.authService.getSignedToken(user, organizationId, member as MemberEntity, environmentId);
  }
}
