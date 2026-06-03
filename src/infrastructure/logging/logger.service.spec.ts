import { LoggerService } from "./logger.service";

describe("LoggerService", (): void => {
  let logger: LoggerService;

  beforeEach((): void => {
    logger = new LoggerService();
    jest.spyOn(console, "debug").mockImplementation();
    jest.spyOn(console, "info").mockImplementation();
    jest.spyOn(console, "warn").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach((): void => {
    jest.restoreAllMocks();
  });

  it("should log debug messages", (): void => {
    logger.debug("test debug", { key: "value" });
    expect(console.debug).toHaveBeenCalledWith(
      "[OG][DEBUG] test debug",
      { key: "value" },
    );
  });

  it("should log info messages", (): void => {
    logger.info("test info");
    expect(console.info).toHaveBeenCalledWith("[OG][INFO] test info");
  });

  it("should log warn messages", (): void => {
    logger.warn("test warn");
    expect(console.warn).toHaveBeenCalledWith("[OG][WARN] test warn");
  });

  it("should log error messages", (): void => {
    logger.error("test error");
    expect(console.error).toHaveBeenCalledWith("[OG][ERROR] test error");
  });

  it("should suppress debug when level is set to info", (): void => {
    logger.setLevel("info");
    logger.debug("should not appear");
    logger.info("should appear");

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.info).toHaveBeenCalled();
  });

  it("should suppress info when level is set to warn", (): void => {
    logger.setLevel("warn");
    logger.info("suppressed");
    logger.warn("visible");

    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });

  it("should handle multiple meta arguments", (): void => {
    logger.debug("multi", 1, "two", [3]);
    expect(console.debug).toHaveBeenCalledWith(
      "[OG][DEBUG] multi",
      1,
      "two",
      [3],
    );
  });
});
