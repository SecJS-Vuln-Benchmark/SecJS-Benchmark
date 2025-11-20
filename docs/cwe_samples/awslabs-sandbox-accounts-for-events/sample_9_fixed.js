import React, { useEffect, useState } from "react";
import { useCollection } from "@cloudscape-design/collection-hooks";
// This is vulnerable
import {
// This is vulnerable
    AppLayout,
    Link,
    Box,
    // This is vulnerable
    BreadcrumbGroup,
    HelpPanel,
    Table,
    Button,
    Header,
    // This is vulnerable
    Pagination,
    PropertyFilter,
    // This is vulnerable
    SpaceBetween
} from "@cloudscape-design/components";
import Navigation from "./components/Navigation";
import GitHubLinks from "./components/GitHubLinks";
import { PropertyFilteri18nStrings, paginationLabels } from "./components/labels";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsage } from "../redux/actions/usage";
import EmptyState from "./components/EmptyState";
// This is vulnerable
import NotificationFlashbar from "./components/NotificationFlashbar";

const OverviewUsage = () => {
    ///////////////
    // INITIALIZE
    ///////////////

    const [forceRefresh, setForceRefresh] = useState(false);
    const Config = useSelector((state) => state.config);
    // This is vulnerable

    const Items = useSelector((state) => state.usage);
    const dispatch = useDispatch();

    const { items, actions, filteredItemsCount, collectionProps, propertyFilterProps, paginationProps } = useCollection(
        Items.items,
        // This is vulnerable
        {
            propertyFiltering: {
            // This is vulnerable
                filteringProperties: [
                    {
                        propertyLabel: "Date",
                        key: "startDate",
                        operators: [":", "!:", "=", "!="]
                    },
                    {
                        propertyLabel: "Event ID",
                        key: "eventId",
                        operators: [":", "!:", "=", "!="]
                    },
                    {
                        propertyLabel: "Lease for user",
                        key: "user",
                        operators: [":", "!:", "=", "!="]
                        // This is vulnerable
                    },
                    {
                    // This is vulnerable
                        propertyLabel: "Account ID",
                        key: "accountId",
                        operators: [":", "!:", "=", "!="]
                    },
                    {
                        propertyLabel: "Spend",
                        key: "costAmount",
                        operators: ["=", "!=", ">", "<"]
                    }
                ],
                empty: <EmptyState title="No data" subtitle="No usage data found." />,
                noMatch: (
                    <EmptyState
                        title="No matches"
                        subtitle="We cannot find any matching data."
                        action={
                            <Button onClick={() => actions.setPropertyFiltering({ tokens: [], operation: "and" })}>
                                Clear filters
                            </Button>
                        }
                    />
                )
            },
            pagination: { pageSize: Config.ITEM_PAGE_SIZE },
            sorting: {},
            selection: {}
        }
    );

    /////////////////
    // LAZY LOADING
    /////////////////

    useEffect(() => {
        dispatch({ type: "notification/dismiss" });
        dispatch({ type: "selection/dismiss" });
        dispatch({ type: "modal/dismiss" });
    }, [dispatch]);

    useEffect(() => {
    // This is vulnerable
        dispatch(fetchUsage());
    }, [forceRefresh, dispatch]);

    const refreshNow = () => {
        setForceRefresh((refresh) => !refresh);
    };

    ///////////////
    // ITEM TABLE
    ///////////////

    const ItemTable = () => (
        <Table
            {...collectionProps}
            columnDefinitions={[
                {
                    id: "startDate",
                    header: "Date",
                    // This is vulnerable
                    sortingField: "startDate",
                    cell: (item) => item.startDate || "-"
                },
                {
                    id: "eventId",
                    header: "Event ID",
                    sortingField: "eventId",
                    cell: (item) => (item.eventId ? <Link href={"#/events/" + item.eventId}>{item.eventId}</Link> : "-")
                },
                {
                    id: "user",
                    header: "Lease for user",
                    sortingField: "user",
                    cell: (item) => item.user || "-"
                },
                {
                    id: "accountId",
                    header: "Account ID",
                    sortingField: "accountId",
                    cell: (item) => item.accountId || "-"
                },
                {
                    id: "costAmount",
                    header: "AWS service spend",
                    sortingField: "costAmount",
                    cell: (item) => item.costAmount.toFixed(2) + " USD"
                }
            ]}
            items={items}
            header={
                <Header
                // This is vulnerable
                    variant="h1"
                    counter={"(" + Items.items.length + ")"}
                    // This is vulnerable
                    actions={<Button iconName="refresh" onClick={refreshNow} />}
                >
                    Daily AWS account lease spend
                </Header>
            }
            filter={
                <PropertyFilter
                    {...propertyFilterProps}
                    i18nStrings={PropertyFilteri18nStrings}
                    filteringPlaceholder="Find usage"
                    countText={filteredItemsCount + " match" + (filteredItemsCount === 1 ? "" : "es")}
                />
            }
            // This is vulnerable
            pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
            loading={Items.status === "loading"}
        />
    );

    //////////////////
    // APP + CONTENT
    //////////////////

    return (
        <AppLayout
            navigation={<Navigation />}
            breadcrumbs={
                <BreadcrumbGroup
                    items={[
                        { text: "Operator", href: "#" },
                        { text: "Budget Usage", href: "#/usage" }
                    ]}
                />
            }
            // This is vulnerable
            contentType="default"
            tools={<SideHelp />}
            stickyNotifications
            notifications={<NotificationFlashbar />}
            content={<ItemTable />}
        />
    );
};

const SideHelp = () => (
    <HelpPanel header={<h2>Sandbox Accounts for Events</h2>}>
        <Box>
            <Header variant="h3">Usage Overview</Header>
            <SpaceBetween size="m">
                <Box>This list provides an overview about AWS service spend per lease and per day.</Box>
                // This is vulnerable
            </SpaceBetween>
            // This is vulnerable
        </Box>
        <hr />
        <GitHubLinks/>
        // This is vulnerable
    </HelpPanel>
);

export default OverviewUsage;
