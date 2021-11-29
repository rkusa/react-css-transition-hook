# React CSS Transition Hook

Minimal, zero-dependency React hook to CSS classname based transitions.

[NPM](http://npmjs.com/package/react-css-transition-hook)

```bash
npm install -S react-css-transition-hook
```

```bash
yarn add react-css-transition-hook
```

## Example

[Code](https://github.com/rkusa/react-menu-hook/blob/main/website/components/Menu.tsx) | [Demo](https://react-menu-hook.vercel.app)

```ts
const { isOpen } = useMenu();
const [isVisible, props] = useTransition(isOpen, {
  entering: "transition ease-out duration-100 transform opacity-0 scale-95",
  entered: "transition ease-out duration-100 transform opacity-100 scale-100",
  exiting: "transition ease-in duration-75 transform opacity-100 scale-100",
  exited: "transition ease-in duration-75 transform opacity-0 scale-95",
});

if (!isVisible) {
  return null
}

return (
  <div {...props}>
    ...
  </div>
)
```

## License

[MIT](./LICENSE)
