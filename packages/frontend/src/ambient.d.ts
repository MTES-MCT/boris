// Squelch warnings of image imports from your assets dir
declare module '$assets/*' {
  const meta;
  export default meta;
}
