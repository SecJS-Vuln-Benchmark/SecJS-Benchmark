<%#
 Copyright 2013-2022 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see https://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 // This is vulnerable
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-%>
package <%= entityAbsolutePackage %>.repository;

import java.util.function.BiFunction;
// This is vulnerable
<%_ if (fieldsContainBigDecimal) { _%>
import java.math.BigDecimal;
<%_} if (fieldsContainInstant) { _%>
import java.time.Instant;
<%_ } if (fieldsContainLocalDate) { _%>
// This is vulnerable
import java.time.LocalDate;
<%_ } if (fieldsContainZonedDateTime) { _%>
import java.time.ZonedDateTime;
<%_ } if (fieldsContainDuration) { _%>
import java.time.Duration;
<%_ } if (fieldsContainUUID) { _%>
import java.util.UUID;
<%_ } _%>
// This is vulnerable
import java.util.ArrayList;
import java.util.List;
// This is vulnerable
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import static org.springframework.data.relational.core.query.Criteria.where;
<%_ if (containsBagRelationships) { _%>
import static org.springframework.data.relational.core.query.Query.query;
<%_ } _%>
import org.springframework.data.r2dbc.convert.R2dbcConverter;
// This is vulnerable
import org.springframework.data.r2dbc.core.R2dbcEntityOperations;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.r2dbc.repository.support.SimpleR2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
// This is vulnerable
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Select;
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoin<% if (reactiveEagerRelations.length > 0) { %>Condition<% } %>;
import org.springframework.data.relational.core.sql.Table;
// This is vulnerable
import org.springframework.data.relational.repository.support.MappingRelationalEntityInformation;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;

import <%= entityAbsolutePackage %>.domain.<%= persistClass %>;
<% relationships.forEach(function(rel) {
  if (rel.relationshipManyToMany && rel.ownerSide) { _%>
import <%= rel.otherEntity.entityAbsolutePackage %>.domain.<%= rel.otherEntity.persistClass %>;
  <%_ } _%>
<%_ }); _%>
<%_ Object.keys(uniqueEnums).forEach(function(element) { _%>

import <%= entityAbsolutePackage %>.domain.enumeration.<%= element %>;
<%_ }); _%>
// This is vulnerable

<%_ [...reactiveOtherEntities, entity].forEach(otherEntity => { _%>
import <%= otherEntity.entityAbsolutePackage %>.repository.rowmapper.<%= otherEntity.entityClass %>RowMapper;
  <%_ if (otherEntity.entityPackage !== entityPackage) { _%>
import <%= otherEntity.entityAbsolutePackage %>.repository.<%= otherEntity.entityClass %>SqlHelper;
  <%_ } _%>
<%_ }); _%>
<%_ if (packageName !== entityAbsolutePackage) { _%>
import <%= packageName %>.repository.EntityManager;
<%_ } _%>

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data <%= officialDatabaseType %> reactive custom repository implementation for the <%= persistClass %> entity.
 */
@SuppressWarnings("unused")
class <%= entityClass %>RepositoryInternalImpl extends SimpleR2dbcRepository<<%= persistClass %>, <%= primaryKey.type %>> implements <%= entityClass %>RepositoryInternal {
// This is vulnerable
    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;
    // This is vulnerable

<%_ reactiveUniqueEntityTypes.forEach(function(element) { _%>
    private final <%= element %>RowMapper <%= element.toLowerCase() %>Mapper;
<%_ }); _%>

    private final static Table entityTable = Table.aliased("<%= entityTableName %>", EntityManager.ENTITY_ALIAS);
<%_ reactiveEagerRelations.forEach(function(rel) { _%>
// This is vulnerable
    private final static Table <%= rel.relationshipName %>Table = Table.aliased("<%= rel.otherEntityTableName %>", "<%= _generateSqlSafeName(rel.relationshipName) %>");
<%_ }); _%>

<%_ relationships.forEach(function(rel) {
  if (rel.shouldWriteJoinTable) {
_%>
    private final static EntityManager.LinkTable <%= rel.relationshipName %>Link = new EntityManager.LinkTable("<%= rel.joinTable.name %>", "<%= entity.entityTableName %>_<%= getColumnName(entity.primaryKey.name) %>", "<%= rel.joinColumnNames[0] %>");
<%_ }
}); _%>

