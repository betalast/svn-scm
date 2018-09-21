import { Command } from "../common/types";
import { Model } from "../model";
import { commands } from "vscode";
import { OpenFile } from "./openFile";

const svnCommands: Command[] = [new OpenFile()];

export class CommandRegister {
  constructor(private model: Model) {}

  public register() {
    svnCommands.map(command => {
      if (!command.needsRepository) {
        return commands.registerCommand(command.name, command.run);
      }
    });
  }
}
