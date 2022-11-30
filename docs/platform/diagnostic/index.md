---
sidebar_position: 1
title: Platform Diagnostic
description: how to extract log for conduktor support
---

# Platform diagnostic

:::info
Platform diagnostic is a tool that allow you to extract all the relevant log from conduktor platform in order to give all the necessary information to our support team to investigate your issue
:::

## Installation

note available only for Linux, Mac and WSL2 for now.
if you need an other support, make us a request

[download ARM version](https://releases.conduktor.io/platform-diagnostic-arm_0-1-0)
[download x86 version](https://releases.conduktor.io/platform-diagnostic-amd_0-1-0)

## Usage

First, allow to execute the tool you just downloaded
```sh
chmod +x platform-diagnostic-amd_0-1-0
```
 

Then execute this tool on the same machine where the conduktor platform run.
```sh
./platform-diagnostic-amd_0-1-0
```


Expected output
```
Welcome to Conduktor Platform Diagnostic⚕️ !
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠟⢻⡇⠀⠀⠀⠀⣠⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡿⠋⠀⢸⣧⣤⣀⡀⠺⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡿⠀⠀⠀⢸⣿⣿⣿⣿⣆⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠇⠀⠀⢀⣼⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⡿⠀⠀⠴⠿⣿⣿⣦⣄⣠⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⡇⠀⠀⠀⠀⠀⠈⠉⠉⠛⠛⠿⢿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⢿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣷⣤⣀⠀⠀⠀⠀⠐⣿⣿⣷⣦⣤⣀⣤⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠚⠛⠛⠛⠛⠛⠛⠂⠀⠀⠀⠘⢿⣿⣿⠋⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣻⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢦⣤⣀⡀⠀⠀⢀⣤⣾⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣾⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

All rights reserved to Conduktor Inc. https://www.conduktor.io
ToS : https://www.conduktor.io/terms-of-service
Privacy Policy : https://www.conduktor.io/privacy-policy

[18:38:19] 🤖 Diagnostic starting...
[18:38:19] ✅ Success - Init diagnostic
[18:38:19] ✅ Success - Export host system informations
[18:38:19] ✅ Success - Export docker version
[18:38:19] ❌ Fail    - Export platfom health status
[18:38:19] ❌ Fail    - Export user licence
[18:38:19] ❌ Fail    - Export platform versions
[18:38:19] ❌ Fail    - Export environment variables
[18:38:19] ✅ Success - Export services information
[18:38:20] ✅ Success - Export logs
[18:38:20] ✅ Success - Export platform global configuration
[18:38:20] ❌ Fail    - Sanitize configuration

[18:38:20] 🚀 Success! A tarball with all the diagnostic files has been created at: /home/you/filename
[18:38:20] 📌 Send this archive to 👉 support@conduktor.io 👈 with a description of your issue 👆
```

finally get the archive created and send it to `support@conduktor.io` with a description of the issue you are facing