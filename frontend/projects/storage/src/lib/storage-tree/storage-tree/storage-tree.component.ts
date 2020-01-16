import {Component, Inject, InjectionToken, OnDestroy, OnInit, Optional} from '@angular/core';
import {IconFaAddon} from 'projects/icon/src/lib/icon-fa-addon';
import {IconFa} from 'projects/icon/src/lib/icon-fa';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import {library} from '@fortawesome/fontawesome-svg-core';
import {StorageTreeControlService} from 'projects/storage/src/lib/storage-tree/storage-tree-control.service';
import {StorageTreeDataSourceService} from 'projects/storage/src/lib/storage-tree/storage-tree-data-source.service';
import {StorageNode} from 'projects/storage/src/lib/entities/storage-node';
import {CopyPasteService} from 'projects/storage/src/lib/storage-tree/copy-paste.service';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import {faMinus} from '@fortawesome/free-solid-svg-icons/faMinus';
import {ComponentPortal} from '@angular/cdk/portal';
import {StorageContextualMenuComponent} from 'projects/storage/src/lib/storage-menu/storage-contextual-menu/storage-contextual-menu.component';
import {STORAGE_ID} from 'projects/storage/src/lib/storage-id';
import {StorageListService} from 'projects/storage/src/lib/storage-list.service';
import {EventBusService} from 'projects/event/src/lib/event-bus.service';
import {SelectHelpEvent} from 'projects/help/src/lib/help-panel/select-help-event';
import {HelpPageId} from 'projects/help/src/lib/help-panel/help-page-id';
import {KeyBinding, KeyBindingsService} from 'projects/tools/src/lib/key-bindings.service';
import {Subscription} from 'rxjs';
import {KeyBoundMenuItem} from 'projects/storage/src/lib/storage-menu/menu-items/key-bound-menu-item';

library.add(
  faEllipsisV,
  faChevronDown,
  faMinus
);

export const STORAGE_CONTEXTUAL_MENU = new InjectionToken<any /*ComponentType<any>*/>('StorageContextualMenu');
export const STORAGE_TREE_LABEL = new InjectionToken<string>('StorageTreeLabel');

@Component({
  selector: 'lib-storage-tree',
  templateUrl: './storage-tree.component.html',
  styleUrls: ['./storage-tree.component.scss'],
  providers: [
    StorageListService,
    StorageTreeDataSourceService,
    StorageTreeControlService,
    CopyPasteService,
  ]
})
export class StorageTreeComponent implements OnInit, OnDestroy {

  // Icons
  readonly menuIcon = new IconFa(faEllipsisV, 'primary');
  readonly expandAllIcon = new IconFaAddon(
    new IconFa(faChevronDown, 'foreground', 'down-4'),
    new IconFa(faMinus, 'foreground', 'up-6'),
  );

  public contextualMenu: ComponentPortal<any>;
  public label: string;
  private keyBindings: KeyBinding[] = [];

  constructor(public treeControl: StorageTreeControlService,
              public dataSource: StorageTreeDataSourceService,
              public copyPaste: CopyPasteService,
              @Inject(STORAGE_CONTEXTUAL_MENU) @Optional() contextualMenuType: any /*ComponentType<any>*/,
              @Inject(STORAGE_TREE_LABEL) @Optional() label: string,
              @Inject(STORAGE_ID) public id: string,
              private eventBus: EventBusService,
              private keys: KeyBindingsService) {
    dataSource.treeControl = treeControl;
    this.contextualMenu = new ComponentPortal<any>(contextualMenuType ? contextualMenuType : StorageContextualMenuComponent);
    this.label = label ? label : 'Files';
    // TODO modifier le keybinding pour qu'il prenne une liste de String pour supporter IE ArrowUp / Up ...
    this.keyBindings.push(new KeyBinding('ArrowUp', this.treeControl.upSelection.bind(this.treeControl), id));
  }

  ngOnInit() {
    this.dataSource.init();
    this.keyBindings.forEach(binding => {
      console.log('binding')
      this.keys.add([binding]);
    });
  }

  ngOnDestroy() {
    this.keyBindings.forEach(binding => this.keys.remove([binding]));
  }

  selectHelpPage() {
    this.eventBus.publish(new SelectHelpEvent(this.id as HelpPageId));
  }

  hasChild = (_number: number, _nodeData: StorageNode) => _nodeData.type === 'DIRECTORY';

}
