export interface Component {
  name: string;
  props: { [key: string]: any };
}

export interface Palette {
  colors: string[];
}

export interface Design {
  name: string;
  components: Component[];
}

export interface Suggestion {
  title: string;
  type: string;
  content: string;
  extra?: any;
}

export interface Image {
  url: string;
  width: number;
  height: number;
}
