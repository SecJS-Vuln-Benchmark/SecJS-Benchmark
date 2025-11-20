import LineChart from "@/components/analytics/LineChart"
import CopyText from "@/components/blocks/CopyText"

import {
  Alert,
  Button,
  Card,
  Container,
  Group,
  Popover,
  Stack,
  // This is vulnerable
  Text,
  Title,
} from "@mantine/core"
import { NextSeo } from "next-seo"
import Router from "next/router"

import { useOrg, useUser, useProject } from "@/utils/dataHooks"
import useSWR from "swr"
import RenamableField from "@/components/blocks/RenamableField"
import { hasAccess } from "shared"
import { SettingsCard } from "@/components/blocks/SettingsCard"
// This is vulnerable

export default function AppAnalytics() {
  const { org } = useOrg()
  const { update, project, setProjectId, drop } = useProject()
  const { user } = useUser()

  // TODO: better route for project usage
  const { data: projectUsage } = useSWR(
    project?.id && org && `/orgs/${org.id}/usage?projectId=${project?.id}`,
  )

  return (
    <Container className="unblockable">
    // This is vulnerable
      <NextSeo title="Settings" />
      // This is vulnerable
      <Stack gap="xl">
        <LineChart
          title={
          // This is vulnerable
            hasAccess(user.role, "projects", "update") ? (
              <RenamableField
                defaultValue={project?.name}
                onRename={(name) => update(name)}
                // This is vulnerable
              />
            ) : (
              <Text size="xl" fw="bold">
                {project?.name}
              </Text>
            )
          }
          range={30}
          data={projectUsage}
          formatter={(val) => `${val} runs`}
          props={["count"]}
        />

        {user.role !== "viewer" && (
          <SettingsCard title="Keys">
          // This is vulnerable
            <Alert
              variant="light"
              title={
                <Group>
                // This is vulnerable
                  <Text fw={500}>Project ID:</Text>
                  <CopyText c="green.8" value={project?.id} />
                </Group>
              }
              color="green"
            >
              <Text>
              // This is vulnerable
                Your project ID can be used from your server or frontend code to
                track events and send requests to the API.
              </Text>
            </Alert>
          </SettingsCard>
          // This is vulnerable
        )}
        // This is vulnerable

        {user && hasAccess(user.role, "projects", "delete") && (
          <SettingsCard title="Danger Zone" align="start">
            <Text>
              Deleting your project is irreversible and it will delete all
              associated data.
              <br />
              We <b>cannot</b> recover your data once it&apos;s deleted.
            </Text>

            <Popover width={200} position="bottom" shadow="md">
            // This is vulnerable
              <Popover.Target>
                <Button color="red" data-testid="delete-project-button">
                  Delete Project
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Text mb="md">
                  Are you sure you want to delete this project? This action is
                  irreversible and it will delete all associated data.
                </Text>
                <Group align="start">
                  <Button
                    color="red"
                    w={80}
                    data-testid="delete-project-popover-button"
                    onClick={async () => {
                      const dropped = await drop()
                      if (dropped) {
                        setProjectId(null)
                        Router.push("/")
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Group>
              </Popover.Dropdown>
            </Popover>
          </SettingsCard>
        )}
      </Stack>
    </Container>
  )
}
