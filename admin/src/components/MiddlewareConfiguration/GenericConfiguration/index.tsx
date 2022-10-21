import React, { useState, useEffect } from "react";
import { MiddlewareConfiguration } from "../../../models/middleware-configuration.model";
import { Box } from "@strapi/design-system/Box";
import { Field, FieldLabel, FieldInput } from "@strapi/design-system/Field";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

type MiddlewareConfigurationProps = {
  configuration: MiddlewareConfiguration;
  onChange?: (configuration: MiddlewareConfiguration) => void;
};

export type OnlyMeConfig = {
  roles: string[];
  ctxPath: string;
  filtersPath: string;
};

const OnlyMeConfiguration: React.FunctionComponent<
  MiddlewareConfigurationProps
> = ({ configuration, onChange }) => {
  return (
    <Grid gap={5}>
      <GridItem col={6}>
        <Box paddingTop={3}>
          <Field name="enabled">
            <FieldLabel>Request interceptor</FieldLabel>
            <Editor
              height="30vh"
              theme="vs-dark"
              onChange={(v) =>
                (configuration.config.pre = v
                  ? v
                  : "(config, strapi, ctx, next) => {}")
              }
              defaultLanguage="javascript"
              defaultValue={
                configuration?.config?.pre
                  ? "" + configuration?.config?.pre
                  : "(config, strapi, ctx, next) => {}"
              }
            />
          </Field>
        </Box>
      </GridItem>
      <GridItem col={6}>
        <Box paddingTop={3}>
          <Field name="enabled">
            <FieldLabel>Response interceptor</FieldLabel>
            <Editor
              height="30vh"
              theme="vs-dark"
              defaultLanguage="javascript"
              defaultValue={
                configuration?.config?.post
                  ? "" + configuration?.config?.post
                  : "(config, strapi, ctx, next) => {}"
              }
              onChange={(v) =>
                (configuration.config.post = v
                  ? v
                  : "(config, strapi, ctx, next) => {}")
              }
            />
          </Field>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default OnlyMeConfiguration;
