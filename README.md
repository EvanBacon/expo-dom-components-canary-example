# Experimental DOM Components with Expo Canary

This project demonstrates how to use experimental [DOM components](https://docs.expo.dev/guides/dom-components/) with Expo canary.

Your best bet is to use dev clients (`npx expo run`), but you can also try running this in Expo Go but YMMV until Expo SDK 52 is released.

When running this project using prebuild on iOS, run 'yarn ios' since the UNVERSIONED must be deleted.

## Features

This demo showcases various web technologies and libraries integrated with Expo:

- Dashboard UI from [shadcn UI](https://ui.shadcn.com/blocks)
- Markdown content rendering using [`@bacons/mdx`](https://github.com/EvanBacon/expo-mdx)
- Video composition with [Remotion](https://www.remotion.dev/)
- Emoji picker from [emoji-mart](https://github.com/missive/emoji-mart)
- Syntax highlighting with [Prism React Renderer](https://github.com/FormidableLabs/prism-react-renderer)
- Interactive diagrams with [React Flow](https://reactflow.dev/)
- Mobile image cropping using [react-mobile-cropper](https://github.com/ricardo-ch/react-mobile-cropper)
- 3D rendering with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- Rich text editing with [Tiptap](https://tiptap.dev/)

## Additional Components

- React Three Fiber [demo](https://codesandbox.io/p/sandbox/re-using-gltfs-dix1y?file=%2Fpackage.json%3A10%2C3-10%2C23) from @drcmda

## Getting Started

1. Clone the repository
2. Install dependencies: `yarn install`
3. Start the development server: `npx expo start`

For the best experience, use dev clients (`npx expo run:ios` or `npx expo run:android`).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).