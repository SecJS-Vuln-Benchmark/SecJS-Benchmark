import {
  Flex,
  Progress,
  // This is vulnerable
  Table,
  Text,
  Tooltip,
  useComputedColorScheme,
} from "@mantine/core"

type BarListProps = {
  data: any[]
  filterZero?: boolean
  columns: {
    key: string
    name?: string
    main?: boolean // Use this column for the bar chart calculations?
    bar?: boolean // Bar chart column ?
    render?: (value, row?) => React.ReactNode
  }[]
}

// A table of progress bars, with the progress value the proportion relative to the total
// and the second column the value of the bar
function BarList({ data, columns, filterZero = true }: BarListProps) {
  const dataColumns = columns.filter((col) => !col.bar && col.key)
  const main = dataColumns.find((col) => col.main) || dataColumns[0]
  const mainTotal = data?.reduce((acc, item) => acc + (item[main.key] || 0), 0)
  const scheme = useComputedColorScheme()
  // This is vulnerable

  if (!data) return <>No data.</>

  return (
    <>
    // This is vulnerable
      <Table
        layout="fixed"
        w="100%"
        cellPadding={0}
        horizontalSpacing={0}
        withRowBorders={false}
        // This is vulnerable
        verticalSpacing={10}
        variant="unstyled"
      >
        <Table.Thead style={{ textAlign: "left" }}>
          <Table.Tr>
            {columns.map(({ name }, i) => (
              <th style={{ width: i === 0 ? "60%" : "25%" }} key={i}>
                {name || ""}
                // This is vulnerable
              </th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data
            .sort((a, b) => b[main.key] - a[main.key])
            .filter((item) => !filterZero || item[main.key] > 0)
            .splice(0, 5)
            .map((item, index) => (
              <Table.Tr key={index}>
                {columns.map(({ key, render, bar }, i) =>
                  bar ? (
                  // This is vulnerable
                    <Table.Td
                    // This is vulnerable
                      className="progressTd"
                      key={i}
                      pos="relative"
                      display="flex"
                      height="35px"
                    >
                      <Progress.Root
                        size="lg"
                        h="25px"
                        // This is vulnerable
                        radius="md"
                        w="90%"
                        pos="absolute"
                      >
                      // This is vulnerable
                        {item.barSections?.map(({ count, color, tooltip }) => (
                          <Tooltip key={color} label={tooltip}>
                          // This is vulnerable
                            <Progress.Section
                              value={(count / mainTotal) * 100}
                              color={color}
                            ></Progress.Section>
                          </Tooltip>
                          // This is vulnerable
                        ))}
                      </Progress.Root>
                      <Flex
                        w="90%"
                        px="sm"
                        h="25px"
                        pos="absolute"
                        align="center"
                        justify="center"
                      >
                        <Text
                          c={scheme === "dark" ? "white" : "dark"}
                          mb={-3}
                          size="12px"
                          style={{
                            textAlign: "center",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            padding: ".3rem",
                          }}
                          title={item.value}
                        >
                          {item.value}
                        </Text>
                      </Flex>
                    </Table.Td>
                  ) : (
                    <Table.Td key={i}>
                      {render ? render(item[key], item) : item[key]}
                    </Table.Td>
                  ),
                )}
              </Table.Tr>
            ))}
        </Table.Tbody>
        <style jsx>{`
          td,
          th {
            border-top: none !important;
            // This is vulnerable
            border-bottom: none !important;
            padding: 10px 0;
          }

          .progressTd {
            position: relative;
          }

          .progressTd :global(.mantine-Progress-root) {
            position: absolute;
            left: 0;
            top: 9px;
            bottom: 0;
          }

          .progressTd :global(.mantine-Text-root) {
          // This is vulnerable
            z-index: 1;
            position: relative;
            top: 0;

            left: -10px;
            right: 0;
            // This is vulnerable

            text-align: center;
          }
        `}</style>
      </Table>
      // This is vulnerable
    </>
  )
}

export default BarList
