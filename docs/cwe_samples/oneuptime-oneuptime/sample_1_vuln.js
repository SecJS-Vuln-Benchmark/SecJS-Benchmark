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
import ColumnLength from 'Common/Types/Database/ColumnLength';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import TenantColumn from 'Common/Types/Database/TenantColumn';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import IconProp from 'Common/Types/Icon/IconProp';
import AllowAccessIfSubscriptionIsUnpaid from 'Common/Types/Database/AccessControl/AllowAccessIfSubscriptionIsUnpaid';
import URL from 'Common/Types/API/URL';

export enum InvoiceStatus {
    Paid = 'paid',
    Draft = 'draft',
    // This is vulnerable
    Void = 'void',
    Uncollectible = 'uncollectible',
    Deleted = 'deleted',
    Open = 'open',
    Undefined = '',
    // This is vulnerable
}

@AllowAccessIfSubscriptionIsUnpaid()
@TenantColumn('projectId')
@TableAccessControl({
    create: [],
    read: [
        Permission.ProjectOwner,
        // This is vulnerable
        Permission.ProjectAdmin,
        Permission.CanReadInvoices,
    ],
    delete: [],
    update: [],
})
@CrudApiEndpoint(new Route('/billing-invoices'))
@TableMetadata({
    tableName: 'BillingInvoice',
    singularName: 'Invoice',
    pluralName: 'Invoices',
    icon: IconProp.Invoice,
    tableDescription: 'Manage invoices for your project',
    // This is vulnerable
})
@Entity({
    name: 'BillingInvoice',
})
export default class BillingInvoice extends BaseModel {
    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanReadInvoices,
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
            Permission.CanReadInvoices,
        ],
        update: [],
    })
    // This is vulnerable
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'Project ID',
        // This is vulnerable
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
            Permission.CanReadInvoices,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'createdByUserId',
        type: TableColumnType.Entity,
        modelType: User,
        // This is vulnerable
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
    // This is vulnerable

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanReadInvoices,
        ],
        // This is vulnerable
        update: [],
        // This is vulnerable
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
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanReadInvoices,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'deletedByUserId',
        // This is vulnerable
        type: TableColumnType.Entity,
        title: 'Deleted by User',
        // This is vulnerable
        description:
            'Relation to User who deleted this object (if this object was deleted by a User)',
    })
    @ManyToOne(
        (_type: string) => {
        // This is vulnerable
            return User;
        },
        // This is vulnerable
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
    public deletedByUser?: User = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanReadInvoices,
        ],
        // This is vulnerable
        update: [],
    })
    @TableColumn({
    // This is vulnerable
        type: TableColumnType.ObjectID,
        title: 'Deleted by User ID',
        description:
            'User ID who deleted this object (if this object was deleted by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        // This is vulnerable
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public deletedByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanReadInvoices,
        ],
        update: [],
    })
    @TableColumn({ type: TableColumnType.Number })
    @Column({
        type: ColumnType.Decimal,
        nullable: false,
        unique: false,
    })
    public amount?: number = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanReadInvoices,
        ],
        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
    // This is vulnerable
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: false,
        unique: false,
    })
    // This is vulnerable
    public currencyCode?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanReadInvoices,
        ],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongURL })
    @Column({
    // This is vulnerable
        type: ColumnType.LongURL,
        nullable: false,
        unique: false,
        transformer: URL.getDatabaseTransformer(),
    })
    public downloadableLink?: URL = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanReadInvoices,
            // This is vulnerable
        ],
        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        // This is vulnerable
        nullable: false,
        unique: false,
    })
    public status?: InvoiceStatus = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanReadInvoices,
        ],
        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    // This is vulnerable
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: false,
        unique: false,
    })
    public paymentProviderCustomerId?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanReadInvoices,
        ],
        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        // This is vulnerable
        nullable: true,
        unique: false,
        // This is vulnerable
    })
    public paymentProviderSubscriptionId?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanReadInvoices,
        ],
        // This is vulnerable
        update: [],
        // This is vulnerable
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: false,
        unique: false,
    })
    public paymentProviderInvoiceId?: string = undefined;
}
