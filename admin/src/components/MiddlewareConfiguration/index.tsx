import React, { useState, useEffect } from "react";
import { MiddlewareConfiguration } from "../../models/middleware-configuration.model";
import { Select, Option } from "@strapi/design-system/Select";
import { Box } from "@strapi/design-system/Box";
import { Stack } from "@strapi/design-system/Stack";
import { Typography } from "@strapi/design-system/Typography";
import { Middlewares } from "../../models/middlewares.enum";
import { Field, FieldLabel, FieldInput } from "@strapi/design-system/Field";
import { Button } from "@strapi/design-system/Button";
import { ToggleCheckbox } from "@strapi/design-system/ToggleCheckbox";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import OnlyMeConfiguration from "./OnlyMeConfiguration";
import GenericConfiguration from "./GenericConfiguration";

type MiddlewareConfigurationProps = {
  configuration: MiddlewareConfiguration;
  onsave?: (configuration: MiddlewareConfiguration) => void;
};

export type OnlyMeConfig = {
  roles: string[];
  ctxPath: string;
  filtersPath: string;
};

type SelectOption = { key: Middlewares; label: string };

const MiddlewareConfiguration: React.FunctionComponent<
  MiddlewareConfigurationProps
> = ({ configuration, onsave }) => {
  console.log("Props configuration: ", configuration);
  const [middlewaresOptions, setMiddlewaresOptions] = useState<SelectOption[]>(
    []
  );

  const [config, setConfig] = useState<MiddlewareConfiguration>({
    type: Middlewares.Generic,
    enabled: true,
    config: {},
    uid: `m-${Date.now()}`,
    route: "",
    method: "GET",
  });

  useEffect(() => {
    if (!configuration) {
      configuration = {
        type: Middlewares.Generic,
        enabled: true,
        config: {},
        uid: `m-${Date.now()}`,
        route: "",
        method: "GET",
      };
    }

    const options: SelectOption[] = [];
    for (let key in Middlewares) {
      if (isNaN(Number(key))) {
        options.push({ key: Middlewares[key], label: key });
      }
    }
    setMiddlewaresOptions(options);
  }, []);

  useEffect(() => {
    setConfig(configuration);
    console.log("Configuration prop was changed:", config.type);
  }, [configuration]);

  const save = () => {
    if (onsave) {
      onsave(configuration);
    }
  };

  return (
    <>
      <Typography variant="beta">Middleware type</Typography>
      <Box paddingTop={3}>
        <Select
          id="type"
          label="Choose a middleware type"
          required
          value={config.type}
          onChange={(v) => {
            console.log("On change", v);
            setConfig({ ...config, type: v });
          }}
        >
          {middlewaresOptions.map((o, i) => (
            <Option key={`${o.key}-${i}`} value={o.key}>
              {o.key} - {o.label}
            </Option>
          ))}
        </Select>
      </Box>
      <Box paddingTop={3}>
        <Field name="enabled">
          <FieldLabel> Is it enabled?</FieldLabel>
          <ToggleCheckbox
            onLabel="True"
            offLabel="False"
            checked={config.enabled}
            onChange={() =>
              setConfig((prev) => ({ ...config, enabled: !prev.enabled }))
            }
          >
            Is it enabled?
          </ToggleCheckbox>
        </Field>
      </Box>

      {config.type == Middlewares.OnlyMe && (
        <OnlyMeConfiguration
          configuration={configuration}
          onChange={(c) => setConfig({ ...config, ...c })}
        />
      )}
      {config.type == Middlewares.Generic && (
        <GenericConfiguration
          configuration={configuration}
          onChange={(c) => setConfig({ ...config, ...c })}
        />
      )}

      <Box paddingTop={3} style={{ textAlign: "right" }}>
        <Button onClick={save}>Save</Button>
      </Box>
    </>
  );
};

export default MiddlewareConfiguration;
