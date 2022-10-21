/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  TFooter,
} from "@strapi/design-system/Table";
import { Link } from "@strapi/design-system/Link";
import { Flex } from "@strapi/design-system/Flex";
import { Typography } from "@strapi/design-system/Typography";
import { BaseCheckbox } from "@strapi/design-system/BaseCheckbox";
import { VisuallyHidden } from "@strapi/design-system/VisuallyHidden";
import { IconButton } from "@strapi/design-system/IconButton";
import Plus from "@strapi/icons/Plus";
import Pencil from "@strapi/icons/Pencil";
import Trash from "@strapi/icons/Trash";
import { Box } from "@strapi/design-system/Box";
import pluginId from "../../pluginId";


type MiddlewaresListProps = {
  middlewares: { key: string; uid: string }[];
};

const MiddlewaresList: React.VoidFunctionComponent<MiddlewaresListProps> = (
  props: MiddlewaresListProps
) => {
  return (
    <>
      <Box padding={3} paddingLeft={0}>
        <Typography variant="beta">Middlewares list</Typography>
      </Box>
      <Table
        colCount={4}
        rowCount={props.middlewares.length}
        footer={
          <TFooter icon={<Plus />}>
            <Link to={`/plugins/${pluginId}/routes/middlewares`}>
              Configure middlewares on routes
            </Link>
          </TFooter>
        }
      >
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">UID</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Name</Typography>
            </Th>
            {/* <Th>
          <VisuallyHidden>Actions</VisuallyHidden>
        </Th> */}
          </Tr>
        </Thead>
        <Tbody>
          {props.middlewares.map((entry, i) => (
            <Tr key={'row-' + i}>
              <Td>
                <Typography textColor="neutral800">{entry.uid}</Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">{entry.key}</Typography>
              </Td>
              {/* <Td>
            <Flex>
              <IconButton
                onClick={() => console.log("edit")}
                label="Edit"
                noBorder
                icon={<Pencil />}
              />
              <Box paddingLeft={1}>
                <IconButton
                  onClick={() => console.log("delete")}
                  label="Delete"
                  noBorder
                  icon={<Trash />}
                />
              </Box>
            </Flex>
          </Td> */}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default MiddlewaresList;
