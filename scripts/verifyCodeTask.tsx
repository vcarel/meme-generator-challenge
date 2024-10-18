import { $, type ExecaError } from "execa";
import { Listr, type ListrTask } from "listr2";
import { getValidationError } from "./helpers";

export const verifyCodeTask: ListrTask = {
  task: () =>
    new Listr(
      [
        {
          task: async () => {
            try {
              await $`npm run lint`;
            } catch (e) {
              console.log(e);
              throw getValidationError("Lint checks failed", e as ExecaError);
            }
          },
          title: "Running lint checks…",
        },
        {
          task: async () => {
            try {
              await $`npm run check-types`;
            } catch (e) {
              throw getValidationError("Check-types failed", e as ExecaError);
            }
          },
          title: "Checking types…",
        },
        {
          task: async () => {
            try {
              await $({ env: { CI: "true" } })`npm test`;
            } catch (e) {
              throw getValidationError("Tests failed", e as ExecaError);
            }
          },
          title: "Running tests…",
        },
      ],
      {
        concurrent: true,
        exitOnError: true,
      },
    ),
  title: "Verifying code…",
};
