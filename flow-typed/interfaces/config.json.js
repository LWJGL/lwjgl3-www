declare module '../config.json' {
  declare var port: number;

  declare var analytics_tracking_id: string;

  declare var aws: {
    accessKeyId: string,
    secretAccessKey: string,
    region: string,
  };
}
