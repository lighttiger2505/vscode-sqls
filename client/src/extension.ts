/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { ExtensionContext } from 'vscode';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient';

import vscode = require('vscode');

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	const config = parseLanguageServerConfig();
    let serverOptions: ServerOptions = {
        command: "sqls",

        args: [...config.flags],
    };

    let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'sql', pattern: '**/*.sql' }],
    };

    client = new LanguageClient(
        'languageServerExample',
        serverOptions,
        clientOptions,
    );
    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

interface LanguageServerConfig {
	flags: string[];
}

export function parseLanguageServerConfig(): LanguageServerConfig {
	const sqlsConfig = getSqlsConfig();
	const config = {
		flags: sqlsConfig['languageServerFlags'] || [],
	};
	return config;
}

export function getSqlsConfig(uri?: vscode.Uri): vscode.WorkspaceConfiguration {
	if (!uri) {
		if (vscode.window.activeTextEditor) {
			uri = vscode.window.activeTextEditor.document.uri;
		} else {
			uri = null;
		}
	}
	return vscode.workspace.getConfiguration('sqls', uri);
}
