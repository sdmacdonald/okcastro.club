import {
  Icon,
  Link,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FaImage } from "react-icons/fa";

export const TargetTable = (props) => {
  const { id, targetList, title, filter, description } = props;

  return (
    <>
      {/* <Heading>{title}</Heading> */}
      {description}
      <TableContainer id={id}>
        <Table>
          <TableCaption />
          <Thead>
            <Tr>
              <Th>Name</Th>

              <Th>Type</Th>
              <Th>RA</Th>
              <Th>Dec</Th>
              <Th>Magnitude</Th>
              {title === "Messier Observing Program" && <Th>Binocular</Th>}

              {title !== "Double Star Observing Program" && <Th>Image</Th>}
              {title === "Double Star Observing Program" && (
                <>
                  <Th>Mag 2</Th>
                  <Th>Separation</Th>
                </>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {targetList
              .filter((target) => target.user_Month === filter)
              .map((target, index) => (
                <Tr key={index}>
                  <Td>{target.id}</Td>

                  <Td>{target.objecttype}</Td>
                  <Td>{target.ra}</Td>
                  <Td>{target.dec}</Td>
                  <Td>{target.magnitude}</Td>
                  {title === "Messier Observing Program" && (
                    <Td>{target.user_Binocular}</Td>
                  )}
                  {title !== "Double Star Observing Program" && (
                    <Td>
                      {target.user_ImageURL && (
                        <Link href={target.user_ImageURL} target="_blank">
                          <Icon as={FaImage} h={4} w={4} />
                        </Link>
                      )}
                    </Td>
                  )}
                  {title === "Double Star Observing Program" && (
                    <>
                      <Td>{target.magnitude2}</Td>
                      <Td>{target.separation}</Td>
                    </>
                  )}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
