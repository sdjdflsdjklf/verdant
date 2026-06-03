import { injectable, inject } from "tsyringe";
import type { HttpClientPort, LoggerPort } from "../ports";
import { DI_TOKENS } from "../../di/tokens";
import type { PagesInfo } from "../../types/github.types";
import { GITHUB_API_BASE } from "../../constants/github.constants";

interface GitHubPagesData {
  status: "built" | "building" | "errored" | null;
  html_url: string;
  source?: {
    branch: string;
    path: string;
  };
}

@injectable()
export class GithubPagesService {
  constructor(
    @inject(DI_TOKENS.HttpClient) private readonly httpClient: HttpClientPort,
    @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
  ) {}

  public async enablePages(
    token: string,
    owner: string,
    repo: string,
    branch?: string,
  ): Promise<void> {
    const pagesBranch: string = branch ?? "gh-pages";
    this.logger.debug(
      "Enabling GitHub Pages for {owner}/{repo} on branch {branch}",
      owner,
      repo,
      pagesBranch,
    );

    const existingStatus: PagesInfo = await this.getPagesStatus(token, owner, repo);
    if (existingStatus.enabled) {
      this.logger.info(
        "GitHub Pages already enabled for {owner}/{repo}, skipping enable call",
        owner,
        repo,
      );
      return;
    }

    try {
      const response = await this.httpClient.post(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/pages`,
        {
          source: {
            branch: pagesBranch,
            path: "/",
          },
        },
        { headers: this.authHeaders(token) },
      );

      if (
        response.status === 201 ||
        response.status === 204 ||
        response.status === 409
      ) {
        this.logger.info(
          "GitHub Pages enabled for {owner}/{repo}",
          owner,
          repo,
        );
        return;
      }

      this.logger.error(
        "Failed to enable GitHub Pages for {owner}/{repo}: status {status}",
        owner,
        repo,
        response.status,
      );
      throw new Error(
        `GitHub API returned status ${response.status} when enabling Pages.`,
      );
    } catch (error) {
      this.logger.error(
        "Error enabling GitHub Pages for {owner}/{repo}: {error}",
        owner,
        repo,
        error,
      );
      throw error;
    }
  }

  public async getPagesStatus(
    token: string,
    owner: string,
    repo: string,
  ): Promise<PagesInfo> {
    this.logger.debug(
      "Getting GitHub Pages status for {owner}/{repo}",
      owner,
      repo,
    );

    try {
      const response = await this.httpClient.get<GitHubPagesData>(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/pages`,
        { headers: this.authHeaders(token) },
      );

      if (response.status === 200) {
        const data: GitHubPagesData = response.data;
        return {
          enabled: true,
          url: data.html_url,
          status: data.status,
        } satisfies PagesInfo;
      }

      if (response.status === 404) {
        this.logger.info(
          "GitHub Pages not enabled for {owner}/{repo}",
          owner,
          repo,
        );
        return {
          enabled: false,
          url: "",
          status: null,
        } satisfies PagesInfo;
      }

      this.logger.error(
        "Unexpected status getting Pages status for {owner}/{repo}: {status}",
        owner,
        repo,
        response.status,
      );
      return {
        enabled: false,
        url: "",
        status: null,
      } satisfies PagesInfo;
    } catch (error) {
      this.logger.error(
        "Error getting GitHub Pages status for {owner}/{repo}: {error}",
        owner,
        repo,
        error,
      );
      return {
        enabled: false,
        url: "",
        status: null,
      } satisfies PagesInfo;
    }
  }

  private authHeaders(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    };
  }
}
