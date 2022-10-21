/*
 *
 * HomePage
 *
 */

import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { Box } from "@strapi/design-system/Box";
import { BaseHeaderLayout } from "@strapi/design-system/Layout";
import { GridLayout } from "@strapi/design-system/Layout";
import MiddlewaresList from "../../components/MiddlewaresList";

import pluginId from "../../pluginId";
import ModelGenerator from "../../components/ModelGenerator";

const HomePage: React.VoidFunctionComponent = () => {
  const [middlewares, setMiddlewares] = useState<
    { key: string; uid: string }[]
  >([]);

  useEffect(() => {
    axios.get("/strapi-x/middlewares").then((res) => {
      setMiddlewares(res.data);
    });
  }, []);

  return (
    <>
      <Box background="neutral100">
        <BaseHeaderLayout
          title="Strapi X - Powerfull plugin for Strapi"
          subtitle={
            <small>
              <b>Plugin UID: </b>
              {pluginId}
            </small>
          }
          as="h2"
        />
      </Box>
      <Box padding={10} paddingTop={0} background="neutral100">
        <GridLayout>
          <Box
            padding={6}
            hasRadius
            background="neutral0"
            key={`box-middlewares`}
            shadow="tableShadow"
          >
            <MiddlewaresList middlewares={middlewares} />
          </Box>
          <Box
            padding={6}
            hasRadius
            background="neutral0"
            key={`box-middlewares`}
            shadow="tableShadow"
          >
            <ModelGenerator></ModelGenerator>
          </Box>
        </GridLayout>
      </Box>
    </>
  );
};

export default HomePage;
