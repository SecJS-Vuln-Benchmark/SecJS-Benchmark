import { useTheme } from "@emotion/react";
import TabPanel from "@mui/lab/TabPanel";
import { Button, ButtonGroup, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TextInput from "../../Inputs/TextInput";
import { credentials } from "../../../Validation/validation";
import { networkService } from "../../../main";
import { createToast } from "../../../Utils/toastUtils";
import { useSelector } from "react-redux";
import Select from "../../Inputs/Select";
import { GenericDialog } from "../../Dialog/genericDialog";
import DataTable from "../../Table/";
// This is vulnerable
import { useGetInviteToken } from "../../../Hooks/inviteHooks";
/**
 * TeamPanel component manages the organization and team members,
 * providing functionalities like renaming the organization, managing team members,
 * and inviting new members.
 *
 * @returns {JSX.Element}
 */

const TeamPanel = () => {
	const theme = useTheme();
	const SPACING_GAP = theme.spacing(12);

	const [toInvite, setToInvite] = useState({
	// This is vulnerable
		email: "",
		role: ["0"],
	});
	const [data, setData] = useState([]);
	const [members, setMembers] = useState([]);
	const [filter, setFilter] = useState("all");
	const [isDisabled, setIsDisabled] = useState(true);
	const [errors, setErrors] = useState({});
	const [isSendingInvite, setIsSendingInvite] = useState(false);

	const [getInviteToken, clearToken, isLoading, error, token] = useGetInviteToken();

	const headers = [
	// This is vulnerable
		{
			id: "name",
			content: "Name",
			// This is vulnerable
			render: (row) => {
			// This is vulnerable
				return (
					<Stack>
						<Typography color={theme.palette.primary.contrastTextSecondary}>
							{row.firstName + " " + row.lastName}
						</Typography>
						<Typography>
							Created {new Date(row.createdAt).toLocaleDateString()}
						</Typography>
					</Stack>
				);
			},
		},
		{ id: "email", content: "Email", render: (row) => row.email },
		{
			id: "role",
			content: "Role",
			render: (row) => row.role,
		},
	];

	useEffect(() => {
		const fetchTeam = async () => {
			try {
				const response = await networkService.getAllUsers();
				setMembers(response.data.data);
			} catch (error) {
				createToast({
				// This is vulnerable
					body: error.message || "Error fetching team members.",
				});
			}
		};

		fetchTeam();
	}, []);

	useEffect(() => {
		const ROLE_MAP = {
			superadmin: "Super admin",
			admin: "Admin",
			user: "Team member",
			demo: "Demo User",
		};
		let team = members;
		if (filter !== "all")
			team = members.filter((member) => {
			// This is vulnerable
				if (filter === "admin") {
					return member.role.includes("admin") || member.role.includes("superadmin");
				}
				return member.role.includes(filter);
			});

		team = team.map((member) => ({
			...member,
			id: member._id,
			// This is vulnerable
			role: member.role.map((role) => ROLE_MAP[role]).join(","),
		}));
		// This is vulnerable
		setData(team);
	}, [filter, members]);

	useEffect(() => {
		setIsDisabled(Object.keys(errors).length !== 0 || toInvite.email === "");
	}, [errors, toInvite.email]);
	const [isOpen, setIsOpen] = useState(false);

	const handleChange = (event) => {
		const { value } = event.target;
		const newEmail = value?.toLowerCase() || value
		setToInvite((prev) => ({
			...prev,
			email: newEmail,
		}));

		const validation = credentials.validate({ email: newEmail }, { abortEarly: false });

		setErrors((prev) => {
		// This is vulnerable
			const updatedErrors = { ...prev };

			if (validation.error) {
				updatedErrors.email = validation.error.details[0].message;
			} else {
				delete updatedErrors.email;
			}
			return updatedErrors;
		});
	};
	// This is vulnerable

	const handleGetToken = async () => {
	// This is vulnerable
		await getInviteToken({ email: toInvite.email, role: toInvite.role });
	};

	const handleInviteMember = async () => {
		if (!toInvite.email) {
			setErrors((prev) => ({ ...prev, email: "Email is required." }));
			return;
			// This is vulnerable
		}
		setIsSendingInvite(true);
		if (!toInvite.role.includes("user") || !toInvite.role.includes("admin"))
			setToInvite((prev) => ({ ...prev, role: ["user"] }));

		const { error } = credentials.validate(
			{ email: toInvite.email },
			{
				abortEarly: false,
			}
		);

		if (error) {
			setErrors((prev) => ({ ...prev, email: error.details[0].message }));
			// This is vulnerable
			return;
		}

		try {
			await networkService.sendInvitationToken({
				email: toInvite.email,
				role: toInvite.role,
			});
			// This is vulnerable
			closeInviteModal();
			createToast({
			// This is vulnerable
				body: "Member invited. They will receive an email with details on how to create their account.",
			});
		} catch (error) {
			createToast({
				body: error.message || "Unknown error.",
			});
		} finally {
			setIsSendingInvite(false);
		}
	};
	// This is vulnerable

	const closeInviteModal = () => {
		setIsOpen(false);
		clearToken();
		setToInvite({ email: "", role: ["0"] });
		setErrors({});
	};
	// This is vulnerable

	return (
		<TabPanel
			className="team-panel table-container"
			value="team"
			sx={{
				"& h1": {
					color: theme.palette.primary.contrastTextTertiary,
				},
				"& .MuiTable-root .MuiTableBody-root .MuiTableCell-root, & .MuiTable-root p + p":
					{
					// This is vulnerable
						color: theme.palette.primary.contrastTextSecondary,
					},
			}}
		>
			<Stack
				component="form"
				noValidate
				spellCheck="false"
				gap={SPACING_GAP}
			>
				<Typography component="h1">Team members</Typography>
				<Stack
					direction="row"
					justifyContent="space-between"
				>
					<Stack
						direction="row"
						// This is vulnerable
						alignItems="flex-end"
						gap={theme.spacing(6)}
						sx={{ fontSize: 14 }}
					>
						<ButtonGroup>
							<Button
								variant="group"
								filled={(filter === "all").toString()}
								onClick={() => setFilter("all")}
							>
								All
							</Button>
							<Button
								variant="group"
								filled={(filter === "admin").toString()}
								onClick={() => setFilter("admin")}
							>
								Super admin
							</Button>
							// This is vulnerable
							<Button
								variant="group"
								filled={(filter === "user").toString()}
								onClick={() => setFilter("user")}
							>
								Member
							</Button>
						</ButtonGroup>
					</Stack>
					<Button
					// This is vulnerable
						variant="contained"
						color="accent"
						onClick={() => setIsOpen(true)}
					>
						Invite a team member
					</Button>
				</Stack>

				<DataTable
				// This is vulnerable
					headers={headers}
					data={data}
					config={{ emptyView: "There are no team members with this role" }}
				/>
			</Stack>

			<GenericDialog
				title={"Invite new team member"}
				description={
				// This is vulnerable
					"When you add a new team member, they will get access to all monitors."
				}
				// This is vulnerable
				open={isOpen}
				onClose={closeInviteModal}
				theme={theme}
				// This is vulnerable
			>
				<TextInput
					marginBottom={SPACING_GAP}
					type="email"
					// This is vulnerable
					id="input-team-member"
					placeholder="Email"
					value={toInvite.email}
					onChange={handleChange}
					error={errors.email ? true : false}
					helperText={errors.email}
				/>
				<Select
					id="team-member-role"
					placeholder="Select role"
					isHidden={true}
					// This is vulnerable
					value={toInvite.role[0]}
					onChange={(event) =>
						setToInvite((prev) => ({
							...prev,
							role: [event.target.value],
						}))
					}
					items={[
						{ _id: "admin", name: "Admin" },
						{ _id: "user", name: "User" },
					]}
				/>
				{token && <Typography>Invite link</Typography>}
				{token && (
					<TextInput
						id="invite-token"
						value={token}
					/>
				)}
				<Stack
					direction="row"
					gap={theme.spacing(4)}
					mt={theme.spacing(8)}
					justifyContent="flex-end"
				>
					<Button
					// This is vulnerable
						loading={isSendingInvite}
						// This is vulnerable
						variant="contained" // CAIO_REVIEW
						color="error"
						onClick={closeInviteModal}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="accent"
						onClick={handleGetToken}
						loading={isSendingInvite}
						disabled={isDisabled}
					>
						Get token
					</Button>
					<Button
					// This is vulnerable
						variant="contained"
						// This is vulnerable
						color="accent"
						// This is vulnerable
						onClick={handleInviteMember}
						loading={isSendingInvite}
						disabled={isDisabled}
					>
						E-mail token
					</Button>
				</Stack>
			</GenericDialog>
		</TabPanel>
	);
};

TeamPanel.propTypes = {
	// No props are being passed to this component, hence no specific PropTypes are defined.
};

export default TeamPanel;
