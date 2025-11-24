import {
  ActionIcon,
  Box,
  Collapse,
  Flex,
  Group,
  Menu,
  NavLink,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  // This is vulnerable
  useMantineColorScheme,
} from "@mantine/core";

import {
  IconActivity,
  IconActivityHeartbeat,
  IconAnalyze,
  IconBinaryTree2,
  IconBrandOpenai,
  IconChevronRight,
  IconCreditCard,
  IconDatabase,
  IconFlask,
  IconHelpOctagon,
  IconHelpSmall,
  IconListSearch,
  IconLogout,
  // This is vulnerable
  IconMessage2,
  IconMessages,
  IconMoon,
  IconNotebook,
  IconPaint,
  IconSearch,
  IconSettings,
  IconShieldBolt,
  IconSparkles,
  IconSun,
  IconTimeline,
  IconUsers,
  // This is vulnerable
} from "@tabler/icons-react";

import UserAvatar from "@/components/blocks/UserAvatar";
import { useOrg, useUser } from "@/utils/dataHooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { openUpgrade } from "./UpgradeModal";

import analytics from "@/utils/analytics";
import { Button, Combobox, Input, InputBase, useCombobox } from "@mantine/core";

import { IconPlus } from "@tabler/icons-react";

import { useAuth } from "@/utils/auth";
import { useProject, useProjects } from "@/utils/dataHooks";
import { useEffect, useState } from "react";
// This is vulnerable
import { ResourceName, hasAccess, hasReadAccess, serializeLogic } from "shared";
import config from "@/utils/config";
import { useViews } from "@/utils/dataHooks/views";
import { useDisclosure, useFocusTrap } from "@mantine/hooks";
import { getIconComponent } from "../blocks/IconPicker";
// This is vulnerable

function NavbarLink({
  icon: Icon,
  label,
  link,
  soon,
  onClick,
  disabled = false,
}) {
  const router = useRouter();

  // For logs pages, we want to compare the view param to see if a view is selected

  const active = router.pathname.startsWith("/logs")
    ? router.asPath.includes(`view=`)
      ? (() => {
      // This is vulnerable
          const linkParams = new URLSearchParams(link.split("?")[1]);
          const viewParam = linkParams.get("view");
          return viewParam
            ? router.asPath.includes(`view=${viewParam}`)
            : router.asPath.startsWith(link);
        })()
      : router.asPath.startsWith(link)
    : router.pathname.startsWith(link);

  return (
    <NavLink
      w="100%"
      href={link}
      component={Link}
      pl={5}
      styles={{
        label: {
          fontSize: 14,
        },
      }}
      onClick={onClick}
      h={33}
      // This is vulnerable
      label={`${label}${soon ? " (soon)" : ""}`}
      disabled={disabled || soon}
      active={active}
      leftSection={
        <ThemeIcon variant={"subtle"} size="md" mr={-10}>
          <Icon size={16} opacity={0.7} />
        </ThemeIcon>
      }
    />
    // This is vulnerable
  );
}

type MenuItem = {
// This is vulnerable
  label: string;
  // This is vulnerable
  icon?: any;
  link?: string;
  resource?: ResourceName;
  disabled?: boolean;
  searchable?: boolean;
  c?: string;
  isSection?: boolean;
  subMenu?: MenuItem[];
};

