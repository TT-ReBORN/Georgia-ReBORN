"use strict";

include(`${fb.ComponentPath}\\docs\\Flags.js`);

// utils.Run sample for JSplitter
//
// Demonstrates:
// - running executables through the Windows shell;
// - opening URLs and folders;
// - using shell verbs;
// - checking RunResult;
// - waiting for process exit code;
// - using argument arrays;
// - using a working directory;
// - launching real-world tools such as FFmpeg.
//
// Important:
// utils.Run uses ShellExecuteEx.
// It does not capture stdout or stderr.
// If you need stdout/stderr, timeout, or async completion callback,
// use utils.RunCmdAsync instead.
//
// Also important:
// RunResult.OK means that ShellExecuteEx accepted the request.
// It does not necessarily mean that the launched process completed successfully.
// If wait=true, check ExitCode separately.

"use strict";

function combinePath(base, name) {
    if (base.length > 0 && base.charAt(base.length - 1) !== "\\" && base.charAt(base.length - 1) !== "/") {
        return base + "\\" + name;
    }

    return base + name;
}

function logRunResult(name, result) {
    console.log("[utils.Run] " + name);
    console.log("  OK: " + result.OK);
    console.log("  ExitCode: " + result.ExitCode);
    console.log("  Win32Error: " + result.Win32Error);
    console.log("  ShellCode: " + result.ShellCode);

    if (result.OK) {
        console.log("  result: OK");
    } else if (result.Win32Error !== 0) {
        console.log("  result: shell request failed");
    } else if (result.ExitCode !== 0) {
        console.log("  result: process returned a non-zero exit code");
    } else {
        console.log("  result: failed");
    }
}

function runShell(name, target, args, options) {
    options = options || {};

    const workingDir = options.workingDir || "";
    const verb = options.verb || "";
    const show = options.show !== undefined ? options.show : ShowWindow.Hide;
    const wait = options.wait === true;

    const result = utils.Run(
        target,
        args,
        workingDir,
        verb,
        show,
        wait
    );

    logRunResult(name, result);

    return result;
}

// Example 1.
// Open a URL with the default browser.
//
// wait=false means OK only tells whether the shell accepted the request.
// It does not tell whether the browser loaded the page successfully.

runShell(
    "Open URL",
    "https://www.foobar2000.org",
    undefined,
    {
        show: ShowWindow.Show
    }
);

// Example 2.
// Open the foobar2000 profile folder with the default shell action.

runShell(
    "Open profile folder",
    fb.ProfilePath,
    undefined,
    {
        verb: "open",
        show: ShowWindow.Show
    }
);

// Example 3.
// Run a command and wait for its process exit code.
//
// OK=true means ShellExecuteEx started the process.
// ExitCode contains the process exit code because wait=true was used.

runShell(
    "cmd.exe exit 0",
    "cmd.exe",
    '/c "exit /b 0"',
    {
        wait: true
    }
);

// Example 4.
// A non-zero process exit code does not make OK false.
//
// This should produce:
//   OK=true
//   ExitCode=7

runShell(
    "cmd.exe exit 7",
    "cmd.exe",
    '/c "exit /b 7"',
    {
        wait: true
    }
);

// Example 5.
// Working directory.
//
// utils.Run does not capture stdout, so this example writes the result of "cd"
// into a file inside fb.ProfilePath.

runShell(
    "Write current directory to profile file",
    "cmd.exe",
    '/c "cd > run_current_directory.txt"',
    {
        workingDir: fb.ProfilePath,
        wait: true
    }
);

// Example 6.
// Argument array.
//
// When an array is passed, each argument is quoted automatically when needed.
// This is best for normal executables with separate arguments.
//
// For complex cmd.exe commands with redirection, pipes, &, &&, etc.,
// a raw string is usually more natural.

runShell(
    "ping localhost once",
    "ping.exe",
    ["127.0.0.1", "-n", "1"],
    {
        wait: true
    }
);

// Example 7.
// Invalid target.
//
// utils.Run reports this through RunResult instead of throwing.
// Expected:
//   OK=false
//   Win32Error=87
//
// 87 is ERROR_INVALID_PARAMETER.

runShell(
    "Empty target",
    "",
    undefined,
    {
        wait: true
    }
);

// Example 8.
// FFmpeg through utils.Run.
//
// This example uses fb.ProfilePath instead of hard-coded absolute paths.
// Put a test file named "run_cmd_input.flac" into the foobar2000 profile
// folder before running this example.
//
// Use a full executable path if ffmpeg.exe is not available through PATH.
//
// Note:
// FFmpeg usually writes progress and diagnostic messages to stderr.
// utils.Run does not capture stdout/stderr. Use utils.RunCmdAsync if you need
// FFmpeg logs, timeout handling, or async completion notification.

const ffmpegExe = "ffmpeg.exe";
const sourceAudio = combinePath(fb.ProfilePath, "run_cmd_input.flac");
const mp3Output = combinePath(fb.ProfilePath, "run_output.mp3");

runShell(
    "FFmpeg transcode FLAC to MP3",
    ffmpegExe,
    [
        "-hide_banner",
        "-y",
        "-i", sourceAudio,
        "-vn",
        "-codec:a", "libmp3lame",
        "-q:a", "2",
        mp3Output
    ],
    {
        wait: true
    }
);

// Example 9.
// Elevation through the "runas" verb.
//
// This is intentionally not executed automatically because it shows a UAC prompt.
// Uncomment if you want to test it.

/*
runShell(
    "Run Notepad elevated",
    "notepad.exe",
    undefined,
    {
        verb: "runas",
        show: ShowWindow.Show,
        wait: false
    }
);
*/
