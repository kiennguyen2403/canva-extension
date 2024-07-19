import { CheckIcon, Pill, Rows, Box, Text, Columns, Avatar, Column } from "@canva/app-ui-kit";
import React, { useEffect, useState } from "react";
import { SuggestionText } from "src/types/Suggestion";

export const SuggestionTabText = ({
  data,
  action,
}: {
  data: SuggestionText[];
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
    (SuggestionText & { selected: boolean })[] | undefined
  >(undefined);

  useEffect(() => {
    setSelectedData(
      data.map((suggestion) => {
        return {
          ...suggestion,
          selected: false,
        };
      })
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
          <Avatar name={data.length.toString()} backgroundColor="#34BA96" />
        </Column>
      </Columns>
      {selectableData &&
        selectableData.map(({ selected, suggestion, suggested, original }, id) => {
          return (
            <Pill
              onClick={() => {
                const newSelectedData = [...selectableData];
                newSelectedData[id].selected = !selected;
                setSelectedData(newSelectedData);
                if (suggested && original) {
                  action({ id, suggested, original });
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
