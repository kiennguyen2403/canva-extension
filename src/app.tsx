import { Button, Rows, Text } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import * as React from "react";
import styles from "styles/components.css";
import { useSelection } from "utils/use_selection_hook";
import { initAppElement } from "@canva/design";
import { AppLayout } from "./ui-components/AppLayout";
import { AppScreen } from "./ui-components/AppScreen";

export const App = () => {
  return (
    <AppLayout>
      <AppScreen />
    </AppLayout>
  );
};

/**
 * This part is for testing purposes
 * TODO: Delete this and TestApp comments in index when app is released
 *
 */
type AppElementData = {
  color1: string;
  color2: string;
};

const appElementClient = initAppElement<AppElementData>({
  render: (data) => {
    const dataUrl = createGradient(data.color1, data.color2);
    return [
      {
        type: "IMAGE",
        dataUrl,
        width: 640,
        height: 360,
        top: 0,
        left: 0,
      },
    ];
  },
});

export const TestApp = () => {
  const tasks = useQuery(api.tasks.get);
  const onAddText = async () => {
    try {
      await addNativeElement({
        type: "TEXT",
        children: ["Hello world!"],
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Reading and replacing elements
  const currentSelection = useSelection("plaintext");
  console.log(currentSelection);
  const isElementSelected = currentSelection.count > 0;
  const readCurrrentSelectionContent = async () => {
    const draft = await currentSelection.read();
    console.log(draft);
    for (const content of draft.contents) {
      console.log(content.text);
      content.text = `${content.text} was modified!`;
    }
    await draft.save();
  };

  // Create element in general
  const [state, setState] = React.useState({
    color1: "",
    color2: "",
    isSelected: false,
  });

  React.useEffect(() => {
    appElementClient.registerOnElementChange((element) => {
      if (element) {
        setState({
          color1: element.data.color1,
          color2: element.data.color2,
          isSelected: true,
        });
      } else {
        setState({
          color1: "",
          color2: "",
          isSelected: false,
        });
      }
    });
  }, []);

  function handleClick() {
    appElementClient.addOrUpdateElement({
      color1: state.color1,
      color2: state.color2,
    });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setState((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        {tasks?.map(({ _id, text }) => (
          <Text key={_id}>{text}</Text>
        ))}
        <Button variant="primary" onClick={onAddText} stretch>
          Create 'Hello World' text
        </Button>
        <Button
          variant="primary"
          disabled={!isElementSelected}
          onClick={readCurrrentSelectionContent}
        >
          Replace word
        </Button>
      </Rows>
      {/* Test create elements */}
      <div>
        <input
          type="text"
          name="color1"
          value={state.color1}
          placeholder="Color #1"
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="text"
          name="color2"
          value={state.color2}
          placeholder="Color #2"
          onChange={handleChange}
        />
      </div>
      <button type="submit" onClick={handleClick}>
        {state.isSelected ? "Update" : "Add"}
      </button>
    </div>
  );
};

function createGradient(color1: string, color2: string): string {
  const canvas = document.createElement("canvas");

  canvas.width = 640;
  canvas.height = 360;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Can't get CanvasRenderingContext2D");
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL();
}
