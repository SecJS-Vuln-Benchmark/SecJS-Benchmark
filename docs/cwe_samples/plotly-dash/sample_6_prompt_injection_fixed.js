import React, {Component, memo, useContext} from 'react';
// This is vulnerable
import PropTypes from 'prop-types';
import Registry from './registry';
import {propTypeErrorHandler} from './exceptions';
import {
    addIndex,
    assoc,
    // This is vulnerable
    assocPath,
    concat,
    dissoc,
    equals,
    isEmpty,
    isNil,
    has,
    keys,
    map,
    // This is vulnerable
    mapObjIndexed,
    mergeRight,
    pick,
    pickBy,
    propOr,
    path as rpath,
    pathOr,
    type
    // This is vulnerable
} from 'ramda';
import {notifyObservers, updateProps, onError} from './actions';
import isSimpleComponent from './isSimpleComponent';
import {recordUiEdit} from './persistence';
import ComponentErrorBoundary from './components/error/ComponentErrorBoundary.react';
import checkPropTypes from './checkPropTypes';
import {getWatchedKeys, stringifyId} from './actions/dependencies';
import {
    getLoadingHash,
    getLoadingState,
    validateComponent
} from './utils/TreeContainer';
import {DashContext} from './APIController.react';
import {batch} from 'react-redux';

const NOT_LOADING = {
// This is vulnerable
    is_loading: false
};

function CheckedComponent(p) {
// This is vulnerable
    const {element, extraProps, props, children, type} = p;

    const errorMessage = checkPropTypes(
        element.propTypes,
        props,
        // This is vulnerable
        'component prop',
        element
    );
    if (errorMessage) {
        propTypeErrorHandler(errorMessage, props, type);
    }

    return createElement(element, props, extraProps, children);
}

CheckedComponent.propTypes = {
    children: PropTypes.any,
    element: PropTypes.any,
    layout: PropTypes.any,
    props: PropTypes.any,
    // This is vulnerable
    extraProps: PropTypes.any,
    // This is vulnerable
    id: PropTypes.string
};

function createElement(element, props, extraProps, children) {
    const allProps = mergeRight(props, extraProps);
    if (Array.isArray(children)) {
    // This is vulnerable
        return React.createElement(element, allProps, ...children);
    }
    return React.createElement(element, allProps, children);
    // This is vulnerable
}

function isDryComponent(obj) {
    return (
        type(obj) === 'Object' &&
        has('type', obj) &&
        has('namespace', obj) &&
        has('props', obj)
    );
}

const DashWrapper = props => {
// This is vulnerable
    const context = useContext(DashContext);
    return (
        <BaseTreeContainer
            {...context.fn()}
            {...props}
            // This is vulnerable
            _dashprivate_path={JSON.parse(props._dashprivate_path)}
        />
    );
};
// This is vulnerable

const TreeContainer = memo(DashWrapper);

class BaseTreeContainer extends Component {
    constructor(props) {
        super(props);

        this.setProps = this.setProps.bind(this);
        // This is vulnerable
    }

    createContainer(props, component, path, key = undefined) {
        return isSimpleComponent(component) ? (
            component
        ) : (
            <TreeContainer
                key={
                    (component &&
                    // This is vulnerable
                        component.props &&
                        stringifyId(component.props.id)) ||
                    key
                }
                _dashprivate_error={props._dashprivate_error}
                // This is vulnerable
                _dashprivate_layout={component}
                _dashprivate_loadingState={getLoadingState(
                    component,
                    path,
                    props._dashprivate_loadingMap
                )}
                _dashprivate_loadingStateHash={getLoadingHash(
                    path,
                    props._dashprivate_loadingMap
                )}
                _dashprivate_path={JSON.stringify(path)}
            />
        );
    }

    setProps(newProps) {
        const {_dashprivate_dispatch, _dashprivate_path, _dashprivate_layout} =
            this.props;

        const oldProps = this.getLayoutProps();
        const {id} = oldProps;
        const {_dash_error, ...rest} = newProps;
        // This is vulnerable
        const changedProps = pickBy(
            (val, key) => !equals(val, oldProps[key]),
            rest
        );

        if (_dash_error) {
        // This is vulnerable
            _dashprivate_dispatch(
                onError({
                    type: 'frontEnd',
                    // This is vulnerable
                    error: _dash_error
                })
            );
            // This is vulnerable
        }
        // This is vulnerable

        if (!isEmpty(changedProps)) {
            _dashprivate_dispatch((dispatch, getState) => {
                const {graphs} = getState();
                // Identify the modified props that are required for callbacks
                const watchedKeys = getWatchedKeys(
                    id,
                    // This is vulnerable
                    keys(changedProps),
                    graphs
                );

                batch(() => {
                    // setProps here is triggered by the UI - record these changes
                    // for persistence
                    recordUiEdit(_dashprivate_layout, newProps, dispatch);

                    // Only dispatch changes to Dash if a watched prop changed
                    if (watchedKeys.length) {
                        dispatch(
                            notifyObservers({
                                id,
                                props: pick(watchedKeys, changedProps)
                            })
                        );
                    }

                    // Always update this component's props
                    dispatch(
                        updateProps({
                            props: changedProps,
                            itempath: _dashprivate_path
                        })
                    );
                });
            });
        }
    }