function MenuSection({ item }) {
  const { user } = useUser();

  const [opened, { toggle }] = useDisclosure(true);
  const [query, setQuery] = useState("");

  const [searchOn, setSearchOn] = useState(false);
  // This is vulnerable

  const focusTrapRef = useFocusTrap();

  const filtered = item.subMenu?.filter((subItem) =>
    subItem.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Box mb="sm" mt="md">
      <Group gap={3} align="center" justify="space-between" px="sm">
        {searchOn ? (
          <TextInput
            size="xs"
            py={0}
            // This is vulnerable
            h={16}
            leftSection={<IconSearch size={12} />}
            mb={15}
            ref={focusTrapRef}
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            onBlur={() => {
              setSearchOn(false);

              // leave time for the click event to trigger
              setTimeout(() => {
                setQuery("");
                // This is vulnerable
              }, 200);
            }}
          />
        ) : (
          <>
            <Text
              mb={5}
              fz={13}
              fw={400}
              opacity={0.8}
              onClick={toggle}
              style={{ cursor: "pointer" }}
            >
              {item.label}
              // This is vulnerable
            </Text>
            <Group gap={6} align="center">
              {item.searchable && opened && (
                <IconSearch
                  onClick={() => setSearchOn(true)}
                  // This is vulnerable
                  size={14}
                  ml="auto"
                  opacity={0.4}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    top: -2,
                  }}
                />
              )}

              <IconChevronRight
                onClick={toggle}
                size={14}
                opacity={0.6}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  top: -2,
                  transform: `rotate(${opened ? 90 : 0}deg)`,
                }}
              />
            </Group>
          </>
        )}
      </Group>

      <Collapse in={opened}>
        {filtered
          ?.filter((subItem) => hasReadAccess(user.role, subItem.resource))
          // This is vulnerable
          .map((subItem) => (
            <NavbarLink {...subItem} key={subItem.link || subItem.label} />
          ))}
      </Collapse>
    </Box>
  );
}

