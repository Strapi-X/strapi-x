/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useState, useEffect } from "react";
import { BaseHeaderLayout } from "@strapi/design-system/Layout";
import { Box } from "@strapi/design-system/Box";
import { Link } from "@strapi/design-system/Link";
import ArrowLeft from "@strapi/icons/ArrowLeft";
import axios from "../../utils/axiosInstance";
import { useParams } from "react-router-dom";
import { GridLayout } from "@strapi/design-system/Layout";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  TFooter,
} from "@strapi/design-system/Table";
import { Flex } from "@strapi/design-system/Flex";
import { Typography } from "@strapi/design-system/Typography";
import { BaseCheckbox } from "@strapi/design-system/BaseCheckbox";
import { VisuallyHidden } from "@strapi/design-system/VisuallyHidden";
import { IconButton } from "@strapi/design-system/IconButton";
import Plus from "@strapi/icons/Plus";
import Pencil from "@strapi/icons/Pencil";
import Trash from "@strapi/icons/Trash";
import ExclamationMarkCircle from "@strapi/icons/ExclamationMarkCircle";
import { MiddlewareConfiguration } from "../../models/middleware-configuration.model";
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@strapi/design-system/ModalLayout";
import MiddlewareConfigurationForm from "../../components/MiddlewareConfiguration";
import { Middlewares } from "../../models/middlewares.enum";
import { Dialog, DialogBody, DialogFooter } from "@strapi/design-system/Dialog";
import { Button } from "@strapi/design-system/Button";
import { Stack } from "@strapi/design-system/Stack";

type ConfigureMiddlewareOnRoutePageProps = {
  route: any;
  location: any;
};

const defaultConfiguration: (
  route: string,
  method: string
) => MiddlewareConfiguration = (route: string, method: string) => ({
  config: {},
  enabled: true,
  type: Middlewares.Generic,
  uid: "",
  route,
  method,
});

const ConfigureMiddlewareOnRoutePage: React.VoidFunctionComponent<
  ConfigureMiddlewareOnRoutePageProps