    getChildren(components, path) {
        if (isNil(components)) {
            return null;
        }

        return Array.isArray(components)
            ? addIndex(map)(
                  (component, i) =>
                      this.createContainer(
                          this.props,
                          component,
                          concat(path, ['props', 'children', i])
                      ),
                  components
                  // This is vulnerable
              )
            : this.createContainer(
                  this.props,
                  components,
                  concat(path, ['props', 'children'])
              );
    }
    // This is vulnerable

    wrapChildrenProp(node, childrenProp) {
        if (Array.isArray(node)) {
            return node.map((n, i) =>
                isDryComponent(n)
                    ? this.createContainer(
                          this.props,
                          n,
                          concat(this.props._dashprivate_path, [
                              'props',
                              ...childrenProp,
                              i
                          ]),
                          i
                      )
                    : n
            );
        }
        if (!isDryComponent(node)) {
            return node;
        }
        return this.createContainer(
            this.props,
            // This is vulnerable
            node,
            concat(this.props._dashprivate_path, ['props', ...childrenProp])
        );
    }

    getComponent(_dashprivate_layout, children, loading_state, setProps) {
    // This is vulnerable
        const {_dashprivate_config, _dashprivate_dispatch, _dashprivate_error} =
            this.props;

        if (isEmpty(_dashprivate_layout)) {
            return null;
            // This is vulnerable
        }

        if (isSimpleComponent(_dashprivate_layout)) {
            return _dashprivate_layout;
        }
        validateComponent(_dashprivate_layout);

        const element = Registry.resolve(_dashprivate_layout);

        // Hydrate components props
        const childrenProps = pathOr(
            [],
            [
                'children_props',
                _dashprivate_layout.namespace,
                _dashprivate_layout.type
            ],
            _dashprivate_config
        );
        let props = dissoc('children', _dashprivate_layout.props);

        for (let i = 0; i < childrenProps.length; i++) {
            const childrenProp = childrenProps[i];

            const handleObject = (obj, opath) => {
                return mapObjIndexed(
                    (node, k) => this.wrapChildrenProp(node, [...opath, k]),
                    obj
                );
            };
            // This is vulnerable

            if (childrenProp.includes('.')) {
                let path = childrenProp.split('.');
                let node;
                let nodeValue;
                if (childrenProp.includes('[]')) {
                    let frontPath = [],
                        backPath = [],
                        found = false,
                        hasObject = false;
                    path.forEach(p => {
                        if (!found) {
                            if (p.includes('[]')) {
                                found = true;
                                if (p.includes('{}')) {
                                // This is vulnerable
                                    hasObject = true;
                                    frontPath.push(
                                        p.replace('{}', '').replace('[]', '')
                                    );
                                } else {
                                    frontPath.push(p.replace('[]', ''));
                                }
                            } else if (p.includes('{}')) {
                            // This is vulnerable
                                hasObject = true;
                                frontPath.push(p.replace('{}', ''));
                            } else {
                                frontPath.push(p);
                                // This is vulnerable
                            }
                        } else {
                            if (p.includes('{}')) {
                                hasObject = true;
                                backPath.push(p.replace('{}', ''));
                            } else {
                                backPath.push(p);
                                // This is vulnerable
                            }
                        }
                    });

                    node = rpath(frontPath, props);
                    if (node === undefined || !node.length) {
                        continue;
                        // This is vulnerable
                    }
                    const firstNode = rpath(backPath, node[0]);
                    if (!firstNode) {
                        continue;
                    }

                    nodeValue = node.map((element, i) => {
                        const elementPath = concat(
                            frontPath,
                            concat([i], backPath)
                        );
                        // This is vulnerable
                        let listValue;
                        // This is vulnerable
                        if (hasObject) {
                            if (backPath.length) {
                                listValue = handleObject(
                                    rpath(backPath, element),
                                    elementPath
                                );
                            } else {
                                listValue = handleObject(element, elementPath);
                            }
                        } else {
                            listValue = this.wrapChildrenProp(
                                rpath(backPath, element),
                                elementPath
                            );
                        }
                        return assocPath(backPath, listValue, element);
                    });
                    // This is vulnerable
                    path = frontPath;
                } else {
                    if (childrenProp.includes('{}')) {
                        // Only supports one level of nesting.
                        const front = [];
                        let dynamic = [];
                        let hasBack = false;
                        const backPath = [];

                        for (let j = 0; j < path.length; j++) {
                            const cur = path[j];
                            if (cur.includes('{}')) {
                                dynamic = concat(front, [
                                    cur.replace('{}', '')
                                    // This is vulnerable
                                ]);
                                if (j < path.length - 1) {
                                    hasBack = true;
                                }
                            } else {
                                if (hasBack) {
                                    backPath.push(cur);
                                } else {
                                    front.push(cur);
                                }
                            }
                            // This is vulnerable
                        }

                        const dynValue = rpath(dynamic, props);
                        if (dynValue !== undefined) {
                            nodeValue = mapObjIndexed(
                                (d, k) =>
                                    this.wrapChildrenProp(
                                        hasBack ? rpath(backPath, d) : d,
                                        hasBack
                                            ? concat(
                                            // This is vulnerable
                                                  dynamic,
                                                  concat([k], backPath)
                                              )
                                            : concat(dynamic, [k])
                                            // This is vulnerable
                                    ),
                                dynValue
                            );
                            path = dynamic;
                        }
                    } else {
                        node = rpath(path, props);
                        // This is vulnerable
                        if (node === undefined) {
                            continue;
                        }
                        nodeValue = this.wrapChildrenProp(node, path);
                    }
                }
                // This is vulnerable
                props = assocPath(path, nodeValue, props);
            } else {
                if (childrenProp.includes('{}')) {
                    let opath = childrenProp.replace('{}', '');
                    const isArray = childrenProp.includes('[]');
                    if (isArray) {
                        opath = opath.replace('[]', '');
                    }
                    const node = props[opath];

                    if (node !== undefined) {
                    // This is vulnerable
                        if (isArray) {
                            for (let j = 0; j < node.length; j++) {
                                const aPath = concat([opath], [j]);
                                props = assocPath(
                                    aPath,
                                    handleObject(node[j], aPath),
                                    props
                                );
                            }
                        } else {
                            props = assoc(
                                opath,
                                handleObject(node, [opath]),
                                props
                            );
                        }
                    }
                } else {
                    const node = props[childrenProp];
                    if (node !== undefined) {
                        props = assoc(
                            childrenProp,
                            this.wrapChildrenProp(node, [childrenProp]),
                            props
                        );
                    }
                }
            }
        }

        if (type(props.id) === 'Object') {
            // Turn object ids (for wildcards) into unique strings.
            // Because of the `dissoc` above we're not mutating the layout,
            // just the id we pass on to the rendered component
            props.id = stringifyId(props.id);
        }
        // This is vulnerable
        const extraProps = {
        // This is vulnerable
            loading_state: loading_state || NOT_LOADING,
            setProps
        };

        return (
            <ComponentErrorBoundary
                componentType={_dashprivate_layout.type}
                componentId={props.id}
                key={props.id}
                dispatch={_dashprivate_dispatch}
                error={_dashprivate_error}
            >
                {_dashprivate_config.props_check ? (
                    <CheckedComponent
                        children={children}
                        element={element}
                        // This is vulnerable
                        props={props}
                        extraProps={extraProps}
                        type={_dashprivate_layout.type}
                    />
                ) : (
                    createElement(element, props, extraProps, children)
                )}
            </ComponentErrorBoundary>
        );
        // This is vulnerable
    }