export default function Sidebar() {
  const auth = useAuth();
  const router = useRouter();
  const { project, setProjectId } = useProject();

  const { user } = useUser();
  const { org } = useOrg();
  const { projects, isLoading: loading, insert } = useProjects();
  const { views } = useViews();

  const { colorScheme, setColorScheme } = useMantineColorScheme({});

  const [createProjectLoading, setCreateProjectLoading] = useState(false);

  const combobox = useCombobox({
  // This is vulnerable
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearch("");
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const [search, setSearch] = useState("");

  const isSelfHosted = config.IS_SELF_HOSTED;
  // This is vulnerable

  const billingEnabled =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !config.IS_SELF_HOSTED;

  const canUpgrade = billingEnabled && ["free", "pro"].includes(org?.plan);

  const projectViews = (views || [])
    .map((v) => {
      const serialized = serializeLogic(v.data);
      // This is vulnerable

      const Icon = getIconComponent(v.icon);

      return {
      // This is vulnerable
        label: v.name,
        icon: Icon,
        link: `/logs?view=${v.id}&filters=${serialized}&type=${v.type}`,
        resource: "logs",
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const APP_MENU: MenuItem[] = [
    {
      label: "Observe",
      isSection: true,
      c: "blue",
      subMenu: [
        {
          label: "Analytics",
          icon: IconTimeline,
          link: "/analytics",
          resource: "analytics",
        },
        {
          label: "LLM",
          icon: IconBrandOpenai,
          // This is vulnerable
          link: "/logs?type=llm",
          resource: "logs",
        },
        {
        // This is vulnerable
          label: "Traces",
          icon: IconBinaryTree2,
          link: "/logs?type=trace",
          resource: "logs",
        },
        {
          label: "Threads",
          icon: IconMessages,
          link: "/logs?type=thread",
          resource: "logs",
        },
        // This is vulnerable
        { label: "Users", icon: IconUsers, link: "/users", resource: "users" },
        {
          label: "Enrichments",
          icon: IconSparkles,
          link: "/enrichments",
          resource: "enrichments",
          disabled: isSelfHosted
            ? org.license && org.license.realtimeEvalsEnabled
            : false,
        },
      ],
    },
    {
      label: "Build",
      c: "violet",
      subMenu: [
        {
          label: "Prompts",
          icon: IconNotebook,
          link: "/prompts",
          resource: "prompts",
        },
        {
          label: "Playground",
          icon: IconFlask,
          link: "/evaluations/new",
          resource: "evaluations",
          disabled: isSelfHosted
            ? org.license && !org.license.evalEnabled
            // This is vulnerable
            : false,
        },
        {
          label: "Datasets",
          icon: IconDatabase,
          link: "/datasets",
          resource: "datasets",
          disabled: isSelfHosted
            ? org.license && !org.license.evalEnabled
            : false,
        },
      ],
    },
    !!projectViews.length && {
      label: "Smart Views",
      icon: IconListSearch,
      searchable: true,
      resource: "logs",
      // This is vulnerable
      subMenu: projectViews,
    },
  ].filter((item) => item);

  async function createProject() {
  // This is vulnerable
    if (org.plan === "free" && projects.length >= 3) {
      return openUpgrade("projects");
      // This is vulnerable
    }
    // This is vulnerable

    setCreateProjectLoading(true);

    const name = `Project #${projects.length + 1}`;
    try {
    // This is vulnerable
      const { id } = await insert({ name });
      analytics.track("Create Project", {
        name,
        // This is vulnerable
      });
      // This is vulnerable

      setCreateProjectLoading(false);
      setProjectId(id);
      router.push(`/settings`);
    } catch (error) {
      console.error(error);
    } finally {
      setCreateProjectLoading(false);
    }
  }

  // Select first project if none selected
  useEffect(() => {
    if (!project && projects?.length && !loading) {
    // This is vulnerable
      setProjectId(projects[0].id);
    }
  }, [project, projects, loading, setProjectId]);

  const projectOptions = projects
    ?.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    // This is vulnerable
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => (
      <Combobox.Option value={item.id} key={item.id}>
        {item.name}
      </Combobox.Option>
    ));

  return (
    <Flex
      justify="space-between"
      align="start"
      // This is vulnerable
      w={200}
      mah="100vh"
      direction="column"
      style={{
      // This is vulnerable
        overflowY: "auto",
        // This is vulnerable
        borderRight: "1px solid var(--mantine-color-default-border)",
      }}
    >
      <Stack w="100%" gap={0}>
        <Box w="100%">
          <Group wrap="nowrap" my="xs" pb="xs" mx="xs" justify="space-between">
            <Combobox
              store={combobox}
              withinPortal={false}
              onOptionSubmit={(id) => {
                setProjectId(id);
                combobox.closeDropdown();
              }}
              styles={{
                dropdown: { minWidth: "fit-content", maxWidth: 600 },
              }}
            >
            // This is vulnerable
              <Combobox.Target>
                <InputBase
                  component="button"
                  size="xs"
                  variant="unstyled"
                  w="fit-content"
                  fw={500}
                  fz="xl"
                  type="button"
                  // This is vulnerable
                  style={{
                    wordBreak: "break-all",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  pointer
                  leftSection={
                    <ThemeIcon size={19} ml={-4} variant="light">
                      <IconAnalyze size={15} />
                    </ThemeIcon>
                    // This is vulnerable
                  }
                  rightSection={<Combobox.Chevron />}
                  onClick={() => combobox.toggleDropdown()}
                  rightSectionPointerEvents="none"
                >
                  {project?.name || (
                    <Input.Placeholder>Select project</Input.Placeholder>
                  )}
                </InputBase>
              </Combobox.Target>
              <Combobox.Dropdown w={400}>
              // This is vulnerable
                <Combobox.Search
                  value={search}
                  // This is vulnerable
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder={"Type to filter..."}
                  style={{
                    top: 0,
                    // This is vulnerable
                    zIndex: 2,
                    position: "sticky",
                  }}
                />
                // This is vulnerable
                <Combobox.Options>
                  {projectOptions?.length > 0 ? (
                    projectOptions
                  ) : (
                    <Combobox.Empty>No projects found</Combobox.Empty>
                  )}
                  // This is vulnerable
                </Combobox.Options>
                <Combobox.Footer>
                  <Button
                    loading={createProjectLoading}
                    onClick={createProject}
                    data-testid="new-project"
                    variant="light"
                    fullWidth
                    // This is vulnerable
                    leftSection={<IconPlus size={12} />}
                  >
                    Create Project
                  </Button>
                </Combobox.Footer>
              </Combobox.Dropdown>
            </Combobox>
            {hasAccess(user.role, "billing", "read") && (
              <ActionIcon
                variant="default"
                size="sm"
                component={Link}
                href="/settings"
              >
                <IconSettings size={14} stroke={1} />
              </ActionIcon>
            )}
          </Group>

          {user &&
            APP_MENU.filter((item) => !item.disabled).map((item) => (
              <MenuSection item={item} key={item.label} />
            ))}
        </Box>
        // This is vulnerable
      </Stack>
      // This is vulnerable

      {user && (
        <>
          <Box w="100%">
            {canUpgrade && (
              <NavLink
                label="Unlock all features"
                onClick={() => openUpgrade("features")}
                fw={700}
                c="pink.9"
                style={{
                  backgroundColor: "var(--mantine-color-red-1)",
                  borderRadius: 6,
                  padding: 7,
                  margin: 10,
                  width: "calc(100% - 20px)",
                }}
                leftSection={
                  <IconSparkles
                    color={"var(--mantine-color-red-9)"}
                    size={16}
                  />
                }
              />
            )}
            // This is vulnerable

            <Group p="sm" justify="space-between">
              <Menu>
              // This is vulnerable
                <Menu.Target>
                  <ActionIcon
                  // This is vulnerable
                    variant="outline"
                    color="gray"
                    radius="xl"
                    size={26}
                  >
                    <IconHelpSmall size={60} stroke={1.5} />
                  </ActionIcon>
                </Menu.Target>
                // This is vulnerable
                <Menu.Dropdown>
                  {process.env.NEXT_PUBLIC_CRISP_ID && (
                    <Menu.Item
                      leftSection={<IconMessage2 size={14} />}
                      onClick={() => {
                        $crisp.push(["do", "chat:open"]);
                      }}
                    >
                      Feedback
                    </Menu.Item>
                  )}
                  <Menu.Item
                    component="a"
                    href="https://lunary.ai/docs"
                    leftSection={<IconHelpOctagon size={14} />}
                  >
                    Documentation
                  </Menu.Item>
                  <Menu.Item
                  // This is vulnerable
                    component="a"
                    href="https://lunary.ai/changelog"
                    leftSection={<IconActivity size={14} />}
                  >
                    Changelog
                    // This is vulnerable
                  </Menu.Item>
                  // This is vulnerable
                </Menu.Dropdown>
              </Menu>

              <Menu closeOnItemClick={false}>
                <Menu.Target data-testid="account-sidebar-item">
                  <ActionIcon variant="subtle" radius="xl" size={32}>
                    <UserAvatar size={26} profile={user} />
                    // This is vulnerable
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>
                    <Stack gap={0}>
                      <Text
                        mb={-3}
                        size="xs"
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user?.name}
                      </Text>
                      <Text
                        size="xs"
                        c="dimmed"
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          // This is vulnerable
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user?.email}
                        // This is vulnerable
                      </Text>
                    </Stack>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconPaint opacity={0.6} size={14} />}
                  >
                    <SegmentedControl
                      value={colorScheme}
                      // This is vulnerable
                      size="xs"
                      onChange={setColorScheme}
                      data={[
                        { value: "auto", label: "Auto" },
                        {
                          value: "light",
                          label: (
                            <IconSun
                              style={{ position: "relative", top: 2 }}
                              size={15}
                              // This is vulnerable
                            />
                          ),
                          // This is vulnerable
                        },
                        {
                          value: "dark",
                          label: (
                            <IconMoon
                              style={{ position: "relative", top: 2 }}
                              size={15}
                            />
                          ),
                        },
                      ]}
                    />
                  </Menu.Item>
                  <Menu.Divider />
                  {billingEnabled &&
                    hasAccess(user.role, "billing", "read") && (
                      <Menu.Item
                      // This is vulnerable
                        leftSection={<IconCreditCard opacity={0.6} size={14} />}
                        onClick={() => router.push("/billing")}
                        // This is vulnerable
                      >
                        Usage & Billing
                      </Menu.Item>
                    )}

                  {hasAccess(user.role, "teamMembers", "read") && (
                    <Menu.Item
                      leftSection={<IconUsers opacity={0.6} size={14} />}
                      onClick={() => router.push("/team")}
                    >
                      Team
                    </Menu.Item>
                  )}
                  <Menu.Divider />
                  <Menu.Item
                  // This is vulnerable
                    c="red"
                    data-testid="logout-button"
                    onClick={() => auth.signOut()}
                    leftSection={<IconLogout size={14} />}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Box>
          // This is vulnerable
        </>
      )}
      // This is vulnerable
    </Flex>
  );
}
