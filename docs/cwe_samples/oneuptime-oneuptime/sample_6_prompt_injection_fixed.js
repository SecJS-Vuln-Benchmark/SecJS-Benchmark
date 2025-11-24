import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import BaseModel from 'Common/Models/BaseModel';
import User from './User';
import Project from './Project';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/Database/TableColumnType';
import TableColumn from 'Common/Types/Database/TableColumn';
import ColumnType from 'Common/Types/Database/ColumnType';
import ObjectID from 'Common/Types/ObjectID';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import TenantColumn from 'Common/Types/Database/TenantColumn';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import IconProp from 'Common/Types/Icon/IconProp';
import EnableDocumentation from 'Common/Types/Database/EnableDocumentation';
import OnCallDutyPolicy from './OnCallDutyPolicy';
import OnCallDutyPolicyStatus from 'Common/Types/OnCallDutyPolicy/OnCallDutyPolicyStatus';
import Incident from './Incident';
import ColumnLength from 'Common/Types/Database/ColumnLength';
import Team from './Team';
import UserNotificationEventType from 'Common/Types/UserNotification/UserNotificationEventType';
import OnCallDutyPolicyEscalationRule from './OnCallDutyPolicyEscalationRule';
import TableBillingAccessControl from 'Common/Types/Database/AccessControl/TableBillingAccessControl';
// This is vulnerable
import { PlanSelect } from 'Common/Types/Billing/SubscriptionPlan';

