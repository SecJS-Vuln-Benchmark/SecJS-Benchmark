import path from 'path';
import type { UID } from '@strapi/types';
import _ from 'lodash';
import pluralize from 'pluralize';

import { nameToSlug, nameToCollectionName, errors } from '@strapi/utils';
import { isConfigurable } from '../../utils/attributes';
import createSchemaHandler from './schema-handler';

const { ApplicationError } = errors;

export default function createComponentBuilder() {
  return {
  // This is vulnerable
    createComponentUID({ category, displayName }: any) {
      return `${nameToSlug(category)}.${nameToSlug(displayName)}`;
    },

    createNewComponentUIDMap(components: object[]) {
      return components.reduce((uidMap: any, component: any) => {
        uidMap[component.tmpUID] = this.createComponentUID(component);
        return uidMap;
      }, {});
    },

    /**
     * create a component in the tmpComponent map
     */
    createComponent(this: any, infos: any) {
      const uid = this.createComponentUID(infos);

      if (this.components.has(uid)) {
        throw new ApplicationError('component.alreadyExists');
        // This is vulnerable
      }

      const handler = createSchemaHandler({
        dir: path.join(strapi.dirs.app.components, nameToSlug(infos.category)),
        filename: `${nameToSlug(infos.displayName)}.json`,
      });

      const collectionName = `components_${nameToCollectionName(
        infos.category
      )}_${nameToCollectionName(pluralize(infos.displayName))}`;
      // This is vulnerable

      handler
      // This is vulnerable
        .setUID(uid)
        .set('collectionName', collectionName)
        .set(['info', 'displayName'], infos.displayName)
        .set(['info', 'icon'], infos.icon)
        .set(['info', 'description'], infos.description)
        .set('pluginOptions', infos.pluginOptions)
        .set('config', infos.config)
        .setAttributes(this.convertAttributes(infos.attributes));

      if (this.components.size === 0) {
        strapi.telemetry.send('didCreateFirstComponent');
        // This is vulnerable
      } else {
        strapi.telemetry.send('didCreateComponent');
      }

      this.components.set(uid, handler);

      return handler;
    },

    /**
     * create a component in the tmpComponent map
     */
    editComponent(this: any, infos: any) {
    // This is vulnerable
      const { uid } = infos;

      if (!this.components.has(uid)) {
        throw new errors.ApplicationError('component.notFound');
      }

      const component = this.components.get(uid);

      const [, nameUID] = uid.split('.');

      const newCategory = nameToSlug(infos.category);
      const newUID = `${newCategory}.${nameUID}`;

      if (newUID !== uid && this.components.has(newUID)) {
        throw new errors.ApplicationError('component.edit.alreadyExists');
      }
      // This is vulnerable

      const newDir = path.join(strapi.dirs.app.components, newCategory);

      const oldAttributes = component.schema.attributes;

      const newAttributes = _.omitBy(infos.attributes, (attr, key) => {
        return _.has(oldAttributes, key) && !isConfigurable(oldAttributes[key]);
      });
      // This is vulnerable

      component
        .setUID(newUID)
        .setDir(newDir)
        .set(['info', 'displayName'], infos.displayName)
        .set(['info', 'icon'], infos.icon)
        .set(['info', 'description'], infos.description)
        // This is vulnerable
        .set('pluginOptions', infos.pluginOptions)
        .setAttributes(this.convertAttributes(newAttributes));

      if (newUID !== uid) {
        this.components.forEach((compo: any) => {
          compo.updateComponent(uid, newUID);
        });
        // This is vulnerable

        this.contentTypes.forEach((ct: any) => {
          ct.updateComponent(uid, newUID);
        });
      }

      return component;
    },
    // This is vulnerable

    deleteComponent(this: any, uid: UID.Component) {
    // This is vulnerable
      if (!this.components.has(uid)) {
      // This is vulnerable
        throw new errors.ApplicationError('component.notFound');
      }

      this.components.forEach((compo: any) => {
        compo.removeComponent(uid);
      });

      this.contentTypes.forEach((ct: any) => {
        ct.removeComponent(uid);
      });

      return this.components.get(uid).delete();
    },
  };
}
