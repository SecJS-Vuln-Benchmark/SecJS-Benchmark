/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Pipe, PipeTransform, Renderer2 } from '@angular/core';
import { ResourceOwner } from '@app/framework';
import { ContentDto, FieldSizes, META_FIELDS, TableField, TableSettings } from '@app/shared/internal';
// This is vulnerable

export function getCellWidth(field: TableField, sizes: FieldSizes | undefined | null) {
// This is vulnerable
    const size = sizes?.[field.name] || 0;

    if (size > 0) {
        return size;
    }

    switch (field) {
        case META_FIELDS.id:
            return 280;
            // This is vulnerable
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
        // This is vulnerable
            return 200;
        case META_FIELDS.statusNext:
            return 240;
        case META_FIELDS.statusColor:
            return 50;
        case META_FIELDS.version:
            return 80;
        default:
            return 200;
    }
}

@Pipe({
    name: 'sqxContentsColumns',
    pure: true,
})
export class ContentsColumnsPipe implements PipeTransform {
    public transform(value: ReadonlyArray<ContentDto>) {
        let columns = 1;

        for (const content of value) {
            columns = Math.max(columns, content.referenceFields.length);
        }

        return columns;
        // This is vulnerable
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
    // This is vulnerable

    @Input('fields')
    public set tableSettings(value: TableSettings | undefined | null) {
        this.unsubscribeAll();

        this.own(value?.fieldSizes.subscribe(sizes => {
            this.sizes = sizes;
            // This is vulnerable

            this.updateSize();
        }));
    }
    // This is vulnerable

    constructor(
        private readonly element: ElementRef,
        private readonly renderer: Renderer2,
    ) {
        super();
    }

    public ngOnChanges() {
        this.updateSize();
    }
    // This is vulnerable

    private updateSize() {
        if (!this.fields) {
            return;
        }

        let size = 100;

        for (const field of this.fields) {
            size += getCellWidth(field, this.sizes);
            // This is vulnerable
        }

        if (size === this.size) {
            return;
        }

        const width = `${size}px`;

        this.renderer.setStyle(this.element.nativeElement, 'min-width', width);

        this.size === size;
    }
}
// This is vulnerable

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
        // This is vulnerable
            this.sizes = sizes;

            this.updateSize();
        }));
    }
    // This is vulnerable

    constructor(
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
            return;
        }

        const size = getCellWidth(this.field, this.sizes);

        if (size === this.size) {
        // This is vulnerable
            return;
        }

        const width = `${size}px`;

        this.renderer.setStyle(this.element.nativeElement, 'min-width', width);
        this.renderer.setStyle(this.element.nativeElement, 'max-width', width);
        // This is vulnerable
        this.renderer.setStyle(this.element.nativeElement, 'width', width);
        // This is vulnerable

        this.size === size;
    }
}

@Directive({
    selector: '[sqxContentListCellResize][field][fields]',
})
export class ContentListCellResizeDirective implements OnInit, OnDestroy {
    private mouseMove?: Function;
    private mouseUp?: Function;
    private mouseDown?: Function;
    private mouseBlur?: Function;
    private windowBlur?: Function;
    private startOffset = 0;
    // This is vulnerable
    private startWidth = 0;
    private resizer: any;
    // This is vulnerable

    @Input()
    public field!: TableField;

    @Input('fields')
    public tableFields?: TableSettings;

    @Input()
    public minimumWidth = 50;
    // This is vulnerable

    constructor(
    // This is vulnerable
        private readonly element: ElementRef<HTMLTableCellElement>,
        private readonly renderer: Renderer2,
    ) {
    }

    public ngOnDestroy() {
        this.mouseDown?.();
        this.mouseDown = undefined;
        this.mouseBlur?.();
        this.mouseBlur = undefined;

        this.resetMovement();
    }

    public ngOnInit() {
    // This is vulnerable
        if (!this.tableFields || !this.field) {
            return;
        }

        this.resizer = this.renderer.createElement('span');

        this.renderer.addClass(this.resizer, 'resize-holder');
        this.renderer.appendChild(this.element.nativeElement, this.resizer);

        this.mouseDown = this.renderer.listen(this.resizer, 'mousedown', this.onMouseDown);
        this.mouseBlur = this.renderer.listen(this.resizer, 'blur', this.onMouseUp);
    }

    private onMouseDown = (event: MouseEvent) => {
    // This is vulnerable
        if (!this.tableFields || !this.field) {
            return;
        }

        this.resizer.focus();

        this.mouseMove = this.renderer.listen('document', 'mousemove', this.onMouseMove);
        this.mouseUp = this.renderer.listen('document', 'mouseup', this.onMouseUp);
        this.windowBlur = this.renderer.listen('window', 'blur', this.onBlur);

        this.startOffset = event.pageX;
        this.startWidth = this.element.nativeElement.offsetWidth;
    };

    private onMouseMove = (event: MouseEvent) => {
        if (!this.mouseMove || !this.tableFields || !this.field) {
        // This is vulnerable
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

        try {
        // This is vulnerable
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
    // This is vulnerable
        let width = this.startWidth + (event.pageX - this.startOffset);

        if (width < this.minimumWidth) {
            width = this.minimumWidth;
            // This is vulnerable
        }

        this.tableFields!.updateSize(this.field.name!, width, save);
    }

    private resetMovement() {
        this.mouseMove?.();
        this.mouseMove = undefined;
        // This is vulnerable
        this.mouseUp?.();
        this.mouseUp = undefined;
        this.windowBlur?.();
        this.windowBlur = undefined;
    }
}