import { injectable, inject } from "tsyringe";
import type { GitHubApiPort } from "../domain/ports/github-api.port";
import type { LoggerPort } from "../domain/ports";
import type {
  AuthResult,
  RepoInfo,
  PagesInfo,
  GitFileEntry,
  GitPushResult,
} from "../types/github.types";
import { GithubAuthService } from "../domain/github/github-auth.service";
import { GithubRepoService } from "../domain/github/github-repo.service";
import { GithubPagesService } from "../domain/github/github-pages.service";
import { ErrorBoundary } from "./error-boundary";
import { DI_TOKENS } from "../di/tokens";

@injectable()
export class GithubApiAdapter implements GitHubApiPort {
  constructor(
    @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
    @inject(DI_TOKENS.GitHubAuthService) private readonly authService: GithubAuthService,
    @inject(DI_TOKENS.GitHubRepoService) private readonly repoService: GithubRepoService,
    @inject(DI_TOKENS.GitHubPagesService) private readonly pagesService: GithubPagesService,
  ) {}

  async validateToken(token: string): Promise<AuthResult> {
    this.logger.debug("GithubApiAdapter.validateToken");
    return ErrorBoundary.wrap(
      async (): Promise<AuthResult> => this.authService.validateToken(token),
      "GithubApiAdapter.validateToken",
      this.logger,
    );
  }

  async ensureRepoExists(
    token: string,
    owner: string,
    repo: string,
  ): Promise<RepoInfo> {
    this.logger.debug("GithubApiAdapter.ensureRepoExists");
    return ErrorBoundary.wrap(
      async (): Promise<RepoInfo> => this.repoService.ensureRepoExists(token, owner, repo),
      "GithubApiAdapter.ensureRepoExists",
      this.logger,
    );
  }

  async pushFiles(
    token: string,
    owner: string,
    repo: string,
    branch: string,
    files: GitFileEntry[],
    message: string,
  ): Promise<GitPushResult> {
    this.logger.debug("GithubApiAdapter.pushFiles");
    return ErrorBoundary.wrap(
      async (): Promise<GitPushResult> => this.repoService.pushFiles(token, owner, repo, branch, files, message),
      "GithubApiAdapter.pushFiles",
      this.logger,
    );
  }

  async deleteFiles(
    token: string,
    owner: string,
    repo: string,
    branch: string,
    filePaths: string[],
    message: string,
  ): Promise<GitPushResult> {
    this.logger.debug("GithubApiAdapter.deleteFiles");
    return ErrorBoundary.wrap(
      async (): Promise<GitPushResult> => this.repoService.deleteFiles(token, owner, repo, branch, filePaths, message),
      "GithubApiAdapter.deleteFiles",
      this.logger,
    );
  }

  async enablePages(
    token: string,
    owner: string,
    repo: string,
    branch?: string,
  ): Promise<void> {
    this.logger.debug("GithubApiAdapter.enablePages");
    return ErrorBoundary.wrap(
      async (): Promise<void> => { await this.pagesService.enablePages(token, owner, repo, branch); },
      "GithubApiAdapter.enablePages",
      this.logger,
    );
  }

  async getPagesStatus(
    token: string,
    owner: string,
    repo: string,
  ): Promise<PagesInfo> {
    this.logger.debug("GithubApiAdapter.getPagesStatus");
    return ErrorBoundary.wrap(
      async (): Promise<PagesInfo> => this.pagesService.getPagesStatus(token, owner, repo),
      "GithubApiAdapter.getPagesStatus",
      this.logger,
    );
  }
}
