export interface Manifest {
  liblabVersion: string;
  date: Date;
  files: string[];
  config: { sdkVersion: string };
}
