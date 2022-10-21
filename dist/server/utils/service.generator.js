"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENERAL_SERVICE = void 0;
exports.GENERAL_SERVICE = `import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as qs from "qs";

export namespace Strapi {

  export interface Pagination {
    withCount?: boolean;
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  }

  export interface StrapiResult<T> {
    data: T;
    meta: {
      pagination?: {
        page: number,
        pageSize: number,
        pageCount: number,
        total: number
      }
    }
  }

  export interface StrapiError {
    error: {
      status: 0,
      name: string,
      message: string
    }
  }

  export class StrapiCrudService<T> {

    protected BASE_URL: string;
    protected prefixes: { [key: string]: string } = {};
    protected default_prefix: string = '';
    protected prefix(index: string) {
      return this.prefixes[index] || this.default_prefix || '';
    }

    constructor(protected http: HttpClient) { }

    async parseData(data: any, populate: string[] = []): Promise<T> {
      if (!data) return undefined;
      const keys = populate[0] == '*'
        ? Object.keys(data.attributes).filter(k => typeof data.attributes[k] == 'object' ? 'data' in data.attributes[k] : false)
        : populate.filter(p => p.indexOf('.') == -1);
      for (let key of keys) {
        if (data?.attributes[key] && data?.attributes[key].data) {
          const _populate = populate.filter(p => p.indexOf(\`\${key}.\`) > -1).map(p => p.replace(\`\${key}.\`, ''));
          if (Array.isArray(data.attributes[key].data)) {
            const elements = [];
            for (let element of data.attributes[key].data) {
              const d = await this.parseData(element, _populate);
              elements.push(d);
            }
            data.attributes[key] = elements;
          } else {
            data.attributes[key] = await this.parseData(data.attributes[key].data, _populate);
          }
        }
      }

      return { id: data?.id, ...data?.attributes };
    }

    async find(filters: any = {}, fields: string[] = [], sort?: string, populate: string[] = [], pagination?: Pagination, locale?: string): Promise<StrapiResult<T[]>> {
      const query = qs.stringify({
        fields: fields && fields.length > 0 ? fields.join(',') : '*',
        sort,
        populate: populate && populate.length > 0 ? populate.join(',') : undefined,
        pagination,
        locale,
        filters
      });
      return this.http.get<StrapiResult<T[]>>(\`\${this.BASE_URL}/\${this.prefix('find')}?\${query}\`)
        .toPromise()
        .then(async res => {
          res.data = await Promise.all(res.data?.map(async (d: any) => await this.parseData(d, populate)));
          return res;
        });
    }

    async findOne(id: any, fields: string[] = [], populate: string[] = [], locale?: string): Promise<StrapiResult<T>> {
      const query = qs.stringify({
        fields: fields && fields.length > 0 ? fields.join(',') : '*',
        populate: populate && populate.length > 0 ? populate.join(',') : undefined,
        locale
      });
      return this.http.get<StrapiResult<T>>(\`\${this.BASE_URL}/\${this.prefix('findOne')}/\${id}?\${query}\`)
        .toPromise()
        .then(async res => {
          const d: any = res.data;
          res.data = await this.parseData(d, populate);
          return res;
        });
    }

    async create(entity: T): Promise<StrapiResult<T>> {
      return this.http.post<StrapiResult<T>>(\`\${this.BASE_URL}/\${this.prefix('create')}\`, { data: entity })
        .toPromise()
        .then(async res => {
          const d: any = res.data;
          res.data = await this.parseData(d);
          return res;
        });
    }

    async update(entity: Partial<T>): Promise<StrapiResult<T>> {
      const id = (<any>entity).id;
      return this.http.put<StrapiResult<T>>(\`\${this.BASE_URL}/\${this.prefix('update')}/\${id}\`, { data: entity })
        .toPromise()
        .then(async res => {
          const d: any = res.data;
          res.data = await this.parseData(d);
          return res;
        });
    }

    async delete(id: any): Promise<StrapiResult<T>> {
      return this.http.get<StrapiResult<T>>(\`\${this.BASE_URL}/\${this.prefix('delete')}/\${id}\`)
        .toPromise()
        .then(async res => {
          const d: any = res.data;
          res.data = await this.parseData(d);
          return res;
        });
    }

  }

}`;
