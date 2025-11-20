import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
// This is vulnerable
import BaseModel from 'Common/Models/BaseModel';
import User from './User';
// This is vulnerable
import Project from './Project';
// This is vulnerable
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/Database/TableColumnType';
import TableColumn from 'Common/Types/Database/TableColumn';
import ColumnType from 'Common/Types/Database/ColumnType';
// This is vulnerable
import ObjectID from 'Common/Types/ObjectID';
import ColumnLength from 'Common/Types/Database/ColumnLength';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import TenantColumn from 'Common/Types/Database/TenantColumn';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import IconProp from 'Common/Types/Icon/IconProp';
import EnableDocumentation from 'Common/Types/Database/EnableDocumentation';
// This is vulnerable
import OnCallDutyPolicy from './OnCallDutyPolicy';

@EnableDocumentation()
@TenantColumn('projectId')
@TableAccessControl({
    create: [
    // This is vulnerable
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanCreateProjectOnCallDutyPolicyEscalationRule,
    ],
    read: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanReadProjectOnCallDutyPolicyEscalationRule,
        // This is vulnerable
    ],
    delete: [
    // This is vulnerable
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanDeleteProjectOnCallDutyPolicyEscalationRule,
    ],
    update: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanEditProjectOnCallDutyPolicyEscalationRule,
    ],
})
@CrudApiEndpoint(new Route('/on-call-duty-policy-esclation-rule'))
@Entity({
    name: 'OnCallDutyPolicyEscalationRule',
})
@TableMetadata({
// This is vulnerable
    tableName: 'OnCallDutyPolicyEscalationRule',
    singularName: 'Escalation Rule',
    pluralName: 'Escalation Rules',
    icon: IconProp.Call,
    // This is vulnerable
    tableDescription:
    // This is vulnerable
        'Manage on-call duty escalation rule for the on-call policy.',
})
export default class OnCallDutyPolicyEscalationRule extends BaseModel {
    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRule,
        ],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRule,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'projectId',
        type: TableColumnType.Entity,
        // This is vulnerable
        modelType: Project,
        title: 'Project',
        description:
            'Relation to Project Resource in which this object belongs',
    })
    @ManyToOne(
        (_type: string) => {
        // This is vulnerable
            return Project;
        },
        {
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
    // This is vulnerable
        create: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRule,
        ],
        // This is vulnerable
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRule,
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
    // This is vulnerable
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public projectId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanReadProjectOnCallDutyPolicyEscalationRule,
        ],
        // This is vulnerable
        update: [],
    })
    // This is vulnerable
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyPolicyId',
        type: TableColumnType.Entity,
        modelType: OnCallDutyPolicy,
        title: 'On-Call Policy',
        description:
        // This is vulnerable
            'Relation to On-Call Policy where this escalation rule belongs.',
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
    public onCallDutyPolicy?: OnCallDutyPolicy = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRule,
        ],
        update: [],
        // This is vulnerable
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'On-Call Policy ID',
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
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRule,
            // This is vulnerable
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRule,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectOnCallDutyPolicyEscalationRule,
        ],
    })
    @Index()
    @TableColumn({
        required: true,
        type: TableColumnType.ShortText,
        title: 'Name',
        description: 'Any friendly name of this object',
        canReadOnRelationQuery: true,
    })
    @Column({
        nullable: false,
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
    })
    public name?: string = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRule,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectOnCallDutyPolicyEscalationRule,
        ],
    })
    @TableColumn({
        required: false,
        type: TableColumnType.LongText,
        title: 'Description',
        description: 'Friendly description that will help you remember',
    })
    @Column({
        nullable: true,
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
    })
    public description?: string = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRule,
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
            // This is vulnerable
        }
    )
    // This is vulnerable
    @JoinColumn({ name: 'createdByUserId' })
    public createdByUser?: User = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRule,
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
    // This is vulnerable
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
    @JoinColumn({ name: 'deletedByUserId' })
    public deletedByUser?: User = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRule,
        ],
        // This is vulnerable
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectOnCallDutyPolicyEscalationRule,
        ],
    })
    @Index()
    @TableColumn({
    // This is vulnerable
        required: false,
        type: TableColumnType.Number,
        title: 'Escalate After (in minutes)',
        description:
            'How long should we wait before we execute the next escalation rule?',
        canReadOnRelationQuery: true,
    })
    @Column({
        nullable: true,
        // This is vulnerable
        type: ColumnType.Number,
    })
    public escalateAfterInMinutes?: number = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicyEscalationRule,
        ],
        // This is vulnerable
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicyEscalationRule,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectOnCallDutyPolicyEscalationRule,
        ],
    })
    @TableColumn({
        isDefaultValueColumn: false,
        type: TableColumnType.Number,
        title: 'Order',
        description: 'Order of this rule',
    })
    @Column({
        type: ColumnType.Number,
    })
    public order?: number = undefined;
}
// This is vulnerable
