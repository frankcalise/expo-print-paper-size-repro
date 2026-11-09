# expo-print preferredPaperSize repro

On iOS, `Print.printAsync` lets UIKit pick the paper. UIKit picks the printer's default paper, usually US Letter, and scales the page to fit it. A 6 x 4 inch card prints scaled up onto Letter, and the user has to pick 4 x 6 under Paper Size by hand on every print.

The proposed change adds an opt-in `preferredPaperSize: { width, height }` option, in points. When the user selects a printer, the print dialog preselects that printer's paper that best fits the size, such as 4 x 6 inches.

Upstream PR: TODO

## Setup

- Expo SDK 58, `expo-print` 58.0.8.
- `patches/expo-print@58.0.8.patch` adds the option. `pnpm-workspace.yaml` applies it through `patchedDependencies`.
- `package.json` sets `expo.autolinking.ios.buildFromSource: ["ExpoPrint"]`. SDK 58 links Expo modules as prebuilt xcframeworks, which would ignore the patched Swift sources.

## Run it

```sh
pnpm install
npx expo run:ios
```

1. Tap a button. The print dialog opens.
2. Under Printer, select a printer that reports 4 x 6 paper. Xcode's Printer Simulator works, and so does a real printer.
3. Read the Paper Size row. Close the dialog without printing.

## What to expect

| Button                              | Paper Size   |
| ----------------------------------- | ------------ |
| Print 4x6 (default)                 | US Letter    |
| Print 4x6 with preferredPaperSize   | 4 x 6 inches |

To see today's behaviour, delete the `expo-print` entry from `pnpm-workspace.yaml`, then run `pnpm install`, `npx expo prebuild --clean` and `npx expo run:ios`. Both buttons then give US Letter. The clean prebuild matters, because `ios/Podfile.lock` still points at the patched package. TypeScript then flags `preferredPaperSize` in `App.tsx`, but Metro still bundles it, and native code ignores it.

## Screenshots

An iPhone 17 Pro simulator on iOS 26.5, with a Canon MX470 selected. The MX470 reports bordered 4 x 6 paper.

| | Print 4x6 (default) | Print 4x6 with preferredPaperSize |
| --- | --- | --- |
| With the patch | ![US Letter](docs/patched-default.png) | ![4 x 6 inches](docs/patched-preferred.png) |
| Without the patch | ![US Letter](docs/unpatched-default.png) | ![US Letter](docs/unpatched-preferred.png) |
