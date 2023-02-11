import React, { useState } from "react";
import { Box, Heading, Select } from "@chakra-ui/react";
import { tables, text, monthOptions, getMonth } from "../assets/data";
import { TextBlock } from "../components";
import { Page, Segment, TargetTable } from "../templates";

export const Observing = (props) => {
  const [month, setMonth] = useState(getMonth());

  const handleMonth = (e) => {
    setMonth({
      value: parseInt(e.target.value),
      month: e.target.childNodes[e.target.value].id,
    });
  };

  return (
    <Page>
      <Segment
        heading={`Night Sky Observing: ${month.month}`}
        as="h1"
        color="white"
      >
        <Heading as="h2" fontSize="md" fontWeight="bold">
          by Rod Gallagher, Master Observer
        </Heading>
        {text.map((block, index) => (
          <TextBlock key={index} textAlign="left">
            {block}
          </TextBlock>
        ))}
        <Select placeholder="Change Month" size="sm" onChange={handleMonth}>
          {monthOptions.map((m, index) => (
            <option key={index} value={m.value} id={m.month}>
              {m.month}
            </option>
          ))}
        </Select>
      </Segment>

      {tables.map((table, index) => (
        <Segment
          key={index}
          heading={table.title}
          rest={{
            bgColor: "white",
            borderRadius: { base: "none", md: "md" },
            shadow: "md",
          }}
          mx={3}
          as="h2"
        >
          {table.description.map((text, index) => (
            <TextBlock key={index} textAlign="left">
              {text}
            </TextBlock>
          ))}
          <Box
            border="1px"
            borderColor="gray.300"
            borderRadius="md"
            shadow="sm"
            fontSize="sm"
            maxW={{ base: "300px", md: "725px", lg: "initial" }}
          >
            <TargetTable
              title={table.title}
              key={table.id}
              filter={month.value}
              id={table.id}
              targetList={table.targets}
            />
          </Box>
        </Segment>
      ))}
    </Page>
  );
};
