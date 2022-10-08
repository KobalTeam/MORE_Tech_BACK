export class DatabaseConfigService {
  public async getMongoConfig() {
    return {
      uri: "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASSWORD + "@" + process.env.MONGO_HOST
        + "/?"
        + this.getConnectionOptionFromEnv("REPLICASET")
        + this.getConnectionOptionFromEnv("AUTHMECHANISM")
        + this.getConnectionOptionFromEnv("AUTHSOURCE")
        + this.getConnectionOptionFromEnv("DIRECTCONNECTION"),
      useNewUrlParser: true,
      useUnifiedTopology: true,

    };
  }

  private getConnectionOptionFromEnv(option: string) {
    if (process.env[option])
      return `${option}=${process.env[option]}&`;
    return "";
  }
}
