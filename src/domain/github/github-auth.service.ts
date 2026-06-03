import { injectable, inject } from "tsyringe";
import type { HttpClientPort, LoggerPort } from "../ports";
import { DI_TOKENS } from "../../di/tokens";
import type { AuthResult } from "../../types/github.types";
import { GITHUB_API_BASE } from "../../constants/github.constants";

@injectable()
export class GithubAuthService {
  constructor(
    @inject(DI_TOKENS.HttpClient) private readonly httpClient: HttpClientPort,
    @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
  ) {}

  public async validateToken(token: string): Promise<AuthResult> {
    this.logger.debug("Validating GitHub token...");

    try {
      const response = await this.httpClient.get<{ login: string }>(
        `${GITHUB_API_BASE}/user`,
        {
          headers: this.authHeaders(token),
        },
      );

      if (response.status === 200) {
        const username: string = response.data.login;
        this.logger.info(
          "GitHub token validated for user: {username}",
          username,
        );
        return { valid: true, username };
      }

      if (response.status === 401 || response.status === 403) {
        this.logger.warn(
          "GitHub token rejected with status {status}",
          response.status,
        );
        return {
          valid: false,
          error:
            "Token is invalid or expired. Please generate a new Personal Access Token.",
        };
      }

      this.logger.error(
        "Unexpected status validating token: {status}",
        response.status,
      );
      return {
        valid: false,
        error: `GitHub API returned status ${response.status}.`,
      };
    } catch (error) {
      this.logger.error("Network error validating GitHub token", error);
      return {
        valid: false,
        error: "Network error. Please check your internet connection.",
      };
    }
  }

  private authHeaders(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    };
  }
}
