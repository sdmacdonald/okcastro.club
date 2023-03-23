import React, { useState } from "react";
import { Box, Heading, HStack, Link, Select } from "@chakra-ui/react";
import { tables, text, monthOptions, getMonth } from "../assets/data";
import { TextBlock } from "../components";
import { Page, Segment, TargetTable } from "../templates";

export const Observing = (props) => {
  const [month, setMonth] = useState(getMonth());
  const [section, setSection] = useState("#");

  const handleMonth = (e) => {
    setMonth({
      value: parseInt(e.target.value),
      month: e.target.childNodes[e.target.value].id,
    });
  };

  const handleSection = (e) => {
    setSection(`#${e.target.value}`);
  };

  return (
    <Page bg="linear-gradient(rgba(30, 30, 30, 0.8),rgba(30, 30, 30, 0.2)) , url('./M33-rod-gallagher.jpg')">
      <Segment
        heading={`Night Sky Observing: ${month.month}`}
        as="h1"
        color="white"
      >
        <Heading as="h2" fontSize="md" fontWeight="bold">
          by Rod Gallagher, Master Observer
        </Heading>

        <HStack justify="center" m={6}>
          <Link href={section}>
            <Select
              placeholder="Jump to a list"
              onChange={handleSection}
              maxW="sm"
              variant="filled"
              bgColor="blue.800"
              fontWeight="bold"
              _hover={{ bgColor: "blue.600", color: "white" }}
            >
              {tables.map((table, index) => (
                <option key={index} value={table.id}>
                  {table.title}
                </option>
              ))}
            </Select>
          </Link>
          <Select
            placeholder="Change Month"
            onChange={handleMonth}
            maxW="sm"
            variant="filled"
            bgColor="gray.900"
            color="white"
            fontWeight="bold"
            _hover={{ bgColor: "gray.900", color: "white" }}
          >
            {monthOptions.map((m, index) => (
              <option
                key={index}
                value={m.value}
                id={m.month}
                style={{ backgroundColor: "black", color: "white" }}
              >
                {m.month}
              </option>
            ))}
          </Select>
        </HStack>

        {text.map((block, index) => (
          <TextBlock key={index} textAlign="left">
            {block}
          </TextBlock>
        ))}
      </Segment>

      {tables.map((table, index) => (
        <Segment
          key={index}
          heading={table.title}
          rest={{
            bgColor: "white",
          }}
          mx={3}
          as="h2"
          id={table.id}
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
              targetList={table.targets}
            />
          </Box>
        </Segment>
      ))}
    </Page>
  );
};
