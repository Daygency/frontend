declare module "upng-js" {
  type UpngImage = {
    width: number;
    height: number;
    data: ArrayBuffer;
    tabs: Record<string, unknown>;
  };

  const UPNG: {
    decode: (buffer: ArrayBuffer) => UpngImage;
    toRGBA8: (image: UpngImage) => ArrayBuffer[];
  };

  export default UPNG;
}
