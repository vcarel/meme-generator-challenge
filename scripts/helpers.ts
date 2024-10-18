import chalk from "chalk";
import type { ExecaError } from "execa";
import { Listr, type ListrTask } from "listr2";

export class ValidationError extends Error {
  message: string;
  details: string;
  exitCode: number;

  constructor(message: string, details: string, exitCode = 1) {
    super(message);
    this.message = message;
    this.details = details;
    this.exitCode = exitCode;
  }
}

export const getValidationError = (message: string, e: ExecaError): ValidationError =>
  new ValidationError(
    message,
    [e.stdout?.toString(), e.stderr?.toString()].filter((out) => out !== "").join("\n"),
    e.exitCode,
  );

export const runTasks = async (tasks: ListrTask[]) => {
  try {
    await new Listr(tasks).run();
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(chalk.dim(e.details));
      process.exit(e.exitCode);
    }
  }
};
