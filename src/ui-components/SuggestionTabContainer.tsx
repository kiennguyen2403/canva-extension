import React, { ReactElement } from "react";
import { Tabs, Tab, TabList, TabPanel, TabPanels, Rows } from "@canva/app-ui-kit";
import styles from "../../styles/components.css";

export const SuggestionTabContainer = ({ children }: { children?: ReactElement }) => {
  return (
    <div className={styles.scrollContainer}>
      <Tabs height="fill">
        <Rows spacing="2u">
          <TabList>
            <Tab id="all">All</Tab>
            <Tab id="text">Wording</Tab>
            <Tab id="media">Media</Tab>
            <Tab id="color">Color</Tab>
          </TabList>
          <TabPanels>
            <TabPanel id="all"></TabPanel>
            <TabPanel id="text">{children}</TabPanel>
            <TabPanel id="media"></TabPanel>
            <TabPanel id="color"></TabPanel>
          </TabPanels>
        </Rows>
      </Tabs>
    </div>
  );
};
