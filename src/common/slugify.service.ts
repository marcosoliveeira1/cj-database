import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugifyService {
  toSlug(value: string): string {
    return slugify(value, { lower: true, strict: true, replacement: '_' });
  }
}
