"use strict";

include(`${fb.ComponentPath}\\docs\\Flags.js`);

// RunCmdAsync sample for JSplitter
//
// Demonstrates:
// - starting external commands asynchronously;
// - matching callbacks by task_id;
// - handling stdout/stderr;
// - handling non-zero exit codes;
// - handling timeouts;
// - using argument arrays for safe quoting;
// - using a working directory;
// - using real-world tools such as FFmpeg and Essentia.
//
// Important:
// Completion callbacks are asynchronous and may arrive in a different order
// than the RunCmdAsync calls were made. Always use task_id to match results.

const TIMEOUT_EXIT_CODE = 0xFFFFFFFF;

const pendingCommands = new Map();

function runCommand(name, app, args, options) {
    options = options || {};

    const workingDir = options.workingDir || "";
    const show = options.show !== undefined ? options.show : ShowWindow.Hide;
    const timeoutMs = options.timeoutMs || 0;

    let taskId;

    try {
        taskId = utils.RunCmdAsync(app, args, workingDir, show, timeoutMs);
    } catch (e) {
        // Synchronous exceptions are reserved for API usage errors,
        // for example invalid args or calling too early during initialization.
        console.log("[RunCmdAsync] Failed to start '" + name + "': " + e);
        return 0;
    }

    pendingCommands.set(taskId, {
        name: name,
        startedAt: Date.now()
    });

    console.log("[RunCmdAsync] Started #" + taskId + ": " + name);

    return taskId;
}

function on_run_cmd_async_done(task_id, success, exit_code, stdout, stderr) {
    const command = pendingCommands.get(task_id);

    if (!command) {
        // This can happen if another script part also uses RunCmdAsync,
        // or if the task_id was not registered by this sample.
        console.log("[RunCmdAsync] Completed unknown task #" + task_id);
        return;
    }

    pendingCommands.delete(task_id);

    const elapsedMs = Date.now() - command.startedAt;

    console.log("[RunCmdAsync] Completed #" + task_id + ": " + command.name);
    console.log("  elapsed: " + elapsedMs + " ms");
    console.log("  success: " + success);
    console.log("  exit_code: " + exit_code);

    if (stdout.length > 0) {
        console.log("  stdout:");
        console.log(stdout.trim());
    }

    if (stderr.length > 0) {
        // Some tools, including FFmpeg, write normal progress/log output
        // to stderr even when they complete successfully.
        // Non-empty stderr does not necessarily mean failure.
        console.log("  stderr:");
        console.log(stderr.trim());
    }

    if (exit_code === TIMEOUT_EXIT_CODE) {
        // On timeout, RunCmdAsync terminates the whole process tree.
        console.log("  result: timed out");
    } else if (!success) {
        // success=false also covers normal non-zero process exit codes.
        // For example, "exit /b 7" produces success=false, exit_code=7.
        console.log("  result: process failed, timed out, or returned a non-zero exit code");
    }	 else {
        console.log("  result: OK");
    }
}

// Example 1.
// Prefer an argument array when possible.
// Each argument is quoted automatically when needed.
runCommand(
    "Echo text",
    "cmd.exe",
    ["/c", "echo", "hello"]
);

// Example 2.
// stdout and stderr are captured separately.
runCommand(
    "Capture stdout and stderr",
    "cmd.exe",
    '/c "echo stdout text & echo stderr text 1>&2"'
);

// Example 3.
// A non-zero exit code is not a transport/API failure.
// The callback receives success=false and the actual process exit code.
runCommand(
    "Return exit code 7",
    "cmd.exe",
    '/c "exit /b 7"'
);

// Example 4.
// The working directory is passed to CreateProcess.
// This command should print C:\Windows.
runCommand(
    "Run in C:\\Windows",
    "cmd.exe",
    '/c "cd"',
    {
        workingDir: "C:\\Windows"
    }
);

// Example 5.
// Timeout is specified in milliseconds.
// A timeout value of 0 means wait indefinitely.
// On timeout, the callback receives:
//   success=false
//   exit_code=0xFFFFFFFF
//   stderr containing a timeout message
runCommand(
    "Timeout after 5 seconds",
    "cmd.exe",
    '/c "ping 127.0.0.1 -n 11 >nul"',
    {
        timeoutMs: 5000
    }
);

// Example 6.
// Empty app is reported asynchronously through the callback,
// not as a synchronous exception.
runCommand(
    "Empty app example",
    "",
    ""
);

// Paths used by the real-world examples below.
//
// The sample uses fb.ProfilePath instead of hard-coded absolute paths,
// so it does not depend on a particular drive or user profile.
//
// Put a test audio file named "run_cmd_input.flac" into the foobar2000
// profile folder before running the FFmpeg/Essentia examples.

function combinePath(base, name) {
    if (base.length > 0 && base.charAt(base.length - 1) !== "\\" && base.charAt(base.length - 1) !== "/") {
        return base + "\\" + name;
    }

    return base + name;
}

const sampleInputAudio = combinePath(fb.ProfilePath, "run_cmd_input.flac");
const sampleMp3Output = combinePath(fb.ProfilePath, "run_cmd_output.mp3");
const sampleCoverOutput = combinePath(fb.ProfilePath, "run_cmd_cover.jpg");
const sampleFeaturesOutput = combinePath(fb.ProfilePath, "run_cmd_features.json");

// Use a full executable path if the tool is not available through PATH.
const ffmpegExe = "ffmpeg.exe";
const essentiaExe = "essentia_streaming_extractor_music.exe";

// Example 7.
// FFmpeg: transcode an audio file.
//
// FFmpeg normally writes progress and diagnostic messages to stderr
// even on success. Check success and exit_code instead of treating
// non-empty stderr as failure.

runCommand(
    "FFmpeg transcode FLAC to MP3",
    ffmpegExe,
    [
        "-hide_banner",
        "-y",
        "-i", sampleInputAudio,
        "-vn",
        "-codec:a", "libmp3lame",
        "-q:a", "2",
        sampleMp3Output
    ]
);

// Example 8.
// FFmpeg: extract embedded cover art from an audio file.
//
// This is a good example of why argument arrays are preferred:
// file paths may contain spaces, and each argument will be quoted automatically.

runCommand(
    "FFmpeg extract embedded cover",
    ffmpegExe,
    [
        "-hide_banner",
        "-y",
        "-i", sampleInputAudio,
        "-an",
        "-vcodec", "copy",
        sampleCoverOutput
    ],
    {
        timeoutMs: 30000
    }
);

// Example 9.
// Essentia: extract audio features.
//
// The executable name/path depends on how Essentia was installed or packaged.
// Common names are "streaming_extractor_music.exe" or
// "essentia_streaming_extractor_music.exe".
//
// Adjust the executable name and arguments to your Essentia build/profile.

runCommand(
    "Essentia extract music features",
    essentiaExe,
    [
        sampleInputAudio,
        sampleFeaturesOutput
    ],
    {
        timeoutMs: 120000
    }
);
