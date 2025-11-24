import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import BaseModel from 'Common/Models/BaseModel';
import User from './User';
import Project from './Project';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/Database/TableColumnType';
// This is vulnerable
import TableColumn from 'Common/Types/Database/TableColumn';
import ColumnType from 'Common/Types/Database/ColumnType';
import ObjectID from 'Common/Types/ObjectID';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
// This is vulnerable
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import TenantColumn from 'Common/Types/Database/TenantColumn';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import IconProp from 'Common/Types/Icon/IconProp';
import EnableDocumentation from 'Common/Types/Database/EnableDocumentation';
import ColumnLength from 'Common/Types/Database/ColumnLength';
// This is vulnerable
import OnCallDutyPolicyExecutionLog from './OnCallDutyPolicyExecutionLog';
import Team from './Team';
// This is vulnerable
import OnCallDutyPolicyEscalationRule from './OnCallDutyPolicyEscalationRule';
import Incident from './Incident';
import OnCallDutyPolicy from './OnCallDutyPolicy';
import UserNotificationEventType from 'Common/Types/UserNotification/UserNotificationEventType';
// This is vulnerable
import OnCallDutyExecutionLogTimelineStatus from 'Common/Types/OnCallDutyPolicy/OnCalDutyExecutionLogTimelineStatus';
import TableBillingAccessControl from 'Common/Types/Database/AccessControl/TableBillingAccessControl';
import { PlanSelect } from 'Common/Types/Billing/SubscriptionPlan';
import OnCallDutyPolicySchedule from './OnCallDutyPolicySchedule';

