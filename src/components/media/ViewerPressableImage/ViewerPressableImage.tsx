import {
  Image,
  Pressable,
  type ImageProps,
  type ImageSourcePropType,
} from "react-native";
import { useImageViewerOptional } from "../../../contexts/ImageViewerContext";

type Props = Omit<ImageProps, "source"> & {
  source: ImageSourcePropType;
  urls?: string | string[];
  imageIndex?: number;
};

function resolveUri(source: ImageSourcePropType): string | undefined {
  if (typeof source === "object" && source !== null && "uri" in source) {
    const uri = source.uri;
    return typeof uri === "string" && uri.trim() ? uri.trim() : undefined;
  }
  return undefined;
}

const ViewerPressableImage = ({
  urls,
  imageIndex = 0,
  source,
  ...imageProps
}: Props) => {
  const viewer = useImageViewerOptional();
  const sourceUri = resolveUri(source);
  const viewerUrls =
    urls != null
      ? Array.isArray(urls)
        ? urls
        : [urls]
      : sourceUri
        ? [sourceUri]
        : [];

  if (!viewer || viewerUrls.length === 0) {
    return <Image source={source} {...imageProps} />;
  }

  return (
    <Pressable
      onPress={() => viewer.openImageViewer(viewerUrls, imageIndex)}
      accessibilityRole="imagebutton"
    >
      <Image source={source} {...imageProps} />
    </Pressable>
  );
};

export default ViewerPressableImage;
