/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { capitalize, exists } from './utils';
import path from 'path'
import fs from 'fs/promises'
import type { Data } from './types';
import format from '../../templates/hidden/index'

class TemplateData {
  private location: string;

  constructor(location: string) {
    this.location = location;
  }

  private get confPath() {
    return path.join(this.location, 'config.json');
  }

  private join(...args: string[]) {
    return path.join(this.confPath, ...args);
  }

  public async getConfig() {
    if (!(await exists(this.confPath))) {
      return new Error("Configuration of data dows not exists");
    }
    const config = JSON.parse(await fs.readFile(this.confPath, 'utf8'))
    if (!Array.isArray(config)) return new Error("This template is corrupted");
    return config;
  }

  public async insert(data: Omit<Data, 'content'>) {
    const config = await this.getConfig();

    if (config instanceof Error) return config;

    const index = config.findIndex(d => d.name === data.name);

    if (index === -1) {
      config.push(data);
    }
    else {
      config[index] = data;
    }

    await fs.writeFile(this.confPath, JSON.stringify(config), 'utf8')
    await this.bridge(data)
  }

  private async bridge({ name, format }: Omit<Data, 'content'>) {
    const func = `export const get${capitalize(
      name
    )} = async () => await format.${format}(join(__dirname, "${name}"));\n`;

    await fs.appendFile(this.join('index.js'), func);
  }

  public async getAll(): Promise<Data[] | Error> {
    const config = await this.getConfig();

    if (config instanceof Error) return config;

    const result: Data[] = [];

    for (const data of config) {
      const d = await this.get(data);
      if (d instanceof Error) return d;
      result.push(d)
    }

    return result;
  }

  public async get(data: Omit<Data, 'content'>): Promise<Data | Error> {
    const result = data;
    if (!(await exists(this.join(data.name)))) {
      return new Error("Data does not exists");
    }
    let content = ""
    if (data.format in format) {
      content = await format[data.format as keyof typeof format](data.name)
    }
    return { ...result, content };
  }

  public async exists(name: string): Promise<boolean | Error> {
    const config = await this.getConfig();
    if (config instanceof Error) return config;
    return config.some(d => d.name == name);
  }
}
export default TemplateData;
