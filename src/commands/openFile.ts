import { Command } from "../common/types";
import {
  Uri,
  SourceControlResourceState,
  window,
  workspace,
  TextDocumentShowOptions,
  ViewColumn
} from "vscode";
import { Resource } from "../resource";
import IncommingChangeNode from "../treeView/nodes/incomingChangeNode";
import * as fs from "fs";
import { fromSvnUri } from "../uri";

export class OpenFile implements Command {
  public name = "svn.openFile";

  public async run(
    arg?: Resource | Uri | IncommingChangeNode,
    ...resourceStates: SourceControlResourceState[]
  ) {
    const preserveFocus = arg instanceof Resource;

    let uris: Uri[] | undefined;

    if (arg instanceof Uri) {
      if (arg.scheme === "svn") {
        uris = [Uri.file(fromSvnUri(arg).fsPath)];
      } else if (arg.scheme === "file") {
        uris = [arg];
      }
    } else if (arg instanceof IncommingChangeNode) {
      const resource = new Resource(
        arg.uri,
        arg.type,
        undefined,
        arg.props,
        true
      );

      uris = [resource.resourceUri];
    } else {
      let resource = arg;

      if (resource) {
        uris = [
          ...resourceStates.map(r => r.resourceUri),
          resource.resourceUri
        ];
      }
    }

    if (!uris) {
      return;
    }

    const preview = uris.length === 1 ? true : false;
    const activeTextEditor = window.activeTextEditor;
    for (const uri of uris) {
      if (fs.existsSync(uri.fsPath) && fs.statSync(uri.fsPath).isDirectory()) {
        continue;
      }

      const opts: TextDocumentShowOptions = {
        preserveFocus,
        preview,
        viewColumn: ViewColumn.Active
      };

      if (
        activeTextEditor &&
        activeTextEditor.document.uri.toString() === uri.toString()
      ) {
        opts.selection = activeTextEditor.selection;
      }

      const document = await workspace.openTextDocument(uri);
      await window.showTextDocument(document, opts);
    }
  }
}
