// tslint:disable:max-classes-per-file
// Disabling tslint's max classes rule here because it would add a lot of unnecessary separation for simple classes.
export class RetrieveBlockError extends Error {
  constructor() {
    super("Error block, max retries failed");
    Object.setPrototypeOf(this, RetrieveBlockError.prototype);
  }
}

export class RetrieveHeadBlockError extends Error {
  constructor() {
    super("Error retrieving head block, max retries failed");
    Object.setPrototypeOf(this, RetrieveHeadBlockError.prototype);
  }
}

export class RetrieveIrreversibleBlockError extends Error {
  constructor() {
    super("Error retrieving last irreversible block, max retries failed");
    Object.setPrototypeOf(this, RetrieveIrreversibleBlockError.prototype);
  }
}

export class NoBlockStateFoundError extends Error {
  constructor(blockNumber: number) {
    super(`No block state with block number ${blockNumber} found`);
    Object.setPrototypeOf(this, NoBlockStateFoundError.prototype);
  }
}

export class MultipleBlockStateError extends Error {
  constructor(blockNumber: number) {
    super(
      `More than one block state returned for block number ${blockNumber}. ` +
        "Make sure you have the `--mongodb-update-via-block-num` flag set on your node."
    );
    Object.setPrototypeOf(this, MultipleBlockStateError.prototype);
  }
}

// newly added
export class MismatchedBlockHashError extends Error {
  constructor(currentBlock: number, expectedHash: string, actualHash: string) {
    super(
      `Block hashes do not match; block not part of current chain.` +
        ` Current block: ${currentBlock} Expected: ${expectedHash} Found: ${actualHash}`
    );
    Object.setPrototypeOf(this, MismatchedBlockHashError.prototype);
  }
}

export class MissingHandlerVersionError extends Error {
  constructor() {
    super("Must have at least one handler version.");
    Object.setPrototypeOf(this, MissingHandlerVersionError.prototype);
  }
}

export class DuplicateHandlerVersionError extends Error {
  constructor(versionName: string) {
    super(
      `Handler version name '${versionName}' already exists. ` +
        "Handler versions must have unique names."
    );
    Object.setPrototypeOf(this, DuplicateHandlerVersionError.prototype);
  }
}

export class ImproperStartAtBlockError extends Error {
  constructor(blockNumber: number, startAtBlock: number) {
    super(
      `Cannot seek to block number ${blockNumber} before configured \`startAtBlock\` number ${startAtBlock}. `
    );
    Object.setPrototypeOf(this, ImproperStartAtBlockError.prototype);
  }
}

export class ImproperSeekToBlockError extends Error {
  constructor(blockNumber: number) {
    super(
      `Cannot seek to block number ${blockNumber} as it does not exist yet.`
    );
    Object.setPrototypeOf(this, ImproperSeekToBlockError.prototype);
  }
}

export class ReloadHistoryError extends Error {
  constructor() {
    super("Could not reload history.");
    Object.setPrototypeOf(this, ReloadHistoryError.prototype);
  }
}

export class UnresolvedForkError extends Error {
  constructor() {
    super("Last irreversible block has been passed without resolving fork");
    Object.setPrototypeOf(this, UnresolvedForkError.prototype);
  }
}

// Adapted from https://stackoverflow.com/a/42755876
class RethrownError extends Error {
  constructor(message: string, error?: Error) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }

    if (error) {
      this.extendStack(error);
    }

    Object.setPrototypeOf(this, RethrownError.prototype);
  }

  private extendStack(error: Error) {
    const messageLines = (this.message.match(/\n/g) || []).length + 1;
    if (this.stack) {
      this.stack =
        this.stack
          .split("\n")
          .slice(0, messageLines + 1)
          .join("\n") +
        "\n" +
        error.stack;
    }
  }
}

export class NotInitializedError extends RethrownError {
  constructor(message?: string, error?: Error) {
    super(`The proper initialization has not occurred. ${message}`, error);
    Object.setPrototypeOf(this, NotInitializedError.prototype);
  }
}

export class JsonBlockIndicatesWrongPosition extends Error {
  constructor(blockNumber: number, position: number) {
    super(
      `Block with indicated position ${blockNumber} has actual position of ${position}.`
    );
    Object.setPrototypeOf(this, JsonBlockIndicatesWrongPosition.prototype);
  }
}

export class JsonBlockDoesNotExist extends Error {
  constructor(blockNumber: number) {
    super(`Block at position ${blockNumber} does not exist.`);
    Object.setPrototypeOf(this, JsonBlockDoesNotExist.prototype);
  }
}
