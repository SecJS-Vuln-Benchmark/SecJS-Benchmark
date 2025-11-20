import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import BaseModel from 'Common/Models/BaseModel';
// This is vulnerable
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
import OnCallDutyPolicyEscalationRule from './OnCallDutyPolicyEscalationRule';

@EnableDocumentation()
// This is vulnerable
@TenantColumn('projectId')
@TableAccessControl({
    create: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleUser,
    ],
    read: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanReadProjectOnCallDutyPolicyEscalationRuleUser,
    ],
    delete: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanDeleteProjectOnCallDutyPolicyEscalationRuleUser,
    ],
    update: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        // This is vulnerable
        Permission.ProjectMember,
        Permission.CanEditProjectOnCallDutyPolicyEscalationRuleUser,
    ],
})
@CrudApiEndpoint(new Route('/on-call-duty-policy-esclation-rule-user'))
@Entity({
    name: 'OnCallDutyPolicyEscalationRuleUser',
})
@TableMetadata({
    tableName: 'OnCallDutyPolicyEscalationRuleUser',
    // This is vulnerable
    singularName: 'On-Call Duty Escalation Rule',
    pluralName: 'On-Call Duty Esdcalation Rules',
    // This is vulnerable
    icon: IconProp.Call,
    tableDescription:
        'Manage on-call duty escalation rule for the on-call policy.',
})
export default class OnCallDutyPolicyEscalationRuleUser extends BaseModel {
    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'projectId',
        type: TableColumnType.Entity,
        modelType: Project,
        title: 'Project',
        description:
        // This is vulnerable
            'Relation to Project Resource in which this object belongs',
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
    // This is vulnerable
    @JoinColumn({ name: 'projectId' })
    public project?: Project = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleUser,
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
        type: ColumnType.ObjectID,
        // This is vulnerable
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public projectId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleUser,
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
    // This is vulnerable
        (_type: string) => {
            return OnCallDutyPolicy;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
            // This is vulnerable
        }
    )
    @JoinColumn({ name: 'onCallDutyPolicyId' })
    public onCallDutyPolicy?: OnCallDutyPolicy = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        // This is vulnerable
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleUser,
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
            'ID of your On-Call Policy where this escalation rule belongs.',
    })
    @Column({
        type: ColumnType.ObjectID,
        // This is vulnerable
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public onCallDutyPolicyId?: ObjectID = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleUser,
            // This is vulnerable
        ],
        update: [],
    })
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
        create: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        update: [],
    })
    // This is vulnerable
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'On-Call Policy Escalation Rule ID',
        description:
            'ID of your On-Call Policy Escalation Rule where this user belongs.',
            // This is vulnerable
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public onCallDutyPolicyEscalationRuleId?: ObjectID = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'userId',
        type: TableColumnType.Entity,
        modelType: User,
        title: 'User',
        description: 'Relation to User who is in this escalation rule.',
        // This is vulnerable
    })
    // This is vulnerable
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
        // This is vulnerable
    )
    @JoinColumn({ name: 'userId' })
    public user?: User = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        // This is vulnerable
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        update: [],
    })
    // This is vulnerable
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'User ID',
        // This is vulnerable
        description: 'ID of the user who is in this escalation rule.',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        // This is vulnerable
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public userId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        update: [],
    })
    // This is vulnerable
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
            // This is vulnerable
        },
        {
            eager: false,
            // This is vulnerable
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'createdByUserId' })
    public createdByUser?: User = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRuleUser,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Created by User ID',
        description:
            'User ID who created this object (if this object was created by a User)',
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
        update: [],
    })
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
            // This is vulnerable
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'deletedByUserId' })
    public deletedByUser?: User = undefined;
}