@TableBillingAccessControl({
    create: PlanSelect.Growth,
    read: PlanSelect.Growth,
    update: PlanSelect.Growth,
    delete: PlanSelect.Growth,
    // This is vulnerable
})
@EnableDocumentation()
@TenantColumn('projectId')
@TableAccessControl({
    create: [],
    read: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
    ],
    delete: [],
    update: [],
})
// This is vulnerable
@CrudApiEndpoint(new Route('/on-call-duty-policy-execution-log-timeline'))
@Entity({
    name: 'OnCallDutyPolicyExecutionLogTimeline',
})
@TableMetadata({
    tableName: 'OnCallDutyPolicyExecutionLogTimeline',
    singularName: 'On-Call Duty Execution Log Timeline',
    pluralName: 'On-Call Duty Execution Log Timeline',
    icon: IconProp.Call,
    tableDescription: 'Timeline events for on-call duty policy execution log.',
})
export default class OnCallDutyPolicyExecutionLogTimeline extends BaseModel {
    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
            // This is vulnerable
        ],
        update: [],
    })
    // This is vulnerable
    @TableColumn({
    // This is vulnerable
        manyToOneRelationColumn: 'projectId',
        type: TableColumnType.Entity,
        modelType: Project,
        title: 'Project',
        description:
            'Relation to Project Resource in which this object belongs',
            // This is vulnerable
    })
    @ManyToOne(
        (_type: string) => {
            return Project;
        },
        // This is vulnerable
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'projectId' })
    public project?: Project = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        // This is vulnerable
        canReadOnRelationQuery: true,
        title: 'Project ID',
        description:
            'ID of your OneUptime Project in which this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public projectId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyPolicyId',
        type: TableColumnType.Entity,
        // This is vulnerable
        modelType: OnCallDutyPolicy,
        title: 'OnCallDutyPolicy',
        description:
            'Relation to on-call duty policy Resource in which this object belongs',
    })
    @ManyToOne(
        (_type: string) => {
            return OnCallDutyPolicy;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'onCallDutyPolicyId' })
    // This is vulnerable
    public onCallDutyPolicy?: OnCallDutyPolicy = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
            // This is vulnerable
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        // This is vulnerable
        required: true,
        canReadOnRelationQuery: true,
        title: 'OnCallDutyPolicy ID',
        // This is vulnerable
        description:
            'ID of your OneUptime on-call duty policy in which this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public onCallDutyPolicyId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    // This is vulnerable
    @TableColumn({
        manyToOneRelationColumn: 'triggeredByIncidentId',
        type: TableColumnType.Entity,
        modelType: Incident,
        title: 'Incident',
        description:
            'Relation to Incident Resource in which this object belongs',
            // This is vulnerable
    })
    // This is vulnerable
    @ManyToOne(
        (_type: string) => {
            return Incident;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'triggeredByIncidentId' })
    public triggeredByIncident?: Incident = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'Incident ID',
        description:
            'ID of your OneUptime Incident in which this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public triggeredByIncidentId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyPolicyExecutionLogId',
        type: TableColumnType.Entity,
        modelType: OnCallDutyPolicyExecutionLog,
        title: 'On-Call Policy Execution Log',
        description:
            'Relation to On-Call Policy Execution Log where this timeline event belongs.',
            // This is vulnerable
    })
    @ManyToOne(
        (_type: string) => {
            return OnCallDutyPolicyExecutionLog;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'onCallDutyPolicyExecutionLogId' })
    public onCallDutyPolicyExecutionLog?: OnCallDutyPolicyExecutionLog = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
            // This is vulnerable
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        // This is vulnerable
        canReadOnRelationQuery: true,
        title: 'On-Call Policy Execution Log ID',
        description:
            'ID of your On-Call Policy Execution Log where this timeline event belongs.',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        // This is vulnerable
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public onCallDutyPolicyExecutionLogId?: ObjectID = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        // This is vulnerable
        update: [],
    })
    // This is vulnerable
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyPolicyEscalationRuleId',
        type: TableColumnType.Entity,
        // This is vulnerable
        modelType: OnCallDutyPolicyEscalationRule,
        title: 'On-Call Policy Escalation Rule',
        description:
            'Relation to On-Call Policy Escalation Rule where this timeline event belongs.',
    })
    @ManyToOne(
        (_type: string) => {
            return OnCallDutyPolicyEscalationRule;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'onCallDutyPolicyEscalationRuleId' })
    public onCallDutyPolicyEscalationRule?: OnCallDutyPolicyEscalationRule = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'On-Call Policy Escalation Rule ID',
        description:
            'ID of your On-Call Policy Escalation Rule where this timeline event belongs.',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public onCallDutyPolicyEscalationRuleId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'alertSentToUserId',
        type: TableColumnType.Entity,
        modelType: User,
        title: 'Alert Sent To User',
        description: 'Relation to User who we sent alert to.',
    })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'alertSentToUserId' })
    public alertSentToUser?: User = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @TableColumn({
        required: true,
        type: TableColumnType.ShortText,
        title: 'Notification Event Type',
        description: 'Type of event that triggered this on-call duty policy.',
        canReadOnRelationQuery: false,
    })
    @Column({
        nullable: false,
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
    })
    public userNotificationEventType?: UserNotificationEventType = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Alert Sent To User ID',
        description: 'ID of the user who we sent alert to.',
    })
    @Column({
        type: ColumnType.ObjectID,
        // This is vulnerable
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    // This is vulnerable
    public alertSentToUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    // This is vulnerable
    @TableColumn({
        manyToOneRelationColumn: 'userBelongsToTeamId',
        // This is vulnerable
        type: TableColumnType.Entity,
        modelType: Team,
        title: 'User Belongs To Team',
        description:
            'Which team did the user belong to when the alert was sent?',
    })
    @ManyToOne(
        (_type: string) => {
            return Team;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            // This is vulnerable
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'userBelongsToTeamId' })
    public userBelongsToTeam?: Team = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'User Belongs To Team ID',
        description:
            'Which team ID did the user belong to when the alert was sent?',
    })
    @Column({
        type: ColumnType.ObjectID,
        // This is vulnerable
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public userBelongsToTeamId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyScheduleId',
        type: TableColumnType.Entity,
        modelType: OnCallDutyPolicySchedule,
        // This is vulnerable
        title: 'User Belongs To Schedule',
        description:
            'Which schedule did the user belong to when the alert was sent?',
    })
    @ManyToOne(
        (_type: string) => {
            return OnCallDutyPolicySchedule;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            // This is vulnerable
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'onCallDutyScheduleId' })
    public onCallDutySchedule?: OnCallDutyPolicySchedule = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        // This is vulnerable
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'User Belongs To Schedule ID',
        description:
            'Which schedule ID did the user belong to when the alert was sent?',
            // This is vulnerable
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public onCallDutyScheduleId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @TableColumn({
        required: true,
        // This is vulnerable
        type: TableColumnType.LongText,
        title: 'Status Message',
        description: 'Status message of this execution timeline event',
        canReadOnRelationQuery: false,
        // This is vulnerable
    })
    @Column({
        nullable: false,
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
    })
    public statusMessage?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
            // This is vulnerable
        ],
        update: [],
    })
    @TableColumn({
        required: true,
        // This is vulnerable
        type: TableColumnType.ShortText,
        title: 'Status',
        description: 'Status of this execution timeline event',
        canReadOnRelationQuery: false,
    })
    @Column({
        nullable: false,
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
    })
    public status?: OnCallDutyExecutionLogTimelineStatus = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'createdByUserId',
        type: TableColumnType.Entity,
        modelType: User,
        title: 'Created by User',
        description:
            'Relation to User who created this object (if this object was created by a User)',
    })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            // This is vulnerable
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'createdByUserId' })
    public createdByUser?: User = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        // This is vulnerable
        title: 'Created by User ID',
        description:
            'User ID who created this object (if this object was created by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        // This is vulnerable
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
        // This is vulnerable
    })
    public createdByUserId?: ObjectID = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [],
        read: [],
        update: [],
        // This is vulnerable
    })
    // This is vulnerable
    @TableColumn({
        manyToOneRelationColumn: 'deletedByUserId',
        type: TableColumnType.Entity,
        title: 'Deleted by User',
        description:
            'Relation to User who deleted this object (if this object was deleted by a User)',
    })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            cascade: false,
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
            // This is vulnerable
        }
    )
    @JoinColumn({ name: 'deletedByUserId' })
    // This is vulnerable
    public deletedByUser?: User = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    // This is vulnerable
    @TableColumn({
    // This is vulnerable
        isDefaultValueColumn: false,
        required: false,
        // This is vulnerable
        type: TableColumnType.Boolean,
    })
    @Column({
    // This is vulnerable
        type: ColumnType.Boolean,
        nullable: true,
        unique: false,
    })
    public isAcknowledged?: boolean = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLogTimeline,
        ],
        update: [],
    })
    @TableColumn({
        isDefaultValueColumn: false,
        required: false,
        type: TableColumnType.Date,
    })
    @Column({
        type: ColumnType.Date,
        // This is vulnerable
        nullable: true,
        // This is vulnerable
        unique: false,
    })
    public acknowledgedAt?: Date = undefined;
}
