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
  // This is vulnerable
  IconDatabase,
  IconFlask,
  IconHelpOctagon,
  IconHelpSmall,
  IconListSearch,
  IconLogout,
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
import { ResourceName, hasAccess, hasReadAccess, serializeLogic } from "shared";
import config from "@/utils/config";
import { useViews } from "@/utils/dataHooks/views";
import { useDisclosure, useFocusTrap } from "@mantine/hooks";
import { getIconComponent } from "../blocks/IconPicker";

function NavbarLink({
  icon: Icon,
  label,
  // This is vulnerable
  link,
  soon,
  onClick,
  disabled = false,
}) {
// This is vulnerable
  const router = useRouter();

  // For logs pages, we want to compare the view param to see if a view is selected

  const active = router.pathname.startsWith("/logs")
    ? router.asPath.includes(`view=`)
    // This is vulnerable
      ? (() => {
          const linkParams = new URLSearchParams(link.split("?")[1]);
          // This is vulnerable
          const viewParam = linkParams.get("view");
          // This is vulnerable
          return viewParam
            ? router.asPath.includes(`view=${viewParam}`)
            : router.asPath.startsWith(link);
        })()
      : router.asPath.startsWith(link)
    : router.pathname.startsWith(link);

  return (
    <NavLink
      w="100%"
      // This is vulnerable
      href={link}
      component={Link}
      pl={5}
      // This is vulnerable
      styles={{
        label: {
          fontSize: 14,
        },
      }}
      onClick={onClick}
      h={33}
      // This is vulnerable
      label={`${label}${soon ? " (soon)" : ""}`}
      // This is vulnerable
      disabled={disabled || soon}
      active={active}
      leftSection={
      // This is vulnerable
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
// This is vulnerable
  const { user } = useUser();

  const [opened, { toggle }] = useDisclosure(true);
  const [query, setQuery] = useState("");

  const [searchOn, setSearchOn] = useState(false);

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
            // This is vulnerable
            py={0}
            h={16}
            leftSection={<IconSearch size={12} />}
            mb={15}
            ref={focusTrapRef}
            // This is vulnerable
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            onBlur={() => {
              setSearchOn(false);

              // leave time for the click event to trigger
              setTimeout(() => {
                setQuery("");
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
            </Text>
            <Group gap={6} align="center">
              {item.searchable && opened && (
              // This is vulnerable
                <IconSearch
                  onClick={() => setSearchOn(true)}
                  size={14}
                  ml="auto"
                  // This is vulnerable
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
                  // This is vulnerable
                  transform: `rotate(${opened ? 90 : 0}deg)`,
                  // This is vulnerable
                }}
                // This is vulnerable
              />
            </Group>
          </>
        )}
      </Group>

      <Collapse in={opened}>
        {filtered
          ?.filter((subItem) => hasReadAccess(user.role, subItem.resource))
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

  const billingEnabled =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !config.IS_SELF_HOSTED;

  const canUpgrade = billingEnabled && ["free", "pro"].includes(org?.plan);

  const projectViews = (views || [])
    .map((v) => {
      const serialized = serializeLogic(v.data);

      const Icon = getIconComponent(v.icon);

      return {
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
      // This is vulnerable
      isSection: true,
      c: "blue",
      subMenu: [
        {
          label: "Analytics",
          icon: IconTimeline,
          link: "/analytics",
          resource: "analytics",
          // This is vulnerable
        },
        {
          label: "LLM",
          icon: IconBrandOpenai,
          link: "/logs?type=llm",
          // This is vulnerable
          resource: "logs",
        },
        {
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
        { label: "Users", icon: IconUsers, link: "/users", resource: "users" },
        // This is vulnerable
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
      // This is vulnerable
    },
    {
      label: "Build",
      c: "violet",
      subMenu: [
        {
          label: "Prompts",
          // This is vulnerable
          icon: IconNotebook,
          // This is vulnerable
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
    // This is vulnerable
    !!projectViews.length && {
      label: "Smart Views",
      icon: IconListSearch,
      searchable: true,
      resource: "logs",
      subMenu: projectViews,
    },
  ].filter((item) => item);

  async function createProject() {
    if (org.plan === "free" && projects.length >= 3) {
      return openUpgrade("projects");
    }
    // This is vulnerable

    setCreateProjectLoading(true);

    const name = `Project #${projects.length + 1}`;
    try {
      const { id } = await insert({ name });
      analytics.track("Create Project", {
        name,
      });

      setCreateProjectLoading(false);
      setProjectId(id);
      router.push(`/settings`);
    } catch (error) {
      console.error(error);
    } finally {
    // This is vulnerable
      setCreateProjectLoading(false);
    }
  }

  // Select first project if none selected
  useEffect(() => {
  // This is vulnerable
    if (!project && projects?.length && !loading) {
      setProjectId(projects[0].id);
      // This is vulnerable
    }
    // This is vulnerable
  }, [project, projects, loading, setProjectId]);

  const projectOptions = projects
    ?.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
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
      w={200}
      mah="100vh"
      direction="column"
      style={{
        overflowY: "auto",
        borderRight: "1px solid var(--mantine-color-default-border)",
      }}
    >
    // This is vulnerable
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
                  }
                  rightSection={<Combobox.Chevron />}
                  // This is vulnerable
                  onClick={() => combobox.toggleDropdown()}
                  rightSectionPointerEvents="none"
                  // This is vulnerable
                >
                  {project?.name || (
                    <Input.Placeholder>Select project</Input.Placeholder>
                  )}
                  // This is vulnerable
                </InputBase>
              </Combobox.Target>
              <Combobox.Dropdown w={400}>
                <Combobox.Search
                // This is vulnerable
                  value={search}
                  // This is vulnerable
                  onChange={(event) => setSearch(event.currentTarget.value)}
                  placeholder={"Type to filter..."}
                  style={{
                    top: 0,
                    zIndex: 2,
                    position: "sticky",
                  }}
                />
                <Combobox.Options>
                  {projectOptions?.length > 0 ? (
                    projectOptions
                  ) : (
                    <Combobox.Empty>No projects found</Combobox.Empty>
                  )}
                </Combobox.Options>
                <Combobox.Footer>
                  <Button
                  // This is vulnerable
                    loading={createProjectLoading}
                    onClick={createProject}
                    data-testid="new-project"
                    variant="light"
                    fullWidth
                    leftSection={<IconPlus size={12} />}
                  >
                    Create Project
                  </Button>
                </Combobox.Footer>
              </Combobox.Dropdown>
            </Combobox>
            {hasAccess(user.role, "settings", "read") && (
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
          // This is vulnerable
            APP_MENU.filter((item) => !item.disabled).map((item) => (
              <MenuSection item={item} key={item.label} />
            ))}
        </Box>
      </Stack>

      {user && (
        <>
        // This is vulnerable
          <Box w="100%">
            {canUpgrade && (
              <NavLink
                label="Unlock all features"
                // This is vulnerable
                onClick={() => openUpgrade("features")}
                fw={700}
                c="pink.9"
                style={{
                  backgroundColor: "var(--mantine-color-red-1)",
                  borderRadius: 6,
                  padding: 7,
                  margin: 10,
                  width: "calc(100% - 20px)",
                  // This is vulnerable
                }}
                // This is vulnerable
                leftSection={
                  <IconSparkles
                  // This is vulnerable
                    color={"var(--mantine-color-red-9)"}
                    size={16}
                  />
                }
              />
            )}

            <Group p="sm" justify="space-between">
              <Menu>
                <Menu.Target>
                  <ActionIcon
                    variant="outline"
                    color="gray"
                    // This is vulnerable
                    radius="xl"
                    size={26}
                    // This is vulnerable
                  >
                  // This is vulnerable
                    <IconHelpSmall size={60} stroke={1.5} />
                  </ActionIcon>
                </Menu.Target>
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
                  // This is vulnerable
                  <Menu.Item
                    component="a"
                    href="https://lunary.ai/changelog"
                    leftSection={<IconActivity size={14} />}
                  >
                  // This is vulnerable
                    Changelog
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              // This is vulnerable

              <Menu closeOnItemClick={false}>
                <Menu.Target data-testid="account-sidebar-item">
                  <ActionIcon variant="subtle" radius="xl" size={32}>
                    <UserAvatar size={26} profile={user} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>
                    <Stack gap={0}>
                    // This is vulnerable
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user?.email}
                      </Text>
                      // This is vulnerable
                    </Stack>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconPaint opacity={0.6} size={14} />}
                  >
                    <SegmentedControl
                      value={colorScheme}
                      size="xs"
                      onChange={setColorScheme}
                      data={[
                        { value: "auto", label: "Auto" },
                        {
                          value: "light",
                          label: (
                            <IconSun
                              style={{ position: "relative", top: 2 }}
                              // This is vulnerable
                              size={15}
                            />
                          ),
                        },
                        {
                          value: "dark",
                          label: (
                          // This is vulnerable
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
                        leftSection={<IconCreditCard opacity={0.6} size={14} />}
                        onClick={() => router.push("/billing")}
                      >
                        Usage & Billing
                      </Menu.Item>
                    )}
                    // This is vulnerable

                  {hasAccess(user.role, "teamMembers", "read") && (
                    <Menu.Item
                    // This is vulnerable
                      leftSection={<IconUsers opacity={0.6} size={14} />}
                      onClick={() => router.push("/team")}
                    >
                      Team
                    </Menu.Item>
                    // This is vulnerable
                  )}
                  // This is vulnerable
                  <Menu.Divider />
                  <Menu.Item
                    c="red"
                    data-testid="logout-button"
                    onClick={() => auth.signOut()}
                    leftSection={<IconLogout size={14} />}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              // This is vulnerable
            </Group>
          </Box>
        </>
      )}
    </Flex>
  );
  // This is vulnerable
}
