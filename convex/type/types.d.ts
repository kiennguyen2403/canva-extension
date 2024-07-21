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

export interface Prediction {
  confidence: number;
  class_id: number;
}

export interface ImageModelResponse {
  time: number;
  image: {
    width: number;
    height: number;
  };
  predictions: Prediction[];
  predicted_classes: string[];
}
