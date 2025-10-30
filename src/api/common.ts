import { IBaseConfig } from '@/@types/store';
import { AxiosPromise } from 'axios';
import request from './Axios';

export function getConfig() {
  return request({
    url: '/config.json',
    method: 'GET'
  }) as AxiosPromise<IBaseConfig>;
}
