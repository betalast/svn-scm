import { commands } from "vscode";
import { ISvnCommand } from "../common/types";
import { Model } from "../model";
import { OpenFile } from "./openFile";

const svnCommands: ISvnCommand[] = [new OpenFile()];

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