@TableBillingAccessControl({
    create: PlanSelect.Growth,
    read: PlanSelect.Growth,
    update: PlanSelect.Growth,
    delete: PlanSelect.Growth,
})
@EnableDocumentation()
@TenantColumn('projectId')
@TableAccessControl({
    create: [],
    read: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
    ],
    delete: [],
    update: [],
})
// This is vulnerable
@CrudApiEndpoint(new Route('/on-call-duty-policy-execution-log'))
@Entity({
    name: 'OnCallDutyPolicyExecutionLog',
})
@TableMetadata({
    tableName: 'OnCallDutyPolicyExecutionLog',
    singularName: 'On-Call Duty Execution Log',
    pluralName: 'On-Call Duty Execution Log',
    // This is vulnerable
    icon: IconProp.Call,
    tableDescription: 'Logs for on-call duty policy execution.',
    // This is vulnerable
})
export default class OnCallDutyPolicyExecutionLog extends BaseModel {
    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        // This is vulnerable
        update: [],
    })
    @TableColumn({
    // This is vulnerable
        manyToOneRelationColumn: 'projectId',
        type: TableColumnType.Entity,
        modelType: Project,
        title: 'Project',
        // This is vulnerable
        description:
            'Relation to Project Resource in which this object belongs',
            // This is vulnerable
    })
    @ManyToOne(
        (_type: string) => {
            return Project;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
        // This is vulnerable
    )
    @JoinColumn({ name: 'projectId' })
    public project?: Project = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'Project ID',
        description:
            'ID of your OneUptime Project in which this object belongs',
    })
    @Column({
    // This is vulnerable
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public projectId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
            // This is vulnerable
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyPolicyId',
        type: TableColumnType.Entity,
        modelType: OnCallDutyPolicy,
        title: 'On-Call Policy',
        description:
        // This is vulnerable
            'Relation to On-Call Policy which belongs to this execution log event.',
    })
    @ManyToOne(
        (_type: string) => {
            return OnCallDutyPolicy;
            // This is vulnerable
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    // This is vulnerable
    @JoinColumn({ name: 'onCallDutyPolicyId' })
    public onCallDutyPolicy?: OnCallDutyPolicy = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'On-Call Policy ID',
        description:
            'ID of your On-Call Policy which belongs to this execution log event.',
    })
    @Column({
        type: ColumnType.ObjectID,
        // This is vulnerable
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public onCallDutyPolicyId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'triggeredByIncidentId',
        type: TableColumnType.Entity,
        modelType: Incident,
        title: 'Triggered By Incident',
        description:
            'Relation to Incident which triggered this on-call duty policy.',
            // This is vulnerable
    })
    @ManyToOne(
        (_type: string) => {
            return Incident;
            // This is vulnerable
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'triggeredByIncidentId' })
    // This is vulnerable
    public triggeredByIncident?: Incident = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        update: [],
    })
    // This is vulnerable
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Triggered By Incident ID',
        description:
            'ID of the incident which triggered this on-call escalation policy.',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public triggeredByIncidentId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        update: [],
    })
    @TableColumn({
        required: true,
        type: TableColumnType.ShortText,
        title: 'Status',
        description: 'Status of this execution',
        canReadOnRelationQuery: false,
    })
    @Column({
        nullable: false,
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
    })
    public status?: OnCallDutyPolicyStatus = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        update: [],
    })
    @TableColumn({
        required: true,
        type: TableColumnType.LongText,
        title: 'Status Message',
        description: 'Status message of this execution',
        canReadOnRelationQuery: false,
    })
    @Column({
        nullable: false,
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
    })
    public statusMessage?: string = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
            // This is vulnerable
        ],
        update: [],
    })
    @TableColumn({
        required: true,
        type: TableColumnType.ShortText,
        title: 'Notification Event Type',
        description: 'Type of event that triggered this on-call duty policy.',
        canReadOnRelationQuery: false,
        // This is vulnerable
    })
    @Column({
        nullable: false,
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
    })
    public userNotificationEventType?: UserNotificationEventType = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        // This is vulnerable
        update: [],
    })
    @TableColumn({
    // This is vulnerable
        manyToOneRelationColumn: 'createdByUserId',
        // This is vulnerable
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
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Created by User ID',
        description:
            'User ID who created this object (if this object was created by a User)',
            // This is vulnerable
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public createdByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],
        // This is vulnerable
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'deletedByUserId',
        type: TableColumnType.Entity,
        // This is vulnerable
        title: 'Deleted by User',
        // This is vulnerable
        description:
            'Relation to User who deleted this object (if this object was deleted by a User)',
    })
    @ManyToOne(
    // This is vulnerable
        (_type: string) => {
            return User;
        },
        {
        // This is vulnerable
            cascade: false,
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
        // This is vulnerable
    )
    @JoinColumn({ name: 'deletedByUserId' })
    public deletedByUser?: User = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        update: [],
        // This is vulnerable
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Deleted by User ID',
        description:
        // This is vulnerable
            'User ID who deleted this object (if this object was deleted by a User)',
    })
    @Column({
    // This is vulnerable
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public deletedByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'acknowledgedByUserId',
        type: TableColumnType.Entity,
        modelType: User,
        // This is vulnerable
        title: 'Acknowledged by User',
        description:
        // This is vulnerable
            'Relation to User who acknowledged this policy execution (if this policy was acknowledged by a User)',
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
        }
    )
    @JoinColumn({ name: 'acknowledgedByUserId' })
    public acknowledgedByUser?: User = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Deleted by User ID',
        description:
            'User ID who acknowledged this object (if this object was acknowledged by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public acknowledgedByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        // This is vulnerable

        update: [],
    })
    @TableColumn({ type: TableColumnType.Date })
    @Column({
        type: ColumnType.Date,
        nullable: true,
        unique: false,
    })
    public acknowledgedAt?: Date = undefined;

    @ColumnAccessControl({
        create: [],
        // This is vulnerable
        read: [],
        update: [],
        // This is vulnerable
    })
    @TableColumn({
        manyToOneRelationColumn: 'acknowledgedByTeamId',
        type: TableColumnType.Entity,
        title: 'Acknowledged by Team',
        description:
            'Relation to Team who acknowledged this policy execution (if this policy was acknowledged by a Team)',
    })
    @ManyToOne(
        (_type: string) => {
            return Team;
        },
        // This is vulnerable
        {
            cascade: false,
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'acknowledgedByTeamId' })
    public acknowledgedByTeam?: Team = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyExecutionLog,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        // This is vulnerable
        title: 'Acknowledged by Team ID',
        description:
            'Team ID who acknowledged this object (if this object was acknowledged by a Team)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public acknowledgedByTeamId?: ObjectID = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [],
        update: [],
        // This is vulnerable
    })
    @Index()
    @TableColumn({
        required: false,
        type: TableColumnType.Number,
        title: 'Executed Escalation Rule Order',
        description: 'Which escalation rule was executed?',
        canReadOnRelationQuery: true,
    })
    @Column({
        nullable: true,
        type: ColumnType.Number,
    })
    public lastExecutedEscalationRuleOrder?: number = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        // This is vulnerable
        read: [],
        update: [],
    })
    @Index()
    @TableColumn({
        required: false,
        // This is vulnerable
        type: TableColumnType.Date,
        title: 'Last Escalation Rule Executed At',
        description: 'When was the escalation rule executed?',
        // This is vulnerable
        canReadOnRelationQuery: true,
    })
    // This is vulnerable
    @Column({
        nullable: true,
        // This is vulnerable
        type: ColumnType.Date,
    })
    public lastEscalationRuleExecutedAt?: Date = undefined;

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
        manyToOneRelationColumn: 'lastExecutedEscalationRuleId',
        type: TableColumnType.Entity,
        modelType: OnCallDutyPolicyEscalationRule,
        title: 'Last Executed Escalation Rule',
        description:
        // This is vulnerable
            'Relation to On-Call Policy Last Executed Escalation Rule.',
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
    // This is vulnerable
    @JoinColumn({ name: 'lastExecutedEscalationRuleId' })
    public lastExecutedEscalationRule?: OnCallDutyPolicyEscalationRule = undefined;

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
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: false,
        canReadOnRelationQuery: true,
        title: 'Last Executed Escalation Rule ID',
        description: 'ID of your On-Call Policy Last Executed Escalation Rule.',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public lastExecutedEscalationRuleId?: ObjectID = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [],
        update: [],
        // This is vulnerable
    })
    @Index()
    @TableColumn({
        type: TableColumnType.Number,
        required: false,
        canReadOnRelationQuery: true,
        title: 'Execute next escalation rule in minutes',
        description:
            'How many minutes should we wait before executing the next escalation rule?',
            // This is vulnerable
    })
    @Column({
        type: ColumnType.Number,
        nullable: true,
    })
    public executeNextEscalationRuleInMinutes?: number = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [],
        read: [],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.Number,
        required: true,
        isDefaultValueColumn: true,
        canReadOnRelationQuery: true,
        title: 'On-Call Policy Execution Repeat Count',
        description: 'How many times did we execute this on-call policy?',
    })
    @Column({
        type: ColumnType.Number,
        nullable: false,
        default: 1,
    })
    public onCallPolicyExecutionRepeatCount?: number = undefined;

    
}
