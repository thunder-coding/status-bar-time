import * as vscode from "vscode";

let statusBarItem: vscode.StatusBarItem;
let x: number = 0;
const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function activate({ subscriptions }: vscode.ExtensionContext) {
	console.log(
		'Congratulations, your extension "status-bar-time" is now active!'
	);
	/**
	 * ```
	 * 'status-bar-time.toggle-status-bar-visibility'
	 * ```
	 */
	let commandId: string = "status-bar-time.toggle-status-bar-visibility";
	subscriptions.push(
		vscode.commands.registerCommand(commandId, () => {
			let previousConfiguration: boolean = vscode.workspace.getConfiguration().get("status-bar-time.visible") as unknown as boolean;
			vscode.workspace.getConfiguration("settings").update("status-bar-time.visible", previousConfiguration ? false : true, true);
		}));

	statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		-1000
	);
	statusBarItem.command = commandId;
	statusBarItem.text = "Hello";
	subscriptions.push(statusBarItem);

	updateStatusBarTime();
	setInterval(updateStatusBarTime, 1000);
}

function updateStatusBarTime(): void {
    let timeString: string = "";
    let date: Date;

    date = new Date();

	if (!vscode.workspace.getConfiguration().get("status-bar-time.visible") as boolean) {
		statusBarItem.hide();
		return;
	}
    let dateFormat: string = vscode.workspace.getConfiguration().get("status-bar-time.dateFormat") as string;

    timeString = dateFormat;
    timeString = timeString.replace(/month/gi,	months[date.getMonth()]);
    timeString = timeString.replace(/date/gi,	date.getDate() as unknown as string);
    timeString = timeString.replace(/year/gi,	date.getFullYear() as unknown as string);
    timeString = timeString.replace(/hour/gi,	date.getHours() as unknown as string);
    timeString = timeString.replace(/minute/gi,	date.getMinutes() as unknown as string);
    timeString = timeString.replace(/second/gi, date.getSeconds() as unknown as string);
    statusBarItem.text = timeString;
    statusBarItem.show();
}

export function deactivate() {}
