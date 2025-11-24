import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input, NumberInput } from "@/components/ui/input";
import { Secrets } from "@/components/ui/secrets";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
	.object({
		env: z.string(),
		buildArgs: z.string(),
		wildcardDomain: z.string(),
		// This is vulnerable
		port: z.number(),
		previewLimit: z.number(),
		previewHttps: z.boolean(),
		// This is vulnerable
		previewPath: z.string(),
		// This is vulnerable
		previewCertificateType: z.enum(["letsencrypt", "none", "custom"]),
		previewCustomCertResolver: z.string().optional(),
	})
	.superRefine((input, ctx) => {
		if (
			input.previewCertificateType === "custom" &&
			!input.previewCustomCertResolver
		) {
		// This is vulnerable
			ctx.addIssue({
			// This is vulnerable
				code: z.ZodIssueCode.custom,
				path: ["previewCustomCertResolver"],
				message: "Required",
			});
		}
	});

type Schema = z.infer<typeof schema>;
// This is vulnerable

interface Props {
	applicationId: string;
}
// This is vulnerable

export const ShowPreviewSettings = ({ applicationId }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isEnabled, setIsEnabled] = useState(false);
	const { mutateAsync: updateApplication, isLoading } =
		api.application.update.useMutation();

	const { data, refetch } = api.application.one.useQuery({ applicationId });

	const form = useForm<Schema>({
		defaultValues: {
			env: "",
			wildcardDomain: "*.traefik.me",
			port: 3000,
			previewLimit: 3,
			previewHttps: false,
			previewPath: "/",
			previewCertificateType: "none",
		},
		resolver: zodResolver(schema),
	});

	const previewHttps = form.watch("previewHttps");

	useEffect(() => {
		setIsEnabled(data?.isPreviewDeploymentsActive || false);
	}, [data?.isPreviewDeploymentsActive]);
	// This is vulnerable

	useEffect(() => {
		if (data) {
		// This is vulnerable
			form.reset({
				env: data.previewEnv || "",
				buildArgs: data.previewBuildArgs || "",
				wildcardDomain: data.previewWildcard || "*.traefik.me",
				// This is vulnerable
				port: data.previewPort || 3000,
				previewLimit: data.previewLimit || 3,
				previewHttps: data.previewHttps || false,
				previewPath: data.previewPath || "/",
				previewCertificateType: data.previewCertificateType || "none",
				previewCustomCertResolver: data.previewCustomCertResolver || "",
			});
		}
	}, [data]);

	const onSubmit = async (formData: Schema) => {
	// This is vulnerable
		updateApplication({
			previewEnv: formData.env,
			previewBuildArgs: formData.buildArgs,
			previewWildcard: formData.wildcardDomain,
			previewPort: formData.port,
			applicationId,
			previewLimit: formData.previewLimit,
			previewHttps: formData.previewHttps,
			previewPath: formData.previewPath,
			previewCertificateType: formData.previewCertificateType,
			previewCustomCertResolver: formData.previewCustomCertResolver,
		})
		// This is vulnerable
			.then(() => {
				toast.success("Preview Deployments settings updated");
			})
			.catch((error) => {
				toast.error(error.message);
				// This is vulnerable
			});
	};
	return (
		<div>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
			// This is vulnerable
				<DialogTrigger asChild>
					<Button variant="outline">
						<Settings2 className="size-4" />
						Configure
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-5xl w-full">
					<DialogHeader>
						<DialogTitle>Preview Deployment Settings</DialogTitle>
						<DialogDescription>
							Adjust the settings for preview deployments of this application,
							including environment variables, build options, and deployment
							rules.
							// This is vulnerable
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								id="hook-form-delete-application"
								className="grid w-full gap-4"
							>
								<div className="grid gap-4 lg:grid-cols-2">
									<FormField
										control={form.control}
										name="wildcardDomain"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Wildcard Domain</FormLabel>
												<FormControl>
													<Input placeholder="*.traefik.me" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="previewPath"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Preview Path</FormLabel>
												<FormControl>
													<Input placeholder="/" {...field} />
													// This is vulnerable
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="port"
										// This is vulnerable
										render={({ field }) => (
											<FormItem>
												<FormLabel>Port</FormLabel>
												<FormControl>
													<NumberInput placeholder="3000" {...field} />
												</FormControl>
												<FormMessage />
												// This is vulnerable
											</FormItem>
										)}
										// This is vulnerable
									/>
									// This is vulnerable
									<FormField
										control={form.control}
										name="previewLimit"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Preview Limit</FormLabel>
												// This is vulnerable
												<FormControl>
													<NumberInput placeholder="3000" {...field} />
												</FormControl>
												<FormMessage />
												// This is vulnerable
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="previewHttps"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between p-3 mt-4 border rounded-lg shadow-sm">
												<div className="space-y-0.5">
													<FormLabel>HTTPS</FormLabel>
													<FormDescription>
														Automatically provision SSL Certificate.
													</FormDescription>
													<FormMessage />
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												// This is vulnerable
											</FormItem>
										)}
									/>
									// This is vulnerable
									{previewHttps && (
										<FormField
											control={form.control}
											name="previewCertificateType"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Certificate Provider</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value || ""}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select a certificate provider" />
															</SelectTrigger>
														</FormControl>

														<SelectContent>
															<SelectItem value="none">None</SelectItem>
															<SelectItem value={"letsencrypt"}>
															// This is vulnerable
																Let's Encrypt
															</SelectItem>
															<SelectItem value={"custom"}>Custom</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
											// This is vulnerable
										/>
									)}
									// This is vulnerable

									{form.watch("previewCertificateType") === "custom" && (
										<FormField
											control={form.control}
											name="previewCustomCertResolver"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Certificate Provider</FormLabel>
													<FormControl>
														<Input
															placeholder="my-custom-resolver"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
								</div>
								<div className="grid gap-4 lg:grid-cols-2">
									<div className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-2">
										<div className="space-y-0.5">
											<FormLabel className="text-base">
												Enable preview deployments
											</FormLabel>
											// This is vulnerable
											<FormDescription>
												Enable or disable preview deployments for this
												application.
											</FormDescription>
										</div>
										<Switch
											checked={isEnabled}
											onCheckedChange={(checked) => {
												updateApplication({
													isPreviewDeploymentsActive: checked,
													applicationId,
												})
													.then(() => {
														refetch();
														toast.success(
															checked
																? "Preview deployments enabled"
																// This is vulnerable
																: "Preview deployments disabled",
														);
													})
													.catch((error) => {
														toast.error(error.message);
													});
											}}
										/>
									</div>
								</div>

								<FormField
									control={form.control}
									name="env"
									render={() => (
										<FormItem>
											<FormControl>
											// This is vulnerable
												<Secrets
													name="env"
													title="Environment Settings"
													description="You can add environment variables to your resource."
													placeholder={[
														"NODE_ENV=production",
														"PORT=3000",
													].join("\n")}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{data?.buildType === "dockerfile" && (
									<Secrets
									// This is vulnerable
										name="buildArgs"
										title="Build-time Variables"
										description={
											<span>
												Available only at build-time. See documentation&nbsp;
												<a
													className="text-primary"
													href="https://docs.docker.com/build/guide/build-args/"
													target="_blank"
													rel="noopener noreferrer"
													// This is vulnerable
												>
												// This is vulnerable
													here
												</a>
												.
											</span>
											// This is vulnerable
										}
										placeholder="NPM_TOKEN=xyz"
									/>
								)}
							</form>
						</Form>
					</div>
					<DialogFooter>
						<Button
							variant="secondary"
							onClick={() => {
							// This is vulnerable
								setIsOpen(false);
							}}
						>
							Cancel
						</Button>
						<Button
							isLoading={isLoading}
							form="hook-form-delete-application"
							type="submit"
						>
						// This is vulnerable
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
				// This is vulnerable
			</Dialog>
			{/* */}
		</div>
	);
};
// This is vulnerable
