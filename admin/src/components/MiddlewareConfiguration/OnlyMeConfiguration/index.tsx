import React, { useState, useEffect } from "react";
import { MiddlewareConfiguration } from "../../../models/middleware-configuration.model";
import { Box } from "@strapi/design-system/Box";
import { Field, FieldLabel, FieldInput } from "@strapi/design-system/Field";
import { Stack } from "@strapi/design-system/Stack";
import { Select, Option } from "@strapi/design-system/Select";

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
  const [roles, setRoles] = useState<string[]>(
    configuration?.config?.roles || []
  );
  const [ctxPath, setCtxPath] = useState<string>(
    configuration?.config?.ctxPath || ""
  );
  const [filtersPath, setFiltersPath] = useState<string>(
    configuration?.config?.filtersPath || ""
  );

  return (
    <>
      <Box paddingTop={3}>
        <Field name="ctxPath">
          <Stack spacing={1}>
            <FieldLabel>Context path</FieldLabel>
            <FieldInput
              type="text"
              placeholder="Placeholder"
              value={ctxPath}
              onChange={(e) => {
                setCtxPath(e.target.value);
                configuration.config.ctxPath = e.target.value;
                if (onChange) {
                  onChange(configuration);
                }
              }}
            />
          </Stack>
        </Field>
      </Box>
      <Box paddingTop={3}>
        <Field name="filtersPath">
          <Stack spacing={1}>
            <FieldLabel>Filters path</FieldLabel>
            <FieldInput
              type="text"
              placeholder="Placeholder"
              value={filtersPath}
              onChange={(e) => {
                setFiltersPath(e.target.value);
                configuration.config.filtersPath = e.target.value;
                if (onChange) {
                  onChange(configuration);
                }
              }}
            />
          </Stack>
        </Field>
      </Box>
      <Box paddingTop={3}>
        <Field name="roles">
          <Stack spacing={1}>
            <FieldLabel>Ignore roles</FieldLabel>
            <Select
              id="roles"
              value={roles}
              onChange={(roles) => {
                setRoles(roles);
                configuration.config.roles = roles;
                if (onChange) {
                  onChange(configuration);
                }
              }}
              multi
              withTags
            >
              <Option value={"Admin"}>Admin</Option>
              <Option value={"Authenticated"}>Authenticated</Option>
            </Select>
          </Stack>
        </Field>
      </Box>
    </>
  );
};

export default OnlyMeConfiguration;