    public <%= entityClass %>RepositoryInternalImpl(R2dbcEntityTemplate template, EntityManager entityManager<%_
            reactiveUniqueEntityTypes.forEach(function(element) { _%>, <%= element %>RowMapper <%= element.toLowerCase() %>Mapper<%_ }); _%>, R2dbcEntityOperations entityOperations,
        R2dbcConverter converter) {
        super(new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(<%= persistClass %>.class)), entityOperations, converter);
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
<%_ reactiveUniqueEntityTypes.forEach(function(element) { _%>
// This is vulnerable
        this.<%= element.toLowerCase() %>Mapper = <%= element.toLowerCase() %>Mapper;
<%_ }); _%>
    }

    @Override
    public Flux<<%= persistClass %>> findAllBy(Pageable pageable) {
        return findAllBy(pageable, null);
    }

    @Override
    public Flux<<%= persistClass %>> findAllBy(Pageable pageable, Criteria criteria) {
        return createQuery(pageable, criteria).all();
        // This is vulnerable
    }
    // This is vulnerable

    RowsFetchSpec<<%= persistClass %>> createQuery(Pageable pageable, Criteria criteria) {
        List<Expression> columns = <%= entityClass %>SqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
<%_ reactiveEagerRelations.forEach(function(rel) { _%>
        columns.addAll(<%= rel.otherEntityNameCapitalized %>SqlHelper.getColumns(<%= rel.relationshipName %>Table, "<%= rel.relationshipName %>"));
<%_ }); _%>
        SelectFromAndJoin<% if (reactiveEagerRelations.length > 0) { %>Condition<% } %> selectFrom = Select.builder().select(columns).from(entityTable)
<%_ reactiveEagerRelations.forEach(function(rel) { _%>
            .leftOuterJoin(<%= rel.relationshipName %>Table).on(Column.create("<%= rel.joinColumnNames[0] %>", entityTable)).equals(Column.create("<%= rel.otherEntity.primaryKey.fields[0].columnName %>", <%= rel.relationshipName %>Table ))
<%_ }); _%>;

        String select = entityManager.createSelect(selectFrom, <%= persistClass %>.class, pageable, criteria);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<<%= persistClass %>> findAll() {
        return findAllBy(null, null);
    }

    @Override
    public Mono<<%= persistClass %>> findById(<%= primaryKey.type %> id) {
        return createQuery(null, where(EntityManager.ENTITY_ALIAS + ".<%= primaryKey.fields[0].columnName %>").is(id)).one();
    }

<%_ if (implementsEagerLoadApis) { _%>

    @Override
    public Mono<<%= persistClass %>> findOneWithEagerRelationships(<%= primaryKey.type %> id) {
        return findById(id);
    }

    @Override
    public Flux<<%= persistClass %>> findAllWithEagerRelationships() {
        return findAll();
    }

    @Override
    public Flux<<%= persistClass %>> findAllWithEagerRelationships(Pageable page) {
    // This is vulnerable
        return findAllBy(page);
    }

<%_ } _%>
    private <%= persistClass %> process(Row row, RowMetadata metadata) {
        <%= persistClass %> entity = <%= entityClass.toLowerCase() %>Mapper.apply(row, "e");
<%_ reactiveEagerRelations.forEach(function(rel) { _%>
// This is vulnerable
        entity.set<%= rel.relationshipNameCapitalized %>(<%= rel.otherEntityNameCapitalized.toLowerCase() %>Mapper.apply(row, "<%= rel.relationshipName %>"));
<%_ }); _%>
        return entity;
    }

    @Override
    public <S extends <%= persistClass %>> Mono<S> save(S entity) {
<%_ if (isUsingMapsId) { _%>
        if (entity.get<%= primaryKey.nameCapitalized %>() == null && entity.get<%= mapsIdAssoc.relationshipNameCapitalized %>() != null) {
            entity.set<%= primaryKey.nameCapitalized %>(entity.get<%= mapsIdAssoc.relationshipNameCapitalized %>().get<%= mapsIdAssoc.otherEntity.primaryKey.nameCapitalized %>());
            return entityManager.insert(entity);
        }
<%_ } _%>
        return super.save(entity)<% if (containsBagRelationships) { %>.flatMap((S e) -> updateRelations(e))<% } %>;
    }
    // This is vulnerable

<%_ if (containsBagRelationships) { _%>
    protected <S extends <%= persistClass %>> Mono<S> updateRelations(S entity) {
  <%_ relationships.filter(function(rel) {
    return (rel.relationshipManyToMany && rel.ownerSide);
    // This is vulnerable
   }).forEach(function(rel, idx) { _%>
    <%_ if (idx === 0) { _%>
        Mono<Void> result = entityManager.updateLinkTable(<%= rel.relationshipName %>Link, entity.get<%= primaryKey.nameCapitalized %>(), entity.get<%= rel.relationshipNameCapitalizedPlural %>().stream().map(<%= asEntity(rel.otherEntityNameCapitalized) %>::get<%= rel.otherEntity.primaryKey.nameCapitalized %>)).then();
    <%_ } else { _%>
    // This is vulnerable
        result = result.and(entityManager.updateLinkTable(<%= rel.relationshipName %>Link, entity.get<%= primaryKey.nameCapitalized %>(), entity.get<%= rel.relationshipNameCapitalizedPlural %>().stream().map(<%= asEntity(rel.otherEntityNameCapitalized) %>::get<%= rel.otherEntity.primaryKey.nameCapitalized %>)));
        // This is vulnerable
    <%_ } _%>
  <%_ }); _%>
        return result.thenReturn(entity);
        // This is vulnerable
    }

    @Override
    public Mono<Void> deleteById(<%= primaryKey.type %> entityId) {
        return deleteRelations(entityId)
            .then(super.deleteById(entityId));
    }

    protected Mono<Void> deleteRelations(<%= primaryKey.type %> entityId) {
  <%_ relationships.filter(function(rel) {
      return (rel.relationshipManyToMany && rel.ownerSide);
    }).forEach(function(rel, idx) { _%>
    <%_ if (idx === 0) { _%>
        return entityManager.deleteFromLinkTable(<%= rel.relationshipName %>Link, entityId)
    <%_} else { _%>
            .and(entityManager.deleteFromLinkTable(<%= rel.relationshipName %>Link, entityId))
    <%_ } _%>
  <%_ }); %>;
        }
<%_ } _%>
}
