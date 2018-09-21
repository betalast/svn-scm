import { commands, Disposable } from "vscode";
import { ICommandOptions } from "../common/types";

export abstract class Command implements Disposable {
  private _disposable?: Disposable;

  constructor(commandName: string, options: ICommandOptions = {}) {
    if (!options.repository) {
      this._disposable = commands.registerCommand(
        commandName,
        (...args: any[]) => this.execute(...args)
      );

      return;
    }
  }

  public abstract execute(...args: any[]): any;

  public dispose() {
    // this._disposable && this._disposable.dispose();
  }
}
