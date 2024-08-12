import { LoadingIndicator, Rows } from "@canva/app-ui-kit";
import React from "react";
import styles from "../../styles/components.css";

export const LoadingComponent = ({ texts }: { texts: string[] }) => {
  return (
    <Rows spacing="2u">
      <LoadingIndicator size="large" />
      <div className={styles.loadingContainer}>
        {texts.map((text, id) => (
          <p className={styles.loadingText} key={id}>
            {text}...
          </p>
        ))}
      </div>
    </Rows>
  );
};
