declare module '../public/js/manifest.json' {
  declare var entry: number;

  declare var routes: {
    [route: string]: Array<number>,
  };

  declare var assets: {
    css: string,
    manifest: string,
    [id: string]: string,
  };
}
