import { commands } from "vscode";
import { Repository } from "../repository";
import { Command } from "./command";

export class PromptAuth extends Command {
  constructor() {
    super("svn.promptAuth", { repository: true });
  }

  public async execute(repository: Repository) {} // tslint:disable-line
}
