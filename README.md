# Experimental DOM Components with Expo Canary

This project demonstrates how to use experimental [DOM components](https://docs.expo.dev/guides/dom-components/) with Expo canary.

Your best bet is to use dev clients (`npx expo run`), but you can also try running this in Expo Go but YMMV until Expo SDK 52 is released.

When running this project using prebuild on IOS run 'yarn ios' since the UNVERSIONED must be deleted

This demo has a template UI from:

- [shadcn UI](https://ui.shadcn.com/blocks).
- MDX content from [`@bacons/mdx`](https://github.com/EvanBacon/expo-mdx).
- React Three Fiber [demo](https://codesandbox.io/p/sandbox/re-using-gltfs-dix1y?file=%2Fpackage.json%3A10%2C3-10%2C23) from @drcmda.
- An image cropper from `react-mobile-cropper`.
- Emoji picker from `emoji-mart`.
- Remotion Player from `remotion`.