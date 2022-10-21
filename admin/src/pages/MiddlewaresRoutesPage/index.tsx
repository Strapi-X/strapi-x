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
import {
  Accordion,
  AccordionToggle,
  AccordionContent,
  AccordionGroup,
} from "@strapi/design-system/Accordion";
import { Badge } from "@strapi/design-system/Badge";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import { ToggleInput } from "@strapi/design-system/ToggleInput";
import { Typography } from "@strapi/design-system/Typography";

enum ViewState {
  Accordion = "accordion",
  List = "list",
}

type RoutesInfo = {
  [key: string]: {
    routes: any[];
    type: string;
  };
};

const MiddlewaresRoutesPage: React.VoidFunctionComponent = () => {
  const [routes, setRoutes] = useState<RoutesInfo>({});
  const [expandedID, setExpandedID] = useState(null);
  const [view, setView] = useState<ViewState>(ViewState.List);

  const handleToggle = (id) => () => {
    setExpandedID(expandedID === id ? null : id);
  };
  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "success500";
      case "POST":
        return "secondary500";
      case "PUT":
        return "danger500";
      case "DELETE":
        return "danger600";

      default:
        break;
    }
  };

  useEffect(() => {
    axios.get("/strapi-x/routes").then((res) => {
      setRoutes(res.data);
    });
  }, []);

  return (
    <>
      <Box background="neutral100">
        <BaseHeaderLayout
          title="Configure middlewares on routes"
          as="h2"
          navigationAction={
            <Link startIcon={<ArrowLeft />} to="/plugins/strapi-x">
              Go back
            </Link>
          }
        />
        <Box padding={10} paddingTop={0}>
          <Box padding={8} background="neutral0">
            <Box paddingBottom={3} style={{ "text-align": "center" }}>
              <ToggleInput
                name="enable-provider"
                onLabel={ViewState.Accordion}
                offLabel={ViewState.List}
                checked={view == ViewState.Accordion}
                onChange={(e) => {
                  const v = e.target.checked
                    ? ViewState.Accordion
                    : ViewState.List;
                  setView(v);
                }}
              />
            </Box>
            {view == ViewState.Accordion && (
              <AccordionGroup marginTop={3}>
                {Object.keys(routes).map((key) => {
                  return (
                    <Accordion
                      id={"acc-" + key}
                      key={key}
                      size="S"
                      expanded={expandedID === "acc-" + key}
                      onToggle={handleToggle("acc-" + key)}
                    >
                      <AccordionToggle
                        title={key.toUpperCase()}
                        togglePosition="left"
                      />
                      <AccordionContent>
                        <Box padding={3}>
                          {routes[key].routes.map((r) => (
                            <>
                              <Grid>
                                <GridItem col={1}>
                                  <Box padding={1} style={{ width: "70px" }}>
                                    <Badge
                                      backgroundColor={getMethodColor(r.method)}
                                      textColor="neutral0"
                                    >
                                      {r.method}
                                    </Badge>
                                  </Box>
                                </GridItem>
                                <GridItem col={1}>
                                  <Box padding={1}>{r.path}</Box>
                                </GridItem>
                                <GridItem col={10}>
                                  <Box
                                    padding={1}
                                    style={{ "text-align": "right" }}
                                  >
                                    <Link
                                      to={
                                        "/plugins/strapi-x/routes/middlewares/configuration"
                                      }
                                    >
                                      Configure middleware
                                    </Link>
                                  </Box>
                                </GridItem>
                              </Grid>
                            </>
                          ))}
                        </Box>
                      </AccordionContent>
                    </Accordion>
                  );
                })}
              </AccordionGroup>
            )}

            {view == ViewState.List && (
              <>
                {Object.keys(routes).map((key) => {
                  return (
                    <>
                      <Box paddingTop={8} paddingBottom={4}>
                        <Typography variant="beta">
                          {key.toUpperCase()}
                        </Typography>
                      </Box>
                      {routes[key].routes.map((r) => (
                        <>
                          <Grid>
                            <GridItem col={1}>
                              <Box padding={1} style={{ width: "70px" }}>
                                <Badge
                                  backgroundColor={getMethodColor(r.method)}
                                  textColor="neutral0"
                                >
                                  {r.method}
                                </Badge>
                              </Box>
                            </GridItem>
                            <GridItem col={1}>
                              <Box padding={1}>{r.path}</Box>
                            </GridItem>
                            <GridItem col={10}>
                              <Box
                                padding={1}
                                style={{ "text-align": "right" }}
                              >
                                <Link
                                  to={
                                    "/plugins/strapi-x/routes/" +
                                    encodeURIComponent(
                                      key + ":::" + r.method + ":::" + r.path
                                    ) +
                                    "/configuration"
                                  }
                                >
                                  Configure middleware
                                </Link>
                              </Box>
                            </GridItem>
                          </Grid>
                        </>
                      ))}
                    </>
                  );
                })}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MiddlewaresRoutesPage;
