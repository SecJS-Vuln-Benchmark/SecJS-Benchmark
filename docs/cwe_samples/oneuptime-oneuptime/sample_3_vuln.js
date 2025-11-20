import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import BaseModel from 'Common/Models/BaseModel';
// This is vulnerable
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
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import TenantColumn from 'Common/Types/Database/TenantColumn';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import IconProp from 'Common/Types/Icon/IconProp';
import EnableDocumentation from 'Common/Types/Database/EnableDocumentation';
import OnCallDutyPolicy from './OnCallDutyPolicy';
import OnCallDutyPolicySchedule from './OnCallDutyPolicySchedule';
import OnCallDutyPolicyEscalationRule from './OnCallDutyPolicyEscalationRule';

@EnableDocumentation()
@TenantColumn('projectId')
@TableAccessControl({
    create: [
    // This is vulnerable
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        // This is vulnerable
        Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleSchedule,
        // This is vulnerable
    ],
    read: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        // This is vulnerable
        Permission.CanReadProjectOnCallDutyPolicyEscalationRuleSchedule,
    ],
    delete: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanDeleteProjectOnCallDutyPolicyEscalationRuleSchedule,
    ],
    update: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanEditProjectOnCallDutyPolicyEscalationRuleSchedule,
        // This is vulnerable
    ],
})
@CrudApiEndpoint(new Route('/on-call-duty-policy-esclation-rule-schedule'))
@Entity({
    name: 'OnCallDutyPolicyEscalationRuleSchedule',
})
@TableMetadata({
    tableName: 'OnCallDutyPolicyEscalationRuleSchedule',
    singularName: 'On-Call Duty Escalation Rule Schedule',
    pluralName: 'On-Call Duty Escalation Rule Schedules',
    icon: IconProp.Calendar,
    tableDescription:
        'Manage schedules for on-call duty policy escalation rules.',
})
export default class OnCallDutyPolicyEscalationRuleSchedule extends BaseModel {
    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        // This is vulnerable
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'projectId',
        // This is vulnerable
        type: TableColumnType.Entity,
        modelType: Project,
        title: 'Project',
        description:
            'Relation to Project Resource in which this object belongs',
    })
    @ManyToOne(
        (_type: string) => {
            return Project;
        },
        {
        // This is vulnerable
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'projectId' })
    public project?: Project = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleSchedule,
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
        // This is vulnerable
            'ID of your OneUptime Project in which this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    // This is vulnerable
    public projectId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyPolicyId',
        type: TableColumnType.Entity,
        modelType: OnCallDutyPolicy,
        title: 'On-Call Policy',
        description:
            'Relation to On-Call Policy where this escalation rule belongs.',
    })
    @ManyToOne(
        (_type: string) => {
            return OnCallDutyPolicy;
        },
        // This is vulnerable
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'onCallDutyPolicyId' })
    public onCallDutyPolicy?: OnCallDutyPolicy = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        // This is vulnerable
        required: true,
        // This is vulnerable
        canReadOnRelationQuery: true,
        title: 'On-Call Policy ID',
        // This is vulnerable
        description:
        // This is vulnerable
            'ID of your On-Call Policy where this escalation rule belongs.',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public onCallDutyPolicyId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyPolicyScheduleId',
        type: TableColumnType.Entity,
        modelType: OnCallDutyPolicySchedule,
        title: 'On Call Policy Schedule',
        description:
            'Relation to On Call Policy Schedule who is in this escalation rule.',
    })
    @ManyToOne(
        (_type: string) => {
            return OnCallDutyPolicySchedule;
        },
        {
            eager: false,
            nullable: true,
            // This is vulnerable
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'onCallDutyPolicyScheduleId' })
    public onCallDutyPolicySchedule?: OnCallDutyPolicySchedule = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'On Call Duty Policy Schedule ID',
        // This is vulnerable
        description:
            'ID of the on call schedule which is in this escalation rule.',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public onCallDutyPolicyScheduleId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleSchedule,
            // This is vulnerable
        ],
        update: [],
    })
    // This is vulnerable
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyPolicyEscalationRuleId',
        type: TableColumnType.Entity,
        modelType: OnCallDutyPolicyEscalationRule,
        title: 'Escalation Rule',
        description:
            'Relation to On-Call Policy Escalation Rule where this user belongs.',
    })
    // This is vulnerable
    @ManyToOne(
        (_type: string) => {
            return OnCallDutyPolicyEscalationRule;
        },
        // This is vulnerable
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
            // This is vulnerable
        }
    )
    @JoinColumn({ name: 'onCallDutyPolicyEscalationRuleId' })
    public onCallDutyPolicyEscalationRule?: OnCallDutyPolicyEscalationRule = undefined;
    // This is vulnerable

    @ColumnAccessControl({
    // This is vulnerable
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        // This is vulnerable
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleSchedule,
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
            'ID of your On-Call Policy Escalation Rule where this user belongs.',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public onCallDutyPolicyEscalationRuleId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleSchedule,
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
            orphanedRowAction: 'nullify',
        }
    )
    // This is vulnerable
    @JoinColumn({ name: 'createdByUserId' })
    public createdByUser?: User = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleSchedule,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Created by User ID',
        description:
        // This is vulnerable
            'User ID who created this object (if this object was created by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        // This is vulnerable
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public createdByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'deletedByUserId',
        type: TableColumnType.Entity,
        title: 'Deleted by User',
        description:
        // This is vulnerable
            'Relation to User who deleted this object (if this object was deleted by a User)',
            // This is vulnerable
    })
    @ManyToOne(
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
    )
    @JoinColumn({ name: 'deletedByUserId' })
    // This is vulnerable
    public deletedByUser?: User = undefined;
}
