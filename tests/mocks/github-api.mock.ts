import type { GitHubApiPort } from "../../src/domain/ports/github-api.port";
import type {
  AuthResult,
  RepoInfo,
  PagesInfo,
  GitFileEntry,
  GitPushResult,
} from "../../src/types/github.types";

interface CallRecord {
  method: string;
  args: unknown[];
}

export class MockGitHubApi implements GitHubApiPort {
  private mockValidateTokenResult: AuthResult = { valid: true, username: "test-user" };
  private mockEnsureRepoExistsResult: RepoInfo = {
    name: "test-repo",
    owner: "test-user",
    fullName: "test-user/test-repo",
    url: "https://github.com/test-user/test-repo",
    defaultBranch: "main",
    exists: true,
  };
  private mockPushFilesResult: GitPushResult = { success: true, commitSha: "abc123" };
  private mockDeleteFilesResult: GitPushResult = { success: true, commitSha: "def456" };
  private mockPagesInfo: PagesInfo = {
    enabled: true,
    url: "https://test-user.github.io/test-repo",
    status: "built",
  };

  // Call tracking
  private readonly calls: CallRecord[] = [];

  // Transient failure simulation
  private pushFilesFailureCount: number = 0;
  private pushFilesCallCount: number = 0;

  reset(): void {
    this.calls.length = 0;
    this.pushFilesCallCount = 0;
    this.pushFilesFailureCount = 0;
    this.mockValidateTokenResult = { valid: true, username: "test-user" };
    this.mockEnsureRepoExistsResult = {
      name: "test-repo",
      owner: "test-user",
      fullName: "test-user/test-repo",
      url: "https://github.com/test-user/test-repo",
      defaultBranch: "main",
      exists: true,
    };
    this.mockPushFilesResult = { success: true, commitSha: "abc123" };
    this.mockDeleteFilesResult = { success: true, commitSha: "def456" };
    this.mockPagesInfo = {
      enabled: true,
      url: "https://test-user.github.io/test-repo",
      status: "built",
    };
  }

  getCallHistory(): CallRecord[] {
    return [...this.calls];
  }

  getLastCall(method: string): unknown[] | undefined {
    const matching: CallRecord[] = this.calls.filter(
      (c: CallRecord): boolean => c.method === method,
    );
    return matching[matching.length - 1]?.args;
  }

  setValidateTokenResult(result: AuthResult): void {
    this.mockValidateTokenResult = result;
  }

  setEnsureRepoExistsResult(result: RepoInfo): void {
    this.mockEnsureRepoExistsResult = result;
  }

  setPushFilesResult(result: GitPushResult): void {
    this.mockPushFilesResult = result;
  }

  setDeleteFilesResult(result: GitPushResult): void {
    this.mockDeleteFilesResult = result;
  }

  setPagesInfo(info: PagesInfo): void {
    this.mockPagesInfo = info;
  }

  /**
   * Configure pushFiles to fail a given number of times before succeeding.
   */
  setPushFilesTransientFailures(failCount: number): void {
    this.pushFilesFailureCount = failCount;
    this.pushFilesCallCount = 0;
  }

  async validateToken(_token: string): Promise<AuthResult> {
    this.calls.push({ method: "validateToken", args: [_token] });
    return this.mockValidateTokenResult;
  }

  async ensureRepoExists(
    _token: string,
    _owner: string,
    _repo: string,
  ): Promise<RepoInfo> {
    this.calls.push({ method: "ensureRepoExists", args: [_token, _owner, _repo] });
    return this.mockEnsureRepoExistsResult;
  }

  async pushFiles(
    _token: string,
    _owner: string,
    _repo: string,
    _branch: string,
    _files: GitFileEntry[],
    _message: string,
  ): Promise<GitPushResult> {
    this.calls.push({
      method: "pushFiles",
      args: [_token, _owner, _repo, _branch, _files, _message],
    });
    this.pushFilesCallCount++;
    if (this.pushFilesCallCount <= this.pushFilesFailureCount) {
      return { success: false, error: "Transient network error" };
    }
    return this.mockPushFilesResult;
  }

  async deleteFiles(
    _token: string,
    _owner: string,
    _repo: string,
    _branch: string,
    _filePaths: string[],
    _message: string,
  ): Promise<GitPushResult> {
    this.calls.push({
      method: "deleteFiles",
      args: [_token, _owner, _repo, _branch, _filePaths, _message],
    });
    return this.mockDeleteFilesResult;
  }

  async enablePages(
    _token: string,
    _owner: string,
    _repo: string,
    _branch?: string,
  ): Promise<void> {
    this.calls.push({ method: "enablePages", args: [_token, _owner, _repo, _branch] });
  }

  async getPagesStatus(
    _token: string,
    _owner: string,
    _repo: string,
  ): Promise<PagesInfo> {
    this.calls.push({ method: "getPagesStatus", args: [_token, _owner, _repo] });
    return this.mockPagesInfo;
  }
}
