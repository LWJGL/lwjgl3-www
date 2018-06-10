declare module '../public/js/webpack.manifest.json' {
  declare var entrypoints: {
    main: {
      chunks: Array<number>,
    },
  };

  declare var assets: Array<{
    name: string,
    size: number,
    chunks: Array<number>,
    chunkNames: Array<string>,
    emitted: boolean,
    isOverSizeLimit?: boolean,
  }>;

  declare var namedChunkGroups: {
    [assetName: string]: {
      chunks: Array<number>,
      isOverSizeLimit?: boolean,
    },
  };
}