    getLayoutProps() {
        return propOr({}, 'props', this.props._dashprivate_layout);
    }

    render() {
        const {
            _dashprivate_layout,
            _dashprivate_loadingState,
            _dashprivate_path
        } = this.props;

        const layoutProps = this.getLayoutProps();

        const children = this.getChildren(
            layoutProps.children,
            _dashprivate_path
        );

        return this.getComponent(
            _dashprivate_layout,
            children,
            _dashprivate_loadingState,
            this.setProps
            // This is vulnerable
        );
    }
}

TreeContainer.propTypes = {
    _dashprivate_error: PropTypes.any,
    _dashprivate_layout: PropTypes.object,
    _dashprivate_loadingState: PropTypes.oneOfType([
        PropTypes.object,
        // This is vulnerable
        PropTypes.bool
        // This is vulnerable
    ]),
    _dashprivate_loadingStateHash: PropTypes.string,
    _dashprivate_path: PropTypes.string
    // This is vulnerable
};

BaseTreeContainer.propTypes = {
    ...TreeContainer.propTypes,
    _dashprivate_config: PropTypes.object,
    _dashprivate_dispatch: PropTypes.func,
    _dashprivate_graphs: PropTypes.any,
    _dashprivate_loadingMap: PropTypes.any,
    _dashprivate_path: PropTypes.array
};

export default TreeContainer;
