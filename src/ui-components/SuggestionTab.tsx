import { CheckIcon, Pill, Rows, Box, Text, Columns, Avatar, Column } from "@canva/app-ui-kit";
import React, { useEffect, useState } from "react";
import { SuggestionType, type Suggestion } from "src/types/Suggestion";

export const SuggestionTab = ({
  data,
  action,
}: {
  data: Suggestion[];
  action: ({
    id,
    original,
    suggested,
  }: {
    id: number;
    original: string;
    suggested: string;
  }) => Promise<void>;
}) => {
  const [selectableData, setSelectedData] = useState<
    (Suggestion & { id: number; selected: boolean })[]
  >([]);

  useEffect(() => {
    setSelectedData(
      data
        .map((suggestion, id) => {
          return {
            ...suggestion,
            id,
            selected: false,
          };
        })
        .filter(({ type }) => type !== SuggestionType.NoSuggestion)
    );
  }, [data]);

  return (
    <Rows spacing="2u">
      <Columns spacing="1u">
        <Column width="4/5">
          <Box>
            <Text>Suggestions regarding text grammar, fonts and styles</Text>
          </Box>
        </Column>
        <Column>
          <Avatar name={selectableData.length.toString()} backgroundColor="#34BA96" />
        </Column>
      </Columns>
      {selectableData &&
        selectableData.map(({ selected, suggestion, suggested, original, id }, index) => {
          return (
            <Pill
              onClick={() => {
                const newSelectedData = [...selectableData];
                newSelectedData[index].selected = !selected;
                setSelectedData(newSelectedData);
                if (suggested && original) {
                  action({
                    id,
                    suggested: suggested.rawFullText,
                    original: original.rawFullText,
                  });
                }
              }}
              text={suggestion}
              selected={selected}
              end={selected && <CheckIcon />}
              truncateText={false}
            />
          );
        })}
    </Rows>
  );
};
