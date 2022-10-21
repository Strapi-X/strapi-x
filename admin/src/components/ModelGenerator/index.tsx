/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useState } from "react";
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
import { Typography } from "@strapi/design-system/Typography";
import Plus from "@strapi/icons/Plus";
import { Select, Option } from "@strapi/design-system/Select";
import { Box } from "@strapi/design-system/Box";
import pluginId from "../../pluginId";
import { Button } from "@strapi/design-system/Button";
import axios from "../../utils/axiosInstance";

type ModelGeneratorProps = {};

const ModelGenerator: React.VoidFunctionComponent<ModelGeneratorProps> = (
  props: ModelGeneratorProps
) => {
  const [lang, setLang] = useState("typescript");
  const [downloadModelsUrl, setDownloadModelsUrl] = useState();
  const [downloadServicesUrl, setDownloadServicesUrl] = useState();

  const download = (type: "models" | "services") => {
    axios.post(`/strapi-x/generator/${type}/${lang}`, {}).then((res) => {
      if (type == "models") {
        setDownloadModelsUrl(res.data.downloadUrl);
      }
      if (type == "services") {
        setDownloadModelsUrl(res.data.downloadUrl);
      }
    });
  };

  return (
    <>
      <Box padding={3} paddingLeft={0}>
        <Typography variant="beta">Generators</Typography>
      </Box>
      <Box paddingTop={3}>
        <Box padding={3} paddingLeft={0}>
          <Typography variant="beta">Models generator</Typography>
        </Box>
        <Table colCount={4} rowCount={2}>
          <Tbody>
            <Tr>
              <Td>
                <Typography textColor="neutral800">
                  <Select
                    id="type"
                    label="Choose a middleware type"
                    required
                    value={lang}
                    onChange={(v) => {
                      console.log("On change", v);
                      setLang(v);
                    }}
                  >
                    <Option value={"typescript"}>Typescript</Option>
                  </Select>
                </Typography>
              </Td>
              <Td>
                <Typography
                  textColor="neutral800"
                  style={{ textAlign: "right" }}
                >
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      download("models");
                    }}
                  >
                    Download
                  </Button>
                </Typography>
              </Td>
            </Tr>
          </Tbody>
        </Table>
        {downloadModelsUrl && (
          <Box padding={3} paddingLeft={0}>
            <a target={"_blank"} href={downloadModelsUrl}>
              Download models
            </a>
          </Box>
        )}
      </Box>
      <Box paddingTop={3}>
        <Box padding={3} paddingLeft={0}>
          <Typography variant="beta">Services generator</Typography>
        </Box>
        <Table colCount={4} rowCount={2}>
          <Tbody>
            <Tr>
              <Td>
                <Typography textColor="neutral800">
                  <Select
                    id="type"
                    label="Choose a middleware type"
                    required
                    value={lang}
                    onChange={(v) => {
                      console.log("On change", v);
                      setLang(v);
                    }}
                  >
                    <Option value={"typescript"}>Typescript</Option>
                  </Select>
                </Typography>
              </Td>
              <Td>
                <Typography
                  textColor="neutral800"
                  style={{ textAlign: "right" }}
                >
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      download("services");
                    }}
                  >
                    Download
                  </Button>
                </Typography>
              </Td>
            </Tr>
          </Tbody>
        </Table>
        {downloadServicesUrl && (
          <Box padding={3} paddingLeft={0}>
            <a target={"_blank"} href={downloadModelsUrl}>
              Download services
            </a>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ModelGenerator;
