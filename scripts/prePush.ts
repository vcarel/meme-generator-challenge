import { $ } from "execa";
import type { ListrTask } from "listr2";
import { ValidationError, runTasks } from "./helpers";
import { verifyCodeTask } from "./verifyCodeTask";

const pendingChangeMsg =
  "You have uncommitted changes. Please commit or stash them before pushing.";

const checkPendingChanges: ListrTask = {
  task: async () => {
    const count = Number((await $`git status --porcelain=2`.pipe`wc -l`).stdout.toString());

    if (count > 0) {
      throw new ValidationError("Pending changes detected", pendingChangeMsg);
    }
  },
  title: "Checking pending changes…",
};

const main = async () => runTasks([checkPendingChanges, verifyCodeTask]);

main();