> = ({}: ConfigureMiddlewareOnRoutePageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [schema, setSchema] = useState<any>({});
  const [route, setRoute] = useState<any>({});
  const [middlewares, setMiddlewares] = useState<MiddlewareConfiguration[]>([]);
  const [currentConfiguration, setCurrentConfiguration] =
    useState<MiddlewareConfiguration>(
      defaultConfiguration(route?.path, route.method)
    );
  const [toDeleteConfiguration, setToDeleteConfiguration] = useState<
    MiddlewareConfiguration | undefined
  >(undefined);
  const { routeId } = useParams();

  useEffect(() => {
    axios.get("/strapi-x/routes").then((res) => {
      const routes = res.data;
      const routeID = decodeURIComponent(routeId);
      const parsedRouteId = routeID.split(":::");
      if (routes[parsedRouteId[0]]) {
        const currentRoute = routes[parsedRouteId[0]].routes.find(
          (r1) => r1.method == parsedRouteId[1] && r1.path == parsedRouteId[2]
        );
        setRoute(currentRoute);
        setSchema(routes[parsedRouteId[0]].contentType);
        setCurrentConfiguration(
          defaultConfiguration(route?.path, route.method)
        );
        axios
          .get("/strapi-x/routes-middlewares", { params: { route: routeID } })
          .then((res) => setMiddlewares(res.data));
      }
    });
  }, []);

  const saveConfiguration = async (configuration: MiddlewareConfiguration) => {
    if (!configuration.uid) {
      configuration.uid = `m-${Date.now()}`;
      await axios.post("/strapi-x/regen", [
        {
          route: decodeURIComponent(routeId),
          middleware: configuration,
        },
      ]);
      setMiddlewares([...middlewares, configuration]);
      setCurrentConfiguration(defaultConfiguration(route?.path, route.method));
      setIsVisible(false);
      return;
    }
    await axios.post("/strapi-x/regen", [
      {
        route: decodeURIComponent(routeId),
        middleware: configuration,
      },
    ]);
    setMiddlewares([
      ...middlewares.filter((m) => m.uid != configuration.uid),
      configuration,
    ]);
    setCurrentConfiguration(defaultConfiguration(route?.path, route.method));
    setIsVisible(false);
  };

  const openDeleteDialog = (configuration: MiddlewareConfiguration) => {
    setIsDeleteDialogOpen(true);
    setToDeleteConfiguration(configuration);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setToDeleteConfiguration(undefined);
  };

  const addMiddleware = () => {
    setCurrentConfiguration(defaultConfiguration(route?.path, route.method));
    setIsVisible(true);
  };

  const deleteConfiguration = async () => {
    if (toDeleteConfiguration?.uid) {
      await axios.post("/strapi-x/middlewares/delete", [toDeleteConfiguration]);
      setMiddlewares(
        middlewares.filter((m) => m.uid != toDeleteConfiguration.uid)
      );
      setToDeleteConfiguration(undefined);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Box background="neutral100">
        <BaseHeaderLayout
          title="Configure middlewares on route"
          subtitle={route?.method?.toUpperCase() + " - " + route?.path}
          as="h2"
          navigationAction={
            <Link
              startIcon={<ArrowLeft />}
              to="/plugins/strapi-x/routes/middlewares"
            >
              Go back
            </Link>
          }
        />
        <Box padding={10} paddingTop={0}>
          <GridLayout>
            <Box
              padding={6}
              hasRadius
              background="neutral0"
              key={`box-middlewares`}
              shadow="tableShadow"
            >
              <Box padding={3} paddingLeft={0}>
                <Typography variant="beta">Middlewares list</Typography>
              </Box>
              <Table
                colCount={4}
                rowCount={middlewares.length}
                footer={
                  <TFooter icon={<Plus />}>
                    <Link onClick={addMiddleware}>Add a middleware</Link>
                  </TFooter>
                }
              >
                <Thead>
                  <Tr>
                    <Th>
                      <Typography variant="sigma">UID</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">Type</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">Activated</Typography>
                    </Th>
                    <Th>
                      <VisuallyHidden>Actions</VisuallyHidden>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {middlewares.map((entry, i) => (
                    <Tr key={"row-" + i}>
                      <Td>
                        <Typography textColor="neutral800">
                          {entry.uid}
                        </Typography>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">
                          {entry.type}
                        </Typography>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">
                          {entry.enabled ? "YES" : "NO"}
                        </Typography>
                      </Td>
                      <Td>
                        <Flex>
                          <IconButton
                            onClick={() => {
                              setCurrentConfiguration(entry);
                              setIsVisible(true);
                            }}
                            label="Edit"
                            noBorder
                            icon={<Pencil />}
                          />
                          <Box paddingLeft={1}>
                            <IconButton
                              onClick={() => {
                                openDeleteDialog(entry);
                                // deleteConfiguration(entry);
                              }}
                              label="Delete"
                              noBorder
                              icon={<Trash />}
                            />
                          </Box>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </GridLayout>
        </Box>
      </Box>

      {isDeleteDialogOpen && (
        <Dialog
          onClose={() => closeDeleteDialog()}
          title="Confirmation"
          isOpen={isDeleteDialogOpen}
        >
          <DialogBody icon={<ExclamationMarkCircle />}>
            <Stack spacing={2}>
              <Flex justifyContent="center">
                <Typography id="confirm-description">
                  Are you sure you want to delete this middleware?
                </Typography>
              </Flex>
            </Stack>
          </DialogBody>
          <DialogFooter
            startAction={
              <Button onClick={() => closeDeleteDialog()} variant="tertiary">
                Cancel
              </Button>
            }
            endAction={
              <Button
                variant="danger-light"
                startIcon={<Trash />}
                onClick={deleteConfiguration}
              >
                Confirm
              </Button>
            }
          />
        </Dialog>
      )}

      {isVisible && (
        <ModalLayout
          onClose={() => setIsVisible((prev) => !prev)}
          labelledBy="Middleware configuration"
        >
          <ModalHeader>
            <Typography
              fontWeight="bold"
              textColor="neutral800"
              as="h2"
              id="title"
            >
              Title
            </Typography>
          </ModalHeader>
          <ModalBody>
            <MiddlewareConfigurationForm
              configuration={currentConfiguration}
              onsave={saveConfiguration}
            />
          </ModalBody>
        </ModalLayout>
      )}
    </>
  );
};

export default ConfigureMiddlewareOnRoutePage;
