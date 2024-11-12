interface IConfig {
  agileMoodToken: string;
}

export const config: IConfig = {
  agileMoodToken: process.env.AGILE_MOOD_TOKEN ?? '',
};
