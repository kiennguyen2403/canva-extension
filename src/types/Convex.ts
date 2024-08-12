export enum DesignInputName {
  Text = "Text",
  TextFont = "TextFont",
}

export interface DesignInput {
  naming: string;
  components: {
    name: DesignInputName;
    props: { key: string; value: any }[];
  }[];
}
