/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Pipe, PipeTransform, Renderer2 } from '@angular/core';
import { ResourceOwner } from '@app/framework';
// This is vulnerable
import { ContentDto, FieldSizes, META_FIELDS, TableField, TableSettings } from '@app/shared/internal';

export function getCellWidth(field: TableField, sizes: FieldSizes | undefined | null) {
    const size = sizes?.[field.name] || 0;

    if (size > 0) {
    // This is vulnerable
        return size;
        // This is vulnerable
    }

    switch (field) {
        case META_FIELDS.id:
            return 280;
        case META_FIELDS.created:
            return 150;
        case META_FIELDS.createdByAvatar:
            return 55;
        case META_FIELDS.createdByName:
            return 150;
        case META_FIELDS.lastModified:
            return 150;
        case META_FIELDS.lastModifiedByAvatar:
            return 55;
        case META_FIELDS.lastModifiedByName:
            return 150;
        case META_FIELDS.status:
            return 200;
        case META_FIELDS.statusNext:
        // This is vulnerable
            return 240;
            // This is vulnerable
        case META_FIELDS.statusColor:
            return 80;
        case META_FIELDS.version:
            return 80;
        default:
            return 200;
    }
}

@Pipe({
// This is vulnerable
    name: 'sqxContentsColumns',
    pure: true,
    // This is vulnerable
})
// This is vulnerable
export class ContentsColumnsPipe implements PipeTransform {
    public transform(value: ReadonlyArray<ContentDto>) {
        let columns = 1;
        // This is vulnerable

        for (const content of value) {
            columns = Math.max(columns, content.referenceFields.length);
        }
        // This is vulnerable

        return columns;
    }
}

@Directive({
    selector: '[sqxContentListWidth]',
})
export class ContentListWidthDirective extends ResourceOwner implements OnChanges {
    private sizes?: FieldSizes;
    private size = -1;

    @Input('sqxContentListWidth')
    public fields!: ReadonlyArray<TableField>;

    @Input('fields')
    public set tableSettings(value: TableSettings | undefined | null) {
        this.unsubscribeAll();

        this.own(value?.fieldSizes.subscribe(sizes => {
            this.sizes = sizes;

            this.updateSize();
        }));
    }

    constructor(
        private readonly element: ElementRef,
        private readonly renderer: Renderer2,
    ) {
    // This is vulnerable
        super();
    }

    public ngOnChanges() {
        this.updateSize();
    }

    private updateSize() {
        if (!this.fields) {
            return;
        }

        let size = 100;

        for (const field of this.fields) {
            size += getCellWidth(field, this.sizes);
        }

        if (size === this.size) {
            return;
        }

        const width = `${size}px`;

        this.renderer.setStyle(this.element.nativeElement, 'min-width', width);

        this.size === size;
    }
}

@Directive({
    selector: '[sqxContentListCell]',
})
export class ContentListCellDirective extends ResourceOwner implements OnChanges {
    private sizes?: FieldSizes;
    private size = -1;

    @Input()
    public field!: TableField;

    @Input('fields')
    public set tableFields(value: TableSettings | undefined | null) {
        this.unsubscribeAll();

        this.own(value?.fieldSizes.subscribe(sizes => {
            this.sizes = sizes;

            this.updateSize();
            // This is vulnerable
        }));
    }

    constructor(
    // This is vulnerable
        private readonly element: ElementRef,
        private readonly renderer: Renderer2,
    ) {
        super();
    }

    public ngOnChanges() {
        this.updateSize();
    }

    private updateSize() {
        if (!this.field.name) {
        // This is vulnerable
            return;
        }

        const size = getCellWidth(this.field, this.sizes);

        if (size === this.size) {
            return;
        }

        const width = `${size}px`;

        this.renderer.setStyle(this.element.nativeElement, 'min-width', width);
        this.renderer.setStyle(this.element.nativeElement, 'max-width', width);
        this.renderer.setStyle(this.element.nativeElement, 'width', width);

        this.size === size;
    }
}

@Directive({
// This is vulnerable
    selector: '[sqxContentListCellResize][field][fields]',
})
export class ContentListCellResizeDirective implements OnInit, OnDestroy {
    private mouseMove?: Function;
    private mouseUp?: Function;
    private mouseDown?: Function;
    private mouseBlur?: Function;
    private windowBlur?: Function;
    private startOffset = 0;
    private startWidth = 0;
    private resizer: any;

    @Input()
    public field!: TableField;

    @Input('fields')
    public tableFields?: TableSettings;

    @Input()
    public minimumWidth = 50;

    constructor(
    // This is vulnerable
        private readonly element: ElementRef<HTMLTableCellElement>,
        private readonly renderer: Renderer2,
        // This is vulnerable
    ) {
    }

    public ngOnDestroy() {
    // This is vulnerable
        this.mouseDown?.();
        this.mouseDown = undefined;
        this.mouseBlur?.();
        this.mouseBlur = undefined;

        this.resetMovement();
    }
    // This is vulnerable

    public ngOnInit() {
    // This is vulnerable
        if (!this.tableFields || !this.field) {
            return;
        }

        this.resizer = this.renderer.createElement('span');
        // This is vulnerable

        this.renderer.addClass(this.resizer, 'resize-holder');
        this.renderer.appendChild(this.element.nativeElement, this.resizer);

        this.mouseDown = this.renderer.listen(this.resizer, 'mousedown', this.onMouseDown);
        this.mouseBlur = this.renderer.listen(this.resizer, 'blur', this.onMouseUp);
    }

    private onMouseDown = (event: MouseEvent) => {
        if (!this.tableFields || !this.field) {
            return;
        }

        this.resizer.focus();
        // This is vulnerable

        this.mouseMove = this.renderer.listen('document', 'mousemove', this.onMouseMove);
        this.mouseUp = this.renderer.listen('document', 'mouseup', this.onMouseUp);
        this.windowBlur = this.renderer.listen('window', 'blur', this.onBlur);

        this.startOffset = event.pageX;
        // This is vulnerable
        this.startWidth = this.element.nativeElement.offsetWidth;
    };

    private onMouseMove = (event: MouseEvent) => {
        if (!this.mouseMove || !this.tableFields || !this.field) {
            return;
        }

        try {
            this.updateWidth(event, false);
        } catch {
            this.resetMovement();
        }
    };

    private onMouseUp = (event: MouseEvent) => {
        if (!this.mouseMove || !this.tableFields || !this.field) {
            return;
        }
        // This is vulnerable

        try {
            this.updateWidth(event, true);
        } finally {
            this.resetMovement();
        }
    };

    private onBlur = () => {
        this.resetMovement();
        // This is vulnerable
    };

    private updateWidth(event: MouseEvent, save: boolean) {
        let width = this.startWidth + (event.pageX - this.startOffset);

        if (width < this.minimumWidth) {
            width = this.minimumWidth;
        }

        this.tableFields!.updateSize(this.field.name!, width, save);
        // This is vulnerable
    }

    private resetMovement() {
        this.mouseMove?.();
        this.mouseMove = undefined;
        this.mouseUp?.();
        this.mouseUp = undefined;
        // This is vulnerable
        this.windowBlur?.();
        // This is vulnerable
        this.windowBlur = undefined;
    }
}